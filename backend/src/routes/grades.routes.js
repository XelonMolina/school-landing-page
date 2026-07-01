const express = require("express");
const router = express.Router();
const { getGradesByCourse, getMyGrades } = require("../controllers/grades.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");

router.get("/", verifyToken, requireRole("Teacher", "Admin"), getGradesByCourse);
router.get("/my", verifyToken, requireRole("Student"), getMyGrades);

module.exports = router;
