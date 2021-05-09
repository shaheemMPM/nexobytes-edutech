const { validationResult } = require("express-validator");

const HttpError = require("../../models/http-error");
const Video = require("../../models/video");

const createVideo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Invalid inputs passed in create video", errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let createdBy = req.adminData.email;
  let createdAt = Number(new Date());

  let {
    chapterId,
    chapterName,
    classId,
    className,
    description,
    publish,
    subjectId,
    subjectName,
    title,
    url,
  } = req.body;

  if (!description) {
    description = " ";
  }

  const createdVideo = new Video({
    chapterId,
    chapterName,
    classId,
    className,
    description,
    publish,
    subjectId,
    subjectName,
    title,
    url,
    createdAt,
    createdBy,
    isActive: true,
  });

  try {
    await createdVideo.save();
  } catch (err) {
    console.error(`Error while saving vido in createVideo`, err);
    return next(new HttpError(`${err.message}`, 500));
  }

  console.log(`Successfully created video by : ${createdBy}`);

  res.status(201).json({
    message: "Successfully Created a video",
    data: createdVideo._doc,
  });
};

const getVideosByChapterId = async (req, res, next) => {
  let chapterId = req.params.cid;

  let videos;

  try {
    videos = await Video.find({ chapterId });
  } catch (err) {
    console.error(`Error while reading videos in getVideosByChapterId`, err);
    return next(new HttpError(`${err.message}`, 500));
  }

  res.status(201).json({
    message: "Successfully read videos",
    data: videos,
  });
};

const toggleVideoStatusByVideoId = async (req, res, next) => {
  let videoId = req.params.vid;

  let video;

  try {
    video = await Video.findById(videoId);
  } catch (err) {
    console.error(
      `Error while reading video in toggleVideoStatusByVideoId`,
      err
    );
    return next(new HttpError(`${err.message}`, 500));
  }

  if (!video) {
    return next(new HttpError(`could not find a video with given id`, 404));
  }

  video.isActive = !video.isActive;

  try {
    await video.save();
  } catch (error) {
    console.error(
      `Error while saving video in toggleVideoStatusByVideoId`,
      err
    );
    return next(new HttpError(`${err.message}`, 500));
  }

  res.status(201).json({
    message: "Successfully toggled video status",
    data: video,
  });
};

const deleteVideoByVideoId = async (req, res, next) => {
  let videoId = req.params.vid;

  let video;

  try {
    video = await Video.findById(videoId);
  } catch (err) {
    console.error(`Error while reading video in deleteVideoByVideoId`, err);
    return next(new HttpError(`${err.message}`, 500));
  }

  if (!video) {
    return next(
      new HttpError(`could not find a video with given id`, 404)
    );
  }

  try {
    await video.remove();
  } catch (error) {
    console.error(`Error while removing video in deleteVideoByVideoId`, err);
    return next(new HttpError(`${err.message}`, 500));
  }

  res.status(201).json({
    message: "Successfully deleted a video",
  });
};

exports.createVideo = createVideo;
exports.getVideosByChapterId = getVideosByChapterId;
exports.toggleVideoStatusByVideoId = toggleVideoStatusByVideoId;
exports.deleteVideoByVideoId = deleteVideoByVideoId;
