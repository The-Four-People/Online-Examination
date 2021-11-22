const express = require("express");
const { studentUser } = require("../../Models/modelIndex");
const Router = express.Router();

Router.get("/", (req, res) => {
	res.json({ ok: true });
});

Router.post(
	"/",
	async (req, res, next) => {
		if (req.obj.role === "student") {
			console.log(req.params.code);
			var isStudentEnrolled = await findStudentByEmail(req.obj.email)
				.then((student) => {
					return student.course_enrolled.some(
						(c) => c.course_id === req.params.code
					);
				})
				.catch((err) => {
					console.log(err);
					res.json({ ok: false, error: err });
				});
			if (isStudentEnrolled) {
				next();
			} else {
				res.json({ ok: false, msg: "Student Not Enrolled" });
			}
		} else {
			res.json("Not Found");
		}
	},
	(req, res) => {}
);

function findStudentByEmail(email) {
	const promise = new Promise(async (res, rej) => {
		try {
			const student = await studentUser.findOne({ email }).exec();
			//   console.log(student);
			res(student);
		} catch (err) {
			console.log(err);
			rej(null);
		}
	});

	return promise;
}
module.exports = Router;
