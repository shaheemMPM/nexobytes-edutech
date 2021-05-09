const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const subjectSchema = new Schema({
	subjectId: { type: String, required: true, unique: true },
	classId: { type: String, required: true },
	className: { type: String, required: true },
	name: { type: String, required: true },
	createdAt: { type: Number, required: true },
	createdBy: { type: String, required: true },
});

subjectSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Subject", subjectSchema);
