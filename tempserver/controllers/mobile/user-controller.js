const { validationResult } = require('express-validator');
const HttpError = require('../../models/http-error');
const admin = require('firebase-admin');

const login = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.error('Invalid inputs passed in mobile user login', errors);
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}
	
	let { username, password } = req.body;
  
	let existingUser;
  
	try {
    let getUserQuery = await admin.firestore().collection("students").doc(username).get();
    existingUser = getUserQuery.data();
	} catch (err) {
		console.error(`Error while checking for existing user in login`, err);
		return next(new HttpError('Logging in failed, please try again later.', 500));
	}
  
	if (!existingUser) {
		console.error(`Can't find user with given username in login`);
		return next(new HttpError('User does not exist, could not log you in.', 403));
	}
  
	let isValidPassword = false;
	isValidPassword = (existingUser.password === password);
  
	if (!isValidPassword) {
		console.error(`Invalid password entered for sign in of : ${username}`);
		return next(new HttpError('Invalid credentials, could not log you in.', 403));
	}

  if (existingUser.isActive) {
    console.error(`Tried to login an already logged in user : ${username}`);
		return next(new HttpError('User already logged in on another device', 403));
  }

  try {
    await admin.firestore().collection("students").doc(username).update({
      isActive: true
    });
  } catch (error) {
    console.error(`Database write error on isActive true in login : ${username}`, error);
		return next(new HttpError('Database error, try again', 403));
  }

	console.log(`Successfully logged in : ${existingUser.username}`);

	res.status(200).json({
		code: 'SUCCESS',
    message: 'The user successfully logged in',
    data: existingUser
	});
}

const logout = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.error('Invalid inputs passed in mobile user logout', errors);
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}
	
	let { username, password } = req.body;
  
	let existingUser;
  
	try {
    let getUserQuery = await admin.firestore().collection("students").doc(username).get();
    existingUser = getUserQuery.data();
	} catch (err) {
		console.error(`Error while checking for existing user in logout`, err);
		return next(new HttpError('Logout failed, please try again later.', 500));
	}
  
	if (!existingUser) {
		console.error(`Can't find user with given username in logout`);
		return next(new HttpError('User does not exist, could not log you out.', 403));
	}
  
	let isValidPassword = false;
	isValidPassword = (existingUser.password === password);
  
	if (!isValidPassword) {
		console.error(`Invalid password entered for sign out of : ${username}`);
		return next(new HttpError('Invalid credentials, could not log you out.', 403));
	}

  if (!existingUser.isActive) {
    console.error(`Tried to logout an already logged out user : ${username}`);
		return next(new HttpError('User already logged out on another device', 403));
  }

  try {
    await admin.firestore().collection("students").doc(username).update({
      isActive: false
    });
  } catch (error) {
    console.error(`Database write error on isActive false in logout : ${username}`, error);
		return next(new HttpError('Database error, try again', 403));
  }

	console.log(`Successfully logged out : ${existingUser.username}`);

	res.status(200).json({
		code: 'SUCCESS',
    message: 'The user successfully logged out'
	});
}

exports.login = login;
exports.logout = logout;