const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
  username: { type: String, required: true, unique: true },
  classId: { type: String, required: true },
  className: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Number, required: true },
  createdBy: { type: String, required: true },
  isActive: { type: Boolean, required: true },
});

studentSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Student", studentSchema);
