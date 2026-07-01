const mysqlPool = require("../../config/mysql.config");

const getMyProfile = async (req, res) => {
  const { userId, role } = req.user;

  try {
    let query = "";
    if (role === "Student") {
      query =
        "SELECT student_id, first_name, last_name, email FROM STUDENT WHERE user_id = ?";
    } else if (role === "Teacher") {
      query =
        "SELECT teacher_id, first_name, last_name, department FROM TEACHER WHERE user_id = ?";
    } else {
      return res.json({ first_name: "Administrador", last_name: "Sistema", role: "Admin" });
    }

    const [rows] = await mysqlPool.execute(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    res.json({ ...rows[0], role });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { getMyProfile };
