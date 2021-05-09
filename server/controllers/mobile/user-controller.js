const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const HttpError = require("../../models/http-error");
const Student = require("../../models/student");

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Invalid inputs passed in mobile user login", errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let { username, password } = req.body;

  let existingStudent;

  try {
    existingStudent = await Student.findOne({ username });
  } catch (err) {
    console.error(`Error while checking for existing student in login`, err);
    return next(
      new HttpError("Logging in failed, please try again later.", 500)
    );
  }

  if (!existingStudent) {
    console.error(`Can't find user with given username in login`);
    return next(
      new HttpError("User does not exist, could not log you in.", 403)
    );
  }
	let currentPassword = existingStudent.password;
  let isValidPassword = false;
  isValidPassword = currentPassword === password;

  if (!isValidPassword) {
    console.error(`Invalid password entered for sign in of : ${username}`);
    return next(
      new HttpError("Invalid credentials, could not log you in.", 403)
    );
  }

  if (existingStudent.isActive) {
    console.error(`Tried to login an already logged in user : ${username}`);
    return next(new HttpError("User already logged in on another device", 403));
  }

  let token;
  try {
    token = jwt.sign(
      {
        username: existingStudent.username,
        name: existingStudent.name,
        role: "student",
      },
      "nexobytes_super_boys_super_secret**key"
    );
  } catch (err) {
    console.error("student token generation failed on login", err);
    return next(new HttpError("login failed, please try again.", 500));
  }

  existingStudent.isActive = true;

  try {
    await existingStudent.save();
  } catch (error) {
    console.error(
      `Database write error on isActive true in login : ${username}`,
      error
    );
    return next(new HttpError("Database error, try again", 500));
  }

  res.status(200).json({
    code: "SUCCESS",
    message: "The user successfully logged in",
    data: {...existingStudent._doc, token}
  });
};

const logout = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Invalid inputs passed in mobile user logout", errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let { username } = req.body;

  let existingStudent;

  try {
    existingStudent = await Student.findOne({ username });
  } catch (err) {
    console.error(`Error while checking for existing student in logout`, err);
    return next(new HttpError("Logout failed, please try again later.", 500));
  }

  if (!existingStudent) {
    console.error(`Can't find student with given username in logout`);
    return next(
      new HttpError("User does not exist, could not log you out.", 403)
    );
  }

  if (!existingStudent.isActive) {
    console.error(`Tried to logout an already logged out user : ${username}`);
    return next(
      new HttpError("Student already logged out", 403)
    );
  }

	existingStudent.isActive = false;

  try {
    await existingStudent.save();
  } catch (error) {
    console.error(
      `Database write error on isActive false in logout : ${username}`,
      error
    );
    return next(new HttpError("Database error, try again", 500));
  }

  res.status(200).json({
    code: "SUCCESS",
    message: "The user successfully logged out",
  });
};

exports.login = login;
exports.logout = logout;
