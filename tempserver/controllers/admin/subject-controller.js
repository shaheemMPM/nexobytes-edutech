const { validationResult } = require('express-validator');

const HttpError = require('../../models/http-error');
const Subject = require('../../models/subject');

const createSubject = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.error('Invalid inputs passed in create subject', errors);
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}

	let createdBy = req.adminData.email;
  let createdAt = Number(new Date());
	
	let { subjectId, classId, className, name } = req.body;
  
	const createdSubject = new Subject({
    subjectId, 
		classId, 
		className, 
		name,
    createdAt,
    createdBy
	});

	try {
		await createdSubject.save();
	} catch (err) {
		console.error(`Error while saving subject in createSubject`, err);
		return next(new HttpError(`${err.message}`, 500));
	}

	console.log(`Successfully created subject by : ${createdBy}`);
  
	res.status(201).json({
		message: 'Successfully Created a subject',
		data: createdSubject._doc
	});

}

const getSubjectById = async (req, res, next) => {
	let subjectId = req.params.sid;

	let subject;
	try {
		subject = await Subject.findById(subjectId);
	} catch (error) {
		console.error(`Error while reading subject in getSubjectById`, err);
		return next(new HttpError(`${err.message}`, 500));
	}

  if (!subject) {
    return next(
      new HttpError(`could not find a subject with given id`, 404)
    );
  }
  
	res.status(201).json({
		message: 'Successfully read a subject',
		data: subject
	});

}

const getSubjectsByClassId = async (req, res, next) => {
	let classId = req.params.cid;

	let subjects;
	try {
		subjects = await Subject.find({classId});
	} catch (error) {
		console.error(`Error while reading subjects in getSubjectsByClassId`, err);
		return next(new HttpError(`${err.message}`, 500));
	}
  
	res.status(201).json({
		message: 'Successfully read subjects',
		data: subjects
	});

}

exports.createSubject = createSubject;
exports.getSubjectById = getSubjectById;
exports.getSubjectsByClassId = getSubjectsByClassId;
