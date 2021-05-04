const express = require("express");

const subjectController = require("../../controllers/mobile/subject-controller");

const router = express.Router();

router.post("/", subjectController.getSubjects);

router.get("/:sid", subjectController.getChapters);

router.get("/:sid/videos/:cid", subjectController.getLectures);

router.get("/:sid/materials/:cid", subjectController.getMaterials);

module.exports = router;