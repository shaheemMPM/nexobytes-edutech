const express = require("express");
const { check } = require("express-validator");

const subjectController = require("../../controllers/admin/subject-controller");
const HttpError = require("../../models/http-error");

const checkIsAdmin = require("../../middleware/check-isadmin");

const router = express.Router();

router.use(checkIsAdmin);

router.post(
  "/",
  [
    check("subjectId").not().isEmpty(),
    check("classId").not().isEmpty(),
    check("className").not().isEmpty(),
    check("name").not().isEmpty(),
  ],
  subjectController.createSubject
);

router.get("/:cid", subjectController.getSubjectsByClassId);

router.use((req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
});

module.exports = router;
