require("dotenv/config");
const { validationResult } = require("express-validator");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const HttpError = require("../../models/http-error");
const Material = require("../../models/material");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

const uploadMaterial = async (req, res, next) => {
  let myFile = req.file.originalname.split(".");
  const fileType = myFile[myFile.length - 1];
  const params = {
    Bucket: "material-bucket0",
    Key: `${uuidv4()}.${fileType}`,
    Body: req.file.buffer,
  };

  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).send(error);
    }
    res.status(200).send(data);
  });
};

const createMaterial = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Invalid inputs passed in create material", errors);
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
    publish,
    subjectId,
    subjectName,
    title,
    url,
  } = req.body;

  const createdMaterial = new Material({
    chapterId,
    chapterName,
    classId,
    className,
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
    await createdMaterial.save();
  } catch (err) {
    console.error(`Error while saving material in createMaterial`, err);
    return next(new HttpError(`${err.message}`, 500));
  }

  console.log(`Successfully created material by : ${createdBy}`);

  res.status(201).json({
    message: "Successfully Created a material",
    data: createdMaterial._doc,
  });
};

const getMaterialsByChapterId = async (req, res, next) => {
  let chapterId = req.params.cid;

  let materials;

  try {
    materials = await Material.find({ chapterId });
  } catch (err) {
    console.error(
      `Error while reading materials in getMaterialsByChapterId`,
      err
    );
    return next(new HttpError(`${err.message}`, 500));
  }

  res.status(201).json({
    message: "Successfully read materials",
    data: materials,
  });
};

const toggleMaterialStatusByMaterialId = async (req, res, next) => {
  let materialId = req.params.mid;

  let material;

  try {
    material = await Material.findById(materialId);
  } catch (err) {
    console.error(
      `Error while reading material in toggleMaterialStatusByMaterialId`,
      err
    );
    return next(new HttpError(`${err.message}`, 500));
  }

  if (!material) {
    return next(new HttpError(`could not find a material with given id`, 404));
  }

  material.isActive = !material.isActive;

  try {
    await material.save();
  } catch (error) {
    console.error(
      `Error while saving material in toggleMaterialStatusByMaterialId`,
      err
    );
    return next(new HttpError(`${err.message}`, 500));
  }

  res.status(201).json({
    message: "Successfully toggled material status",
    data: material,
  });
};

const deleteMaterialByMaterialId = async (req, res, next) => {
  let materialId = req.params.mid;

  let material;

  try {
    material = await Material.findById(materialId);
  } catch (err) {
    console.error(
      `Error while reading material in deleteMaterialByMaterialId`,
      err
    );
    return next(new HttpError(`${err.message}`, 500));
  }

  if (!material) {
    return next(new HttpError(`could not find a material with given id`, 404));
  }

  try {
    await material.remove();
  } catch (error) {
    console.error(
      `Error while removing material in deleteMaterialByMaterialId`,
      err
    );
    return next(new HttpError(`${err.message}`, 500));
  }

  res.status(201).json({
    message: "Successfully deleted a material",
  });
};

exports.uploadMaterial = uploadMaterial;
exports.createMaterial = createMaterial;
exports.getMaterialsByChapterId = getMaterialsByChapterId;
exports.toggleMaterialStatusByMaterialId = toggleMaterialStatusByMaterialId;
exports.deleteMaterialByMaterialId = deleteMaterialByMaterialId;
