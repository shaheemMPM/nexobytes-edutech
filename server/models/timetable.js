const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timetableSchema = new Schema({
	classId: { type: String, required: true },
	className: { type: String, required: true },
	createdAt: { type: Number, required: true },
	createdBy: { type: String, required: true },
	date: { type: Number, required: true },
	timetable: { type: String, required: true },
});

module.exports = mongoose.model("Timetable", timetableSchema);
