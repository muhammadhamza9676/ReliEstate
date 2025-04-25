// api/admin/admin.routes.js
const express = require("express");
const adminController = require("./admin.controller");
const { protect } = require("../../middleware/authGuard.middleware");
const { restrictToAdmin } = require("../../middleware/adminGuard.middleware");

const router = express.Router();

router.get("/dashboard", protect, restrictToAdmin, adminController.getDashboard);

module.exports = router;