const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const videoSchema = new Schema({
	chapterId: { type: String, required: true },
	chapterName: { type: String, required: true },
	classId: { type: String, required: true },
	className: { type: String, required: true },
	createdAt: { type: Number, required: true },
	createdBy: { type: String, required: true },
	description: { type: String, required: false },
	isActive: { type: Boolean, required: true },
	publish: { type: Number, required: true },
	subjectId: { type: String, required: true },
	subjectName: { type: String, required: true },
	title: { type: String, required: true },
	url: { type: String, required: true },
});

module.exports = mongoose.model("Video", videoSchema);
