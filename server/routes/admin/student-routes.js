const express = require("express");
const { check } = require("express-validator");

const studentController = require("../../controllers/admin/student-controller");
const HttpError = require("../../models/http-error");

const checkIsAdmin = require("../../middleware/check-isadmin");

const router = express.Router();

router.use(checkIsAdmin);

router.post(
  "/",
  [
    check("username").not().isEmpty(),
    check("classId").not().isEmpty(),
    check("className").not().isEmpty(),
    check("name").not().isEmpty(),
    check("password").not().isEmpty(),
  ],
  studentController.createStudent
);

router.get("/:cid", studentController.getStudentsByClassId);

router.get("/std/:username", studentController.getStudentByUsername);

router.patch(
  "/password/:username",
  [check("password").not().isEmpty()],
  studentController.updatePasswordByUsername
);

router.patch(
  "/status/:username",
  studentController.toggleLoginStatusByUsername
);

router.delete("/:username", studentController.deleteStudentByUsername);

router.use((req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
});

module.exports = router;
