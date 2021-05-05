const express = require("express");
const cors = require("cors");
const admin = require('firebase-admin');
const app = express();

const userRoutes = require("./routes/mobile/user-routes");
const subjectRoutes = require("./routes/mobile/subject-routes");
const dashboardRoutes = require("./routes/admin/dashboard-routes");
const extraRoutes = require("./routes/mobile/extra-routes");

const serviceAccount = require('./serviceKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(cors());

app.use(express.json());

app.get("/", async (req, res) => {
  let allStudents;
  try {
    let querySnapshot = await admin.firestore().collection("students").get();
    allStudents = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'server error'
    })
  }
  res.status(200).json({
    status: "Success",
    message: allStudents
  });
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/subject", subjectRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/extra", extraRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({message: error.message || 'An unknown error occurred!'});
});

app.listen(8000, () => {
  console.log("Running on port 8000");
});
