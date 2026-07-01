const mysqlPool = require("../../config/mysql.config");

const getStudentIdByUserId = async (userId) => {
  const [rows] = await mysqlPool.execute(
    "SELECT student_id FROM STUDENT WHERE user_id = ?",
    [userId],
  );
  return rows.length > 0 ? rows[0].student_id : null;
};

const getGradesByCourse = async (req, res) => {
  const { courseId, search } = req.query;

  if (!courseId) {
    return res.status(400).json({ message: "Se requiere courseId" });
  }

  try {
    let query = `
      SELECT s.student_id, CONCAT(s.first_name, ' ', s.last_name) AS name,
             s.email, s.emergency_contact,
             COALESCE(g.grade_value, 0) AS grade,
             g.description, g.evaluation_date, g.grade_id
      FROM STUDENT s
      JOIN ENROLLMENT e ON s.student_id = e.student_id
      LEFT JOIN GRADE g ON g.student_id = s.student_id AND g.course_id = e.course_id
      WHERE e.course_id = ?
    `;
    const params = [courseId];

    if (search) {
      query += " AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.email LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += " ORDER BY s.last_name, s.first_name";

    const [grades] = await mysqlPool.execute(query, params);
    res.json(grades);
  } catch (error) {
    console.error("Error obteniendo notas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getMyGrades = async (req, res) => {
  const { userId } = req.user;
  const { search } = req.query;

  try {
    const studentId = await getStudentIdByUserId(userId);
    if (!studentId) {
      return res.status(404).json({ message: "Perfil de estudiante no encontrado" });
    }

    let query = `
      SELECT c.course_id, c.name AS course_name, c.level,
             g.grade_value AS grade, g.description, g.evaluation_date
      FROM ENROLLMENT e
      JOIN COURSE c ON e.course_id = c.course_id
      LEFT JOIN GRADE g ON g.student_id = e.student_id AND g.course_id = c.course_id
      WHERE e.student_id = ?
    `;
    const params = [studentId];

    if (search) {
      query += " AND c.name LIKE ?";
      params.push(`%${search}%`);
    }

    query += " ORDER BY c.name";

    const [grades] = await mysqlPool.execute(query, params);
    res.json(grades);
  } catch (error) {
    console.error("Error obteniendo mis notas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { getGradesByCourse, getMyGrades };
