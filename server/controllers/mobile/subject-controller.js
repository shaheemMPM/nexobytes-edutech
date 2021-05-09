const HttpError = require("../../models/http-error");
const Subject = require("../../models/subject");
const Chapter = require("../../models/chapter");
const Video = require("../../models/video");
const Material = require("../../models/material");

const getSubjects = async (req, res, next) => {
  let { classId } = req.body;

  if (!classId) {
    console.error(`Request body does not contain classId`);
    return next(new HttpError("Invalid Input Passed", 422));
  }

  let subjects;
  try {
    subjects = await Subject.find({ classId });
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
    chapters = await Chapter.find({ subjectId });
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

  let videos;
  try {
    videos = await Video.find({ chapterId });
  } catch (error) {
    console.error(`Error while reading videos of ${chapterId}`, error);
    return next(new HttpError("Lectures read failed, please try again.", 500));
  }

  res.status(200).json({
    code: "SUCCESS",
    message: "Lectures read successfully",
    data: videos,
  });
};

const getMaterials = async (req, res, next) => {
  let chapterId = req.params.cid;

  let materials;
  try {
    materials = await Material.find({ chapterId });
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
