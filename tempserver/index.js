const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const mongoose = require("mongoose");
const app = express();

// Mobile Routes Import
const userRoutes = require("./routes/mobile/user-routes");
const subjectRoutes = require("./routes/mobile/subject-routes");
const extraRoutes = require("./routes/mobile/extra-routes");
// Admin Routes Import
const adminRoutes = require("./routes/admin/admin-routes");
const adminDashboardRoutes = require("./routes/admin/dashboard-routes");
const adminClassroomRoutes = require("./routes/admin/classroom-routes");
const adminStudentRoutes = require("./routes/admin/student-routes");
const adminSubjectRoutes = require("./routes/admin/subject-routes");
const adminChapterRoutes = require("./routes/admin/chapter-routes");
const adminVideoRoutes = require("./routes/admin/video-routes");
const adminMaterialRoutes = require("./routes/admin/material-routes");
const adminTimetableRoutes = require("./routes/admin/timetable-routes");

// Importing utilities
// const logger = require('./utils/logger');
// Importing HttpError Model
const HttpError = require("./models/http-error");

const serviceAccount = require("./serviceKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors());

app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "welcome to nexobytes edutech server",
  });
});

// mobile routes root endpoints
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/subject", subjectRoutes);
app.use("/api/v1/extra", extraRoutes);
// admin routes root endpoints
app.use("/api/v1/admin/admin", adminRoutes);
app.use("/api/v1/admin/dashboard", adminDashboardRoutes);
app.use("/api/v1/admin/classroom", adminClassroomRoutes);
app.use("/api/v1/admin/student", adminStudentRoutes);
app.use("/api/v1/admin/subject", adminSubjectRoutes);
app.use("/api/v1/admin/chapter", adminChapterRoutes);
app.use("/api/v1/admin/video", adminVideoRoutes);
app.use("/api/v1/admin/material", adminMaterialRoutes);
app.use("/api/v1/admin/timetable", adminTimetableRoutes);

app.use((req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect("mongodb://localhost:27017/edutech", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(8000, () => {
      console.log("Running on port 8000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
