const express = require("express");
const router = express.Router();
const { login, logout, getCurrentUser } = require("../controller/adminController");

router.post("/login", login);
router.post("/logout", logout);
router.get("/current", getCurrentUser);

module.exports = router;
