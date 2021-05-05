const HttpError = require("../../models/http-error");
const admin = require("firebase-admin");

const getTimetable = async (req, res, next) => {
  let classId = req.params.cid;

  let timetables;
  try {
    let getTimetablesQuery = await admin
      .firestore()
      .collection("timetables")
      .where("classId", "==", classId)
      .get();
    timetables = getTimetablesQuery.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
  } catch (error) {
    console.error(`Error while reading timetables of ${classId}`, error);
    return next(new HttpError("timetables read failed, please try again.", 500));
  }

  res.status(200).json({
    code: "SUCCESS",
    message: "timetables read successfully",
    data: timetables
  });
};

exports.getTimetable = getTimetable;
