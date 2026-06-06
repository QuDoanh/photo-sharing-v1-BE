const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { getPhotosOfUser } = require("../controller/photoController");

router.get("/photosOfUser/:id", getPhotosOfUser);

module.exports = router;
