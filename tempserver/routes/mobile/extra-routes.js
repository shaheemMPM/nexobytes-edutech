const express = require("express");

const extraController = require("../../controllers/mobile/extra-controller");

const checkIsStudent = require("../../middleware/is-student");

const router = express.Router();

router.use(checkIsStudent);

router.get("/timetables/:cid", extraController.getTimetable);

module.exports = router;