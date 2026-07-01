const express = require("express");
const router = express.Router();
const { getCourses, getLevels } = require("../controllers/courses.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, getCourses);
router.get("/levels", verifyToken, getLevels);

module.exports = router;
