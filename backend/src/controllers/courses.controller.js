const mysqlPool = require("../../config/mysql.config");

const getCourses = async (req, res) => {
  const { level, search } = req.query;

  try {
    let query = "SELECT course_id, name, level, academic_year FROM COURSE WHERE 1=1";
    const params = [];

    if (level) {
      query += " AND level = ?";
      params.push(level);
    }

    if (search) {
      query += " AND name LIKE ?";
      params.push(`%${search}%`);
    }

    query += " ORDER BY level, name";

    const [courses] = await mysqlPool.execute(query, params);
    res.json(courses);
  } catch (error) {
    console.error("Error obteniendo cursos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getLevels = async (req, res) => {
  try {
    const [levels] = await mysqlPool.execute(
      "SELECT DISTINCT level FROM COURSE ORDER BY level",
    );
    res.json(levels.map((l) => l.level));
  } catch (error) {
    console.error("Error obteniendo niveles:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { getCourses, getLevels };
