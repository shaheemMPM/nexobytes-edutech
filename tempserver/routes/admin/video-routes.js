const express = require("express");
const { check } = require("express-validator");

const videoController = require("../../controllers/admin/video-controller");
const HttpError = require("../../models/http-error");

const checkIsAdmin = require("../../middleware/check-isadmin");

const router = express.Router();

router.use(checkIsAdmin);

router.post(
  "/",
  [
    check("chapterId").not().isEmpty(),
    check("chapterName").not().isEmpty(),
    check("classId").not().isEmpty(),
    check("className").not().isEmpty(),
    check("publish").isNumeric(),
    check("subjectId").not().isEmpty(),
    check("subjectName").not().isEmpty(),
    check("title").not().isEmpty(),
    check("url").not().isEmpty(),
  ],
  videoController.createVideo
);

router.get("/:cid", videoController.getVideosByChapterId);

router.patch("/status/:vid", videoController.toggleVideoStatusByVideoId);

router.delete("/:vid", videoController.deleteVideoByVideoId);

router.use((req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
});

module.exports = router;
