const mysqlPool = require("../../config/mysql.config");

const getStudentIdByUserId = async (userId) => {
  const [rows] = await mysqlPool.execute(
    "SELECT student_id FROM STUDENT WHERE user_id = ?",
    [userId],
  );
  return rows.length > 0 ? rows[0].student_id : null;
};

const getRecentDates = async (courseId) => {
  const [dates] = await mysqlPool.execute(
    `SELECT DISTINCT attendance_date FROM ATTENDANCE
     WHERE course_id = ? ORDER BY attendance_date DESC LIMIT 5`,
    [courseId],
  );
  return dates.map((d) => d.attendance_date).reverse();
};

const getAttendanceByCourse = async (req, res) => {
  const { courseId, search } = req.query;

  if (!courseId) {
    return res.status(400).json({ message: "Se requiere courseId" });
  }

  try {
    const dates = await getRecentDates(courseId);

    if (dates.length === 0) {
      const [students] = await mysqlPool.execute(
        `SELECT s.student_id, CONCAT(s.first_name, ' ', s.last_name) AS name
         FROM STUDENT s
         JOIN ENROLLMENT e ON s.student_id = e.student_id
         WHERE e.course_id = ?
         ORDER BY s.last_name`,
        [courseId],
      );
      return res.json({ dates: [], students: students.map((s) => ({ ...s, attendance: {} })) });
    }

    let studentQuery = `
      SELECT DISTINCT s.student_id, CONCAT(s.first_name, ' ', s.last_name) AS name
      FROM STUDENT s
      JOIN ENROLLMENT e ON s.student_id = e.student_id
      WHERE e.course_id = ?
    `;
    const params = [courseId];

    if (search) {
      studentQuery += " AND (s.first_name LIKE ? OR s.last_name LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term);
    }

    studentQuery += " ORDER BY s.last_name, s.first_name";

    const [students] = await mysqlPool.execute(studentQuery, params);

    const [records] = await mysqlPool.execute(
      `SELECT student_id, attendance_date, status, attendance_id
       FROM ATTENDANCE
       WHERE course_id = ? AND attendance_date IN (${dates.map(() => "?").join(",")})`,
      [courseId, ...dates],
    );

    const recordMap = {};
    for (const r of records) {
      const key = `${r.student_id}_${r.attendance_date.toISOString().split("T")[0]}`;
      recordMap[key] = { status: r.status, attendance_id: r.attendance_id };
    }

    const result = students.map((s) => {
      const attendance = {};
      for (const date of dates) {
        const dateStr = date instanceof Date ? date.toISOString().split("T")[0] : date;
        const key = `${s.student_id}_${dateStr}`;
        attendance[dateStr] = recordMap[key] || { status: "Absent", attendance_id: null };
      }
      return { student_id: s.student_id, name: s.name, attendance };
    });

    const formattedDates = dates.map((d) =>
      d instanceof Date ? d.toISOString().split("T")[0] : d,
    );

    res.json({ dates: formattedDates, students: result });
  } catch (error) {
    console.error("Error obteniendo asistencia:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const updateAttendance = async (req, res) => {
  const { studentId, courseId, attendanceDate, status } = req.body;

  if (!studentId || !courseId || !attendanceDate || !status) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  const validStatuses = ["Present", "Absent", "Late"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Estado de asistencia inválido" });
  }

  try {
    const [existing] = await mysqlPool.execute(
      `SELECT attendance_id FROM ATTENDANCE
       WHERE student_id = ? AND course_id = ? AND attendance_date = ?`,
      [studentId, courseId, attendanceDate],
    );

    if (existing.length > 0) {
      await mysqlPool.execute(
        "UPDATE ATTENDANCE SET status = ? WHERE attendance_id = ?",
        [status, existing[0].attendance_id],
      );
    } else {
      await mysqlPool.execute(
        `INSERT INTO ATTENDANCE (student_id, course_id, attendance_date, status)
         VALUES (?, ?, ?, ?)`,
        [studentId, courseId, attendanceDate, status],
      );
    }

    res.json({ message: "Asistencia actualizada" });
  } catch (error) {
    console.error("Error actualizando asistencia:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getMyAttendance = async (req, res) => {
  const { userId } = req.user;
  const { courseId } = req.query;

  try {
    const studentId = await getStudentIdByUserId(userId);
    if (!studentId) {
      return res.status(404).json({ message: "Perfil de estudiante no encontrado" });
    }

    let query = `
      SELECT a.attendance_date, a.status, c.course_id, c.name AS course_name, c.level
      FROM ATTENDANCE a
      JOIN COURSE c ON a.course_id = c.course_id
      WHERE a.student_id = ?
    `;
    const params = [studentId];

    if (courseId) {
      query += " AND a.course_id = ?";
      params.push(courseId);
    }

    query += " ORDER BY c.name, a.attendance_date DESC";

    const [records] = await mysqlPool.execute(query, params);
    res.json(records);
  } catch (error) {
    console.error("Error obteniendo mi asistencia:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getMyAttendanceSummary = async (req, res) => {
  const { userId } = req.user;

  try {
    const studentId = await getStudentIdByUserId(userId);
    if (!studentId) {
      return res.status(404).json({ message: "Perfil de estudiante no encontrado" });
    }

    const [courses] = await mysqlPool.execute(
      `SELECT c.course_id, c.name AS course_name, c.level
       FROM ENROLLMENT e
       JOIN COURSE c ON e.course_id = c.course_id
       WHERE e.student_id = ?
       ORDER BY c.name`,
      [studentId],
    );

    const [records] = await mysqlPool.execute(
      `SELECT course_id, attendance_date, status
       FROM ATTENDANCE
       WHERE student_id = ?
       ORDER BY attendance_date DESC`,
      [studentId],
    );

    const summary = courses.map((course) => {
      const courseRecords = records.filter((r) => r.course_id === course.course_id);
      return {
        course_id: course.course_id,
        course_name: course.course_name,
        level: course.level,
        present: courseRecords.filter((r) => r.status === "Present").length,
        absent: courseRecords.filter((r) => r.status === "Absent").length,
        late: courseRecords.filter((r) => r.status === "Late").length,
        records: courseRecords.map((r) => ({
          attendance_date: r.attendance_date,
          status: r.status,
        })),
      };
    });

    res.json(summary);
  } catch (error) {
    console.error("Error obteniendo resumen de asistencia:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  getAttendanceByCourse,
  updateAttendance,
  getMyAttendance,
  getMyAttendanceSummary,
};
