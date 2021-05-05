const HttpError = require("../../models/http-error");
const admin = require("firebase-admin");

const getSubjects = async (req, res, next) => {
  let { classId } = req.body;

  if (!classId) {
    console.error(`Request body does not contain classId`);
    return next(new HttpError("Invalid Input Passed", 422));
  }

  let subjects;
  try {
    let getSubjectsQuery = await admin
      .firestore()
      .collection("subjects")
      .where("classId", "==", classId)
      .get();
    subjects = getSubjectsQuery.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
  } catch (error) {
    console.error(`Error while reading subjects of ${classId}`, error);
    return next(new HttpError("Subject read failed, please try again.", 500));
  }

  res.status(200).json({
    code: "SUCCESS",
    message: "Subject read successfully",
    data: subjects,
  });
};

const getChapters = async (req, res, next) => {
  let subjectId = req.params.sid;

  let chapters;
  try {
    let getChaptersQuery = await admin
      .firestore()
      .collection("chapters")
      .where("subjectId", "==", subjectId)
      .get();
    chapters = getChaptersQuery.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
  } catch (error) {
    console.error(`Error while reading chapters of ${subjectId}`, error);
    return next(new HttpError("Chapter read failed, please try again.", 500));
  }

  res.status(200).json({
    code: "SUCCESS",
    message: "Chapter read successfully",
    data: chapters,
  });
};

const getLectures = async (req, res, next) => {
  let chapterId = req.params.cid;

  let lectures;
  try {
    let getLecturesQuery = await admin
      .firestore()
      .collection("videos")
      .where("chapterId", "==", chapterId)
      .where("isActive", "==", true)
      .where("publish", "<=", Number(new Date()))
      .get();
    lectures = getLecturesQuery.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
  } catch (error) {
    console.error(`Error while reading lectures of ${chapterId}`, error);
    return next(new HttpError("Lectures read failed, please try again.", 500));
  }

  res.status(200).json({
    code: "SUCCESS",
    message: "Lectures read successfully",
    data: lectures,
  });
};

const getMaterials = async (req, res, next) => {
  let chapterId = req.params.cid;

  let materials;
  try {
    let getMaterialsQuery = await admin
      .firestore()
      .collection("materials")
      .where("chapterId", "==", chapterId)
      .where("isActive", "==", true)
      .where("publish", "<=", Number(new Date()))
      .get();
    materials = getMaterialsQuery.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
  } catch (error) {
    console.error(`Error while reading materials of ${chapterId}`, error);
    return next(new HttpError("materials read failed, please try again.", 500));
  }

  res.status(200).json({
    code: "SUCCESS",
    message: "materials read successfully",
    data: materials,
  });
};

exports.getSubjects = getSubjects;
exports.getChapters = getChapters;
exports.getLectures = getLectures;
exports.getMaterials = getMaterials;
