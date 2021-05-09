const HttpError = require('../../models/http-error');
const Student = require('../../models/student');
const Video = require('../../models/video');
const Material = require('../../models/material');
const Classroom = require('../../models/classroom');
const Admin = require('../../models/admin');


const getOverview = async (req, res, next) => {

	let students;
	try {
		students = await Student.find();
	} catch (error) {
		console.error(`Error while reading students`, error);
		return next(new HttpError('student read failed, please try again.', 500));
	}

	let videos;
	try {
		videos = await Video.find();
	} catch (error) {
		console.error(`Error while reading videos`, error);
		return next(new HttpError('videos read failed, please try again.', 500));
	}

	let materials;
	try {
		materials = await Material.find();
	} catch (error) {
		console.error(`Error while reading materials`, error);
		return next(new HttpError('materials read failed, please try again.', 500));
	}

	let classrooms;
	try {
		classrooms = await Classroom.find();
	} catch (error) {
		console.error(`Error while reading classrooms`, error);
		return next(new HttpError('classrooms read failed, please try again.', 500));
	}

	let admins;
	try {
		admins = await Admin.find();
	} catch (error) {
		console.error(`Error while reading admins`, error);
		return next(new HttpError('admins read failed, please try again.', 500));
	}

	res.status(200).json({
		code: 'SUCCESS',
    message: 'dash overview read successfully',
    data: {
			students: students.length,
			videos: videos.length,
			materials: materials.length,
			classrooms: classrooms.length,
			admins: admins.length,
		}
	});
}

exports.getOverview = getOverview;