const express = require("express");
const router = express.Router();
const { getLatestNews } = require("../controllers/news.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Ruta protegida: GET /api/news/latest
router.get("/latest", verifyToken, getLatestNews);

module.exports = router;
