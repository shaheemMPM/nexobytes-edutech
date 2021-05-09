const express = require("express");
const { check } = require("express-validator");

const materialController = require("../../controllers/admin/material-controller");
const HttpError = require("../../models/http-error");

const checkIsAdmin = require("../../middleware/check-isadmin");
const uploadFile = require("../../middleware/uploadfile");

const router = express.Router();

router.use(checkIsAdmin);

router.post('/upload', uploadFile.uploadfile, materialController.uploadMaterial);

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
  materialController.createMaterial
);

router.get("/:cid", materialController.getMaterialsByChapterId);

router.patch("/status/:mid", materialController.toggleMaterialStatusByMaterialId);

router.delete("/:mid", materialController.deleteMaterialByMaterialId);

router.use((req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
});

module.exports = router;
