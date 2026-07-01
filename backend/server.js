const express = require("express");
const cors = require("cors");
require("dotenv").config();

const mysqlPool = require("./config/mysql.config");
const connectMongo = require("./config/mongo.config");

// IMPORTAR RUTAS
const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const newsRoutes = require("./src/routes/news.routes");
const coursesRoutes = require("./src/routes/courses.routes");
const studentsRoutes = require("./src/routes/students.routes");
const gradesRoutes = require("./src/routes/grades.routes");
const attendanceRoutes = require("./src/routes/attendance.routes");
const libraryRoutes = require("./src/routes/library.routes");
const { seedLibraryIfEmpty } = require("./src/controllers/library.controller");

const app = express();
app.use(cors());
app.use(express.json());

mysqlPool
  .getConnection()
  .then((connection) => {
    console.log("✅ Conexión a MySQL (school_portal) establecida con éxito");
    connection.release();
  })
  .catch((err) => console.error("❌ Error conectando a MySQL:", err.message));

connectMongo().then(() => seedLibraryIfEmpty());

// CONFIGURAR RUTAS BASE
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/grades", gradesRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/library", libraryRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API funcionando correctamente" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
