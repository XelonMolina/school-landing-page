const mysqlPool = require("../../config/mysql.config");

const getStudents = async (req, res) => {
  const { courseId, level, search } = req.query;

  try {
    let query = `
      SELECT DISTINCT s.student_id, s.first_name, s.last_name, s.email,
             s.address, s.emergency_contact, s.date_of_birth, u.rut
      FROM STUDENT s
      JOIN USER u ON s.user_id = u.user_id
    `;
    const params = [];
    const conditions = [];

    if (courseId || level) {
      query += " JOIN ENROLLMENT e ON s.student_id = e.student_id";
    }

    if (level) {
      query += " JOIN COURSE c ON e.course_id = c.course_id";
      conditions.push("c.level = ?");
      params.push(level);
    }

    if (courseId) {
      conditions.push("e.course_id = ?");
      params.push(courseId);
    }

    if (search) {
      conditions.push(
        "(s.first_name LIKE ? OR s.last_name LIKE ? OR s.email LIKE ? OR u.rut LIKE ?)",
      );
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY s.last_name, s.first_name";

    const [students] = await mysqlPool.execute(query, params);
    res.json(students);
  } catch (error) {
    console.error("Error obteniendo estudiantes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await mysqlPool.execute(
      `SELECT s.student_id, s.first_name, s.last_name, s.email, s.address,
              s.emergency_contact, s.date_of_birth, u.rut, u.role
       FROM STUDENT s
       JOIN USER u ON s.user_id = u.user_id
       WHERE s.student_id = ?`,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    const [courses] = await mysqlPool.execute(
      `SELECT c.course_id, c.name, c.level, c.academic_year
       FROM ENROLLMENT e
       JOIN COURSE c ON e.course_id = c.course_id
       WHERE e.student_id = ?
       ORDER BY c.name`,
      [id],
    );

    res.json({ ...rows[0], courses });
  } catch (error) {
    console.error("Error obteniendo estudiante:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { getStudents, getStudentById };
