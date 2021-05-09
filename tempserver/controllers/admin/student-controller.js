const { validationResult } = require("express-validator");

const HttpError = require("../../models/http-error");
const Student = require("../../models/student");

const createStudent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Invalid inputs passed in create student", errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let createdBy = req.adminData.email;
  let createdAt = Number(new Date());

  let { username, classId, className, name, password } = req.body;

  const createdStudent = new Student({
    username,
    classId,
    className,
    name,
    password,
    createdAt,
    createdBy,
    isActive: false,
  });

  try {
    await createdStudent.save();
  } catch (err) {
    console.error(`Error while saving student in createStudent`, err);
    return next(new HttpError(`${err.message}`, 500));
  }

  console.log(`Successfully created student by : ${createdBy}`);

  res.status(201).json({
    message: "Successfully Created a student",
    data: createdStudent._doc,
  });
};

const getStudentsByClassId = async (req, res, next) => {
  let classId = req.params.cid;

  let students;

  try {
    students = await Student.find({ classId });
  } catch (err) {
    console.error(`Error while reading students in getStudentsByClassId`, err);
    return next(new HttpError(`${err.message}`, 500));
  }

  res.status(201).json({
    message: "Successfully read a students",
    data: students,
  });
};

const getStudentByUsername = async (req, res, next) => {
  let username = req.params.username;

  let student;

  try {
    student = await Student.findOne({ username });
  } catch (err) {
    console.error(`Error while reading student in getStudentByUsername`, err);
    return next(new HttpError(`${err.message}`, 500));
  }

  if (!student) {
    return next(
      new HttpError(`could not find a student with given username`, 404)
    );
  }

  res.status(201).json({
    message: "Successfully read a student",
    data: student,
  });
};

const updatePasswordByUsername = async (req, res, next) => {
  let username = req.params.username;
  let { password } = req.body;

  let student;

  try {
    student = await Student.findOne({ username });
  } catch (err) {
    console.error(
      `Error while reading student in updatePasswordByUsername`,
      err
    );
    return next(new HttpError(`${err.message}`, 500));
  }

  if (!student) {
    return next(
      new HttpError(`could not find a student with given username`, 404)
    );
  }

  student.password = password;

  try {
    await student.save();
  } catch (error) {
    console.error(
      `Error while saving student in updatePasswordByUsername`,
      err
    );
    return next(new HttpError(`${err.message}`, 500));
  }

  res.status(201).json({
    message: "Successfully updated student password",
    data: student,
  });
};

const toggleLoginStatusByUsername = async (req, res, next) => {
  let username = req.params.username;

  let student;

  try {
    student = await Student.findOne({ username });
  } catch (err) {
    console.error(
      `Error while reading student in toggleLoginStatusByUsername`,
      err
    );
    return next(new HttpError(`${err.message}`, 500));
  }

  if (!student) {
    return next(
      new HttpError(`could not find a student with given username`, 404)
    );
  }

  student.isActive = !student.isActive;

  try {
    await student.save();
  } catch (error) {
    console.error(
      `Error while saving student in toggleLoginStatusByUsername`,
      err
    );
    return next(new HttpError(`${err.message}`, 500));
  }

  res.status(201).json({
    message: "Successfully toggled student login status",
    data: student,
  });
};

const deleteStudentByUsername = async (req, res, next) => {
  let username = req.params.username;

  let student;

  try {
    student = await Student.findOne({ username });
  } catch (err) {
    console.error(
      `Error while reading student in deleteStudentByUsername`,
      err
    );
    return next(new HttpError(`${err.message}`, 500));
  }

  if (!student) {
    return next(
      new HttpError(`could not find a student with given username`, 404)
    );
  }

  try {
    await student.remove();
  } catch (error) {
    console.error(
      `Error while removing student in deleteStudentByUsername`,
      err
    );
    return next(new HttpError(`${err.message}`, 500));
  }

  res.status(201).json({
    message: "Successfully deleted a student",
  });
};

exports.createStudent = createStudent;
exports.getStudentsByClassId = getStudentsByClassId;
exports.getStudentByUsername = getStudentByUsername;
exports.updatePasswordByUsername = updatePasswordByUsername;
exports.toggleLoginStatusByUsername = toggleLoginStatusByUsername;
exports.deleteStudentByUsername = deleteStudentByUsername;
