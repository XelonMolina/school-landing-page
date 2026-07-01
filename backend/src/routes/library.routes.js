const express = require("express");
const router = express.Router();
const { getLibraryItems, getCategories } = require("../controllers/library.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, getLibraryItems);
router.get("/categories", verifyToken, getCategories);

module.exports = router;
