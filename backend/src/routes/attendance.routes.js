const express = require("express");
const router = express.Router();
const {
  getAttendanceByCourse,
  updateAttendance,
  getMyAttendance,
  getMyAttendanceSummary,
} = require("../controllers/attendance.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");

router.get("/", verifyToken, requireRole("Teacher", "Admin"), getAttendanceByCourse);
router.put("/", verifyToken, requireRole("Teacher", "Admin"), updateAttendance);
router.get("/my/summary", verifyToken, requireRole("Student"), getMyAttendanceSummary);
router.get("/my", verifyToken, requireRole("Student"), getMyAttendance);

module.exports = router;
