const express = require("express");

const subjectController = require("../../controllers/mobile/subject-controller");

const router = express.Router();

const isStudent = require("../../middleware/is-student");

router.use(isStudent);

router.get("/", subjectController.getSubjects);

router.get("/:sid", subjectController.getChapters);

router.get("/:sid/videos/:cid", subjectController.getLectures);

router.get("/:sid/materials/:cid", subjectController.getMaterials);

module.exports = router;
