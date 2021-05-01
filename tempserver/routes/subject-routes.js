const express = require("express");
// const { check } = require("express-validator");

const subjectController = require("../controllers/subject-controller");

const router = express.Router();

const isStudent = require("../middleware/is-student");

router.use(isStudent);

router.get("/", subjectController.getSubjects);

router.get("/:sid", subjectController.getChapters);

module.exports = router;
