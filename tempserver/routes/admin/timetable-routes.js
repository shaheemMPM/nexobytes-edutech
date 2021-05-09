const express = require("express");
const { check } = require("express-validator");

const timetableController = require("../../controllers/admin/timetable-controller");
const HttpError = require("../../models/http-error");

const checkIsAdmin = require("../../middleware/check-isadmin");

const router = express.Router();

router.use(checkIsAdmin);

router.post(
  "/",
  [
    check("timetable").not().isEmpty(),
    check("classId").not().isEmpty(),
    check("className").not().isEmpty(),
    check("date").isNumeric()
  ],
  timetableController.createTimetable
);

router.get("/:cid", timetableController.getTimetableByClassId);

router.delete("/:tid", timetableController.deleteTimetableById);

router.use((req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
});

module.exports = router;
