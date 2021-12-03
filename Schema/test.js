const mongoose = require("mongoose");

const attemptSchema = {
	_id: false,
	id: {
		type: Number,
	},
	answer: {
		type: String,
	},
};
const Schema = new mongoose.Schema({
	course_code: {
		type: String,
		required: true,
	},
	test_name: {
		type: String,
		required: true,
	},
	student_email: {
		type: String,
		required: true,
	},
	quiz: [attemptSchema],
	marks: [Number],
});

module.exports = Schema;
