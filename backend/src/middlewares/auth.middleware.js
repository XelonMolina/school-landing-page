const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Angular enviará el token en la cabecera 'Authorization: Bearer <token>'
  const bearerHeader = req.headers["authorization"];

  if (!bearerHeader) {
    return res
      .status(403)
      .json({ message: "Se requiere un token de autenticación" });
  }

  const token = bearerHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "super_secreto_desarrollo",
    );
    req.user = decoded; // Guardamos los datos (userId, role) en la petición
    next(); // Dejamos que la petición continúe hacia el controlador
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = { verifyToken };
