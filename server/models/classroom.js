const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const classroomSchema = new Schema({
	classId: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	createdAt: { type: Number, required: true },
	createdBy: { type: String, required: true },
	description: { type: String, required: false },
});

classroomSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Classroom", classroomSchema);
