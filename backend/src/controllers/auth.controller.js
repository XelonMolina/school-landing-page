const mysqlPool = require("../../config/mysql.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Función temporal para inyectar usuarios
const registerTemp = async (req, res) => {
  const {
    rut,
    password,
    role,
    firstName,
    lastName,
    dateOfBirth,
    email,
    department,
  } = req.body;

  // Obtenemos una conexión dedicada para usar Transacciones
  const connection = await mysqlPool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Encriptar la contraseña (10 rondas de 'salt' es el estándar de seguridad)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Insertar en la tabla base USER
    const [userResult] = await connection.execute(
      "INSERT INTO USER (rut, password_hash, role) VALUES (?, ?, ?)",
      [rut, hashedPassword, role],
    );
    const newUserId = userResult.insertId;

    // 3. Dependiendo del rol, insertamos en la tabla específica
    if (role === "Student") {
      await connection.execute(
        "INSERT INTO STUDENT (user_id, first_name, last_name, date_of_birth, email) VALUES (?, ?, ?, ?, ?)",
        [newUserId, firstName, lastName, dateOfBirth, email],
      );
    } else if (role === "Teacher") {
      await connection.execute(
        "INSERT INTO TEACHER (user_id, first_name, last_name, department) VALUES (?, ?, ?, ?)",
        [newUserId, firstName, lastName, department || "General"],
      );
    }
    // Si el rol es 'Admin', no requiere tabla secundaria según tu diagrama.

    // Confirmar la transacción
    await connection.commit();

    // 4. Generar el Token de 24 horas para devolverlo inmediatamente
    const token = jwt.sign(
      { userId: newUserId, role: role },
      process.env.JWT_SECRET || "super_secreto_desarrollo",
      { expiresIn: "24h" },
    );

    res.status(201).json({
      message: `Usuario ${role} inyectado con éxito`,
      token,
    });
  } catch (error) {
    // Si algo falla, deshacemos todo para no dejar datos huérfanos
    await connection.rollback();
    console.error("Error inyectando usuario:", error);
    res.status(500).json({ message: "Error interno guardando al usuario" });
  } finally {
    connection.release(); // Liberamos la conexión de vuelta al pool
  }
};

// Función de Login (Actualizada a 24 horas)
const login = async (req, res) => {
  const { rut, password } = req.body;

  try {
    const [users] = await mysqlPool.execute(
      "SELECT * FROM USER WHERE rut = ?",
      [rut],
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "RUT o contraseña incorrectos" });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: "RUT o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET || "super_secreto_desarrollo",
      { expiresIn: "24h" }, // <-- Modificado a 24 horas
    );

    res.json({
      message: "Login exitoso",
      token,
      user: { rut: user.rut, role: user.role },
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  login,
  registerTemp,
};
