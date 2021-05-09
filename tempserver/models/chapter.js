const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const chapterSchema = new Schema({
	chapterId: { type: String, required: true, unique: true },
	classId: { type: String, required: true },
	className: { type: String, required: true },
	createdAt: { type: Number, required: true },
	createdBy: { type: String, required: true },
	name: { type: String, required: true },
	subjectId: { type: String, required: true },
	subjectName: { type: String, required: true },
});

chapterSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Chapter", chapterSchema);
