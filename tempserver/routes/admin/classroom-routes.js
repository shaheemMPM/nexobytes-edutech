const express = require("express");
const { check } = require("express-validator");

const classroomController = require("../../controllers/admin/classroom-controller");
const HttpError = require("../../models/http-error");

const checkIsAdmin = require("../../middleware/check-isadmin");

const router = express.Router();

router.use(checkIsAdmin);

router.post(
  "/",
  [check("classId").not().isEmpty(), check("name").not().isEmpty()],
  classroomController.createClassroom
);

router.get("/", classroomController.getClassrooms);

router.get("/:cid", classroomController.getClassroomById);

router.use((req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
});

module.exports = router;
