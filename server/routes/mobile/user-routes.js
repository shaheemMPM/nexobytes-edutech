const express = require("express");
const { check } = require("express-validator");

const userController = require("../../controllers/mobile/user-controller");

const checkIsStudent = require("../../middleware/is-student");

const router = express.Router();

router.post(
  "/login",
  [check("username").not().isEmpty(), check("password").not().isEmpty()],
  userController.login
);

router.use(checkIsStudent);

router.post(
  "/logout",
  [check("username").not().isEmpty()],
  userController.logout
);

module.exports = router;