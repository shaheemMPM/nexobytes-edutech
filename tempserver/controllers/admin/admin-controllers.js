const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../../models/http-error");
const Admin = require("../../models/admin");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("invalid input passed for admin sign up", errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email: email });
  } catch (err) {
    console.error("existing admin check failed in admin sign up", err);
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  if (existingAdmin) {
    console.error("admin exist with same mail id");
    return next(
      new HttpError("Admin exists already, please login instead.", 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    console.error("bcrypt hasing failed", err);
    return next(
      new HttpError("Could not create admin, please try again.", 500)
    );
  }

  const createdAdmin = new Admin({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await createdAdmin.save();
  } catch (err) {
    console.error("admin database save failed", err);
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  let token;
  try {
    token = jwt.sign(
      {
        adminId: createdAdmin.id,
        name: createdAdmin.name,
        email: createdAdmin.email,
        role: "admin",
      },
      "nexobytes_super_boys_super_secret**key"
    );
  } catch (err) {
    console.error("admin token generation failed on sign up", err);
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  res.status(201).json({
    adminId: createdAdmin.id,
    name: createdAdmin.name,
    email: createdAdmin.email,
    token: token,
  });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("invalid input passed for admin login", errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { email, password } = req.body;

  let existingAdmin;

  try {
    existingAdmin = await Admin.findOne({ email: email });
  } catch (err) {
    console.error("existing admin check failed in admin login", err);
    return next(
      new HttpError("Logging in failed, please try again later.", 500)
    );
  }

  if (!existingAdmin) {
    console.error("there is no admin with give email id");
    return next(
      new HttpError("Invalid credentials, could not log you in.", 403)
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingAdmin.password);
  } catch (err) {
    console.error("bcrypt comparison failed in admin login");
    return next(
      new HttpError(
        "Could not log you in, please check your credentials and try again.",
        500
      )
    );
  }

  if (!isValidPassword) {
    console.error("invalid password entered for admin sign in");
    return next(
      new HttpError("Invalid credentials, could not log you in.", 403)
    );
  }

  let token;
  try {
    token = jwt.sign(
      {
        adminId: existingAdmin.id,
        name: existingAdmin.name,
        email: existingAdmin.email,
        role: "admin",
      },
      "nexobytes_super_boys_super_secret**key"
    );
  } catch (err) {
    console.error("admin token generation failed on login", err);
    return next(
      new HttpError("Logging in failed, please try again later.", 500)
    );
  }

  res.status(200).json({
    adminId: existingAdmin.id,
    name: existingAdmin.name,
    email: existingAdmin.email,
    token: token,
  });
};

const getAdmins = async (req, res, next) => {
  let admins;
  try {
    admins = await Admin.find();
  } catch (error) {
    console.error("existing admin read failed", error);
    return next(
      new HttpError("admin read failed up failed, please try again later.", 500)
    );
  }
  if (!admins) {
    console.error("could not find admins");
    return next(
      new HttpError("Could not find admins in db.", 404)
    );
  }

  res.status(200).json({
    message: 'admins read successfully',
    data: admins
  });
}

exports.signup = signup;
exports.login = login;
exports.getAdmins = getAdmins;
