const express = require("express");
const { check } = require("express-validator");

const userController = require("../controllers/user-controller");

const router = express.Router();

router.post(
  "/login",
  [check("username").not().isEmpty(), check("password").not().isEmpty()],
  userController.login
);

module.exports = router;