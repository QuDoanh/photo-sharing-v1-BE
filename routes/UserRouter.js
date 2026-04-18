const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

const {
  getUserList,
  getUserById,
} = require("../controller/userController");

router.get("/list", getUserList);
router.get("/:id", getUserById);


// router.post("/", async (request, response) => {

// });

// router.get("/", async (request, response) => {

// });

module.exports = router;
