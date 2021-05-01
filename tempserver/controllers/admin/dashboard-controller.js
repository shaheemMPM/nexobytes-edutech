const HttpError = require('../../models/http-error');
const admin = require('firebase-admin');

const getOverview = async (req, res, next) => {

	let students;
	try {
		let getStudentsQuery = await admin.firestore().collection("students").get();
		students = getStudentsQuery.docs.map((doc) => {
			return { id: doc.id, ...doc.data() };
		});
		students = students.length;
	} catch (error) {
		console.error(`Error while reading students`, error);
		return next(new HttpError('student read failed, please try again.', 500));
	}

	let classrooms;
	try {
		let getClassroomsQuery = await admin.firestore().collection("classrooms").get();
		classrooms = getClassroomsQuery.docs.map((doc) => {
			return { id: doc.id, ...doc.data() };
		});
		classrooms = classrooms.length;
	} catch (error) {
		console.error(`Error while reading classrooms`, error);
		return next(new HttpError('classrooms read failed, please try again.', 500));
	}

	res.status(200).json({
		code: 'SUCCESS',
    message: 'dash overview read successfully',
    data: {
			students,
			classrooms
		}
	});
}

exports.getOverview = getOverview;