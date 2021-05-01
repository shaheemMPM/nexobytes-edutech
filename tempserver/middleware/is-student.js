const admin = require("firebase-admin");
const HttpError = require("../models/http-error");

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const { username, password } = req.body; // Authorization: 'Bearer TOKEN'

    if (!username || !password) {
      console.error("Invalid inputs passed in middleware authorization");
      return next(
        new HttpError(
          "Invalid auth inputs passed, please check your data.",
          422
        )
      );
    }

    let getUserQuery = await admin
      .firestore()
      .collection("students")
      .doc(username)
      .get();
    let existingUser = getUserQuery.data();

    if (!existingUser) {
      console.error(`Can't find user with given username in auth middleware`);
      return next(
        new HttpError(
          "User does not exist, could not authenticate the request.",
          403
        )
      );
    }

    let isValidPassword = false;
    isValidPassword = existingUser.password === password;

    if (!isValidPassword) {
      console.error(
        `Invalid password in middleware on authenticating : ${username}`
      );
      return next(
        new HttpError(
          "Invalid credentials, could not authenticate the request.",
          403
        )
      );
    }

    req.userData = existingUser;
    next();
  } catch (err) {
    console.error("Auth middleware failed", err);
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};
