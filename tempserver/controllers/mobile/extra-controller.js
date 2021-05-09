const HttpError = require("../../models/http-error");
const Timetable = require("../../models/timetable");

const getTimetable = async (req, res, next) => {
  let classId = req.params.cid;

  let timetables;
  try {
    timetables = await Timetable.find({ classId });
  } catch (error) {
    console.error(`Error while reading timetables of ${classId}`, error);
    return next(
      new HttpError("timetables read failed, please try again.", 500)
    );
  }

  console.log(timetables);

  res.status(200).json({
    code: "SUCCESS",
    message: "timetables read successfully",
    data: timetables,
  });
};

exports.getTimetable = getTimetable;
