const express = require("express");
const router = express.Router();
const { getStudents, getStudentById } = require("../controllers/students.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");

router.get("/", verifyToken, requireRole("Teacher", "Admin"), getStudents);
router.get("/:id", verifyToken, requireRole("Teacher", "Admin"), getStudentById);

module.exports = router;
