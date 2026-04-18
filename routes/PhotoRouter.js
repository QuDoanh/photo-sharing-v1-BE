const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();


const { getPhotosOfUser } = require("../controller/photoController")
router.get("/photosOfUser/:id", getPhotosOfUser);

module.exports = router;
