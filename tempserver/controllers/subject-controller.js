// const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const admin = require('firebase-admin');

const getSubjects = async (req, res, next) => {

	let existingUser = req.userData;

	let classId = existingUser.classId;

	let subjects;
	try {
		let getSubjectsQuery = await admin.firestore().collection("subjects").where("classId", "==", classId).get();
		subjects = getSubjectsQuery.docs.map((doc) => {
			return { id: doc.id, ...doc.data() };
		});
	} catch (error) {
		console.error(`Error while reading subjects of ${classId}`, error);
		return next(new HttpError('Subject read failed, please try again.', 500));
	}

	res.status(200).json({
		code: 'SUCCESS',
    message: 'Subject read successfully',
    data: subjects
	});
}

const getChapters = async (req, res, next) => {

	let subjectId = req.params.sid;

	let chapters;
	try {
		let getChaptersQuery = await admin.firestore().collection("chapters").where("subjectId", "==", subjectId).get();
		chapters = getChaptersQuery.docs.map((doc) => {
			return { id: doc.id, ...doc.data() };
		});
	} catch (error) {
		console.error(`Error while reading chapters of ${subjectId}`, error);
		return next(new HttpError('Chapter read failed, please try again.', 500));
	}

	res.status(200).json({
		code: 'SUCCESS',
    message: 'Chapter read successfully',
    data: chapters
	});
}

const getLectures = async (req, res, next) => {

	let chapterId = req.params.cid;

	let lectures;
	try {
		let getChaptersQuery = await admin.firestore().collection("chapters").where("subjectId", "==", subjectId).get();
		chapters = getChaptersQuery.docs.map((doc) => {
			return { id: doc.id, ...doc.data() };
		});
	} catch (error) {
		console.error(`Error while reading chapters of ${subjectId}`, error);
		return next(new HttpError('Chapter read failed, please try again.', 500));
	}

	res.status(200).json({
		code: 'SUCCESS',
    message: 'Chapter read successfully',
    data: chapters
	});
}

exports.getSubjects = getSubjects;
exports.getChapters = getChapters;