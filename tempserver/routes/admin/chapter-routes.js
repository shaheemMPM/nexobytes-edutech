const express = require("express");
const { check } = require("express-validator");

const chapterController = require("../../controllers/admin/chapter-controller");
const HttpError = require("../../models/http-error");

const checkIsAdmin = require("../../middleware/check-isadmin");

const router = express.Router();

router.use(checkIsAdmin);

router.post(
  "/",
  [
    check("chapterId").not().isEmpty(),
    check("classId").not().isEmpty(),
    check("className").not().isEmpty(),
    check("name").not().isEmpty(),
    check("subjectId").not().isEmpty(),
    check("subjectName").not().isEmpty(),
  ],
  chapterController.createChapter
);

router.get("/:cid", chapterController.getChapterById);

router.get("/subject/:sid", chapterController.getChaptersBySubjectId);

router.use((req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
});

module.exports = router;
