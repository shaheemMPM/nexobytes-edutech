const express = require("express");
const { check } = require("express-validator");

const adminController = require("../../controllers/admin/admin-controllers");
const HttpError = require("../../models/http-error");

const checkIsSuperAdmin = require("../../middleware/check-issuperadmin");

const router = express.Router();

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  adminController.login
);

router.use(checkIsSuperAdmin);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  adminController.signup
);

router.get('/', adminController.getAdmins);

router.use((req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
});

module.exports = router;
