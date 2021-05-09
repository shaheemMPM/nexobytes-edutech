const { validationResult } = require('express-validator');

const HttpError = require('../../models/http-error');
const Classroom = require('../../models/classroom');

const createClassroom = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.error('Invalid inputs passed in create classroom', errors);
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}

	let createdBy = req.adminData.email;
  let createdAt = Number(new Date());
	
	let { classId, name, description } = req.body;

	if (!description) {
		description = " ";
	}
  
	const createdClassroom = new Classroom({
    classId,
    name,
    description,
    createdAt,
    createdBy
	});

	try {
		await createdClassroom.save();
	} catch (err) {
		console.error(`Error while saving classroom in createClassroom`, err);
		return next(new HttpError(`${err.message}`, 500));
	}

	console.log(`Successfully created classroom by : ${createdBy}`);
  
	res.status(201).json({
		message: 'Successfully Created a classroom',
		data: createdClassroom._doc
	});

}

const getClassrooms = async (req, res, next) => {

	let classrooms;
	try {
		classrooms = await Classroom.find();
	} catch (error) {
		console.error(`Error while reading classrooms in getClassrooms`, err);
		return next(new HttpError(`${err.message}`, 500));
	}
  
	res.status(201).json({
		message: 'Successfully read classrooms',
		data: classrooms
	});

}

const getClassroomById = async (req, res, next) => {
	let classId = req.params.cid;

	let classroom;
	try {
		classroom = await Classroom.findOne({classId});
	} catch (error) {
		console.error(`Error while reading classroom in getClassroomById`, err);
		return next(new HttpError(`${err.message}`, 500));
	}
  
	if (!classroom) {
		console.error('could not find a classroom with given id');
		return next(new HttpError(`could not find a classroom with given id`, 404));
	}

	res.status(201).json({
		message: 'Successfully read classroom',
		data: classroom
	});

}

exports.createClassroom = createClassroom;
exports.getClassrooms = getClassrooms;
exports.getClassroomById = getClassroomById;
