const express = require("express");

const extraController = require("../../controllers/mobile/extra-controller");

const router = express.Router();

router.get("/timetables/:cid", extraController.getTimetable);

module.exports = router;