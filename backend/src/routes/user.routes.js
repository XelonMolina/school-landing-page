const express = require("express");
const router = express.Router();
const { getMyProfile } = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Ruta protegida: GET /api/users/me
router.get("/me", verifyToken, getMyProfile);

module.exports = router;
