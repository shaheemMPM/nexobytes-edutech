const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      console.error("no token found in super admin");
      return next(new HttpError("Authentication failed!", 403));
    }
    const decodedToken = jwt.verify(
      token,
      "nexobytes_super_boys_super_secret**key"
    );
    req.adminData = {
      adminId: decodedToken.adminId,
      name: decodedToken.name,
      email: decodedToken.email,
    };
    if (decodedToken.email !== "shaheemmpm@gmail.com") {
      console.error("super admin email not matching");
      return next(new HttpError("Authentication failed!", 403));
    }
    next();
  } catch (err) {
    console.error("check is super admin failed", err);
    return next(new HttpError("Authentication failed!", 403));
  }
};
