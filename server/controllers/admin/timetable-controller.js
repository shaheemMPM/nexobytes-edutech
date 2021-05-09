const { validationResult } = require("express-validator");

const HttpError = require("../../models/http-error");
const Timetable = require("../../models/timetable");

const createTimetable = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Invalid inputs passed in create timetable", errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let createdBy = req.adminData.email;
  let createdAt = Number(new Date());

  let {
    classId,
    className,
    timetable,
    date
  } = req.body;

  const createdTimetable = new Timetable({
    classId,
    className,
    timetable,
    date,
    createdAt,
    createdBy,
  });

  try {
    await createdTimetable.save();
  } catch (err) {
    console.error(`Error while saving timetable in createTimetable`, err);
    return next(new HttpError(`${err.message}`, 500));
  }

  console.log(`Successfully created timetable by : ${createdBy}`);

  res.status(201).json({
    message: "Successfully Created a timetable",
    data: createdTimetable._doc,
  });
};

const getTimetableByClassId = async (req, res, next) => {
  let classId = req.params.cid;

  let timetables;

  try {
    timetables = await Timetable.find({ classId });
  } catch (err) {
    console.error(`Error while reading timetables in getTimetableByClassId`, err);
    return next(new HttpError(`${err.message}`, 500));
  }

  if (!timetables) {
    return next(new HttpError(`could not find timetables`, 404));
  }

  res.status(201).json({
    message: "Successfully read timetables",
    data: timetables,
  });
};

const deleteTimetableById = async (req, res, next) => {
  let timetableId = req.params.tid;

  let timetable;

  try {
    timetable = await Timetable.findById(timetableId);
  } catch (err) {
    console.error(`Error while reading timetable in deleteTimetableById`, err);
    return next(new HttpError(`${err.message}`, 500));
  }

  if (!timetable) {
    return next(
      new HttpError(`could not find a timetable with given id`, 404)
    );
  }

  try {
    await timetable.remove();
  } catch (error) {
    console.error(`Error while removing timetable in deleteTimetableById`, err);
    return next(new HttpError(`${err.message}`, 500));
  }

  res.status(201).json({
    message: "Successfully deleted a timetable",
  });
};

exports.createTimetable = createTimetable;
exports.getTimetableByClassId = getTimetableByClassId;
exports.deleteTimetableById = deleteTimetableById;
