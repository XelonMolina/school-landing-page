const express = require("express");
const router = express.Router();
const { login, registerTemp } = require("../controllers/auth.controller");

// Ruta: POST /api/auth/login
router.post("/login", login);

// Ruta temporal: POST /api/auth/register-temp
router.post("/register-temp", registerTemp);

module.exports = router;
