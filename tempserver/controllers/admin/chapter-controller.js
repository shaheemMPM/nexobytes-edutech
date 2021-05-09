const { validationResult } = require("express-validator");

const HttpError = require("../../models/http-error");
const Chapter = require("../../models/chapter");

const createChapter = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Invalid inputs passed in create chapter", errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let createdBy = req.adminData.email;
  let createdAt = Number(new Date());

  let {
    chapterId,
    classId,
    className,
    name,
    subjectId,
    subjectName,
  } = req.body;

  const createdChapter = new Chapter({
    chapterId,
    classId,
    className,
    name,
    subjectId,
    subjectName,
    createdAt,
    createdBy,
  });

  try {
    await createdChapter.save();
  } catch (err) {
    console.error(`Error while saving subject in createChapter`, err);
    return next(new HttpError(`${err.message}`, 500));
  }

  console.log(`Successfully created chapter by : ${createdBy}`);

  res.status(201).json({
    message: "Successfully Created a chapter",
    data: createdChapter._doc,
  });
};

const getChapterById = async (req, res, next) => {
  let chapterId = req.params.cid;

  let chapter;
  try {
    chapter = await Chapter.findOne({ chapterId });
  } catch (error) {
    console.error(`Error while reading chapter in getChapterById`, error);
    return next(new HttpError(`${error.message}`, 500));
  }

  res.status(201).json({
    message: "Successfully read a chapter",
    data: chapter,
  });
};

const getChaptersBySubjectId = async (req, res, next) => {
  let subjectId = req.params.sid;

  let chapters;
  try {
    chapters = await Chapter.find({ subjectId });
  } catch (error) {
    console.error(
      `Error while reading chapters in getChaptersBySubjectId`,
      error
    );
    return next(new HttpError(`${error.message}`, 500));
  }

  res.status(201).json({
    message: "Successfully read chapters",
    data: chapters,
  });
};

exports.createChapter = createChapter;
exports.getChapterById = getChapterById;
exports.getChaptersBySubjectId = getChaptersBySubjectId;
