const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      console.error("no token found in admin");
      return next(new HttpError("Authentication failed!", 403));
    }
    const decodedToken = jwt.verify(
      token,
      "nexobytes_super_boys_super_secret**key"
    );
    req.studentData = {
      username: decodedToken.username,
      name: decodedToken.name
    };
    if (decodedToken.role !== "student") {
      console.error("student role not matching");
      return next(new HttpError("Authentication failed!", 403));
    }
    next();
  } catch (err) {
    console.error("check is student failed", err);
    return next(new HttpError("Authentication failed!", 403));
  }
};
