const express = require("express");

const dashboardController = require("../../controllers/admin/dashboard-controller");
const HttpError = require("../../models/http-error");

const checkIsAdmin = require("../../middleware/check-isadmin");

const router = express.Router();

router.use(checkIsAdmin);

router.get("/", dashboardController.getOverview);

router.use((req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
});

module.exports = router;
