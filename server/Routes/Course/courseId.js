const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const { teacherUser, studentUser } = require("../../Models/modelIndex");
const { courseIndex } = require("../../Models/modelIndex");
const { courseSchema } = require("../../Schema/schemaIndex");

dotenv.config({
	path: path.join(__dirname, "../", ".env"),
});

const findCourseProperty = (property, value) => {
	const promise = new Promise((resolve, reject) => {
		try {
			courseIndex.find({ [property]: value }, (err, course) => {
				if (!err) {
					resolve(course);
				} else {
					reject(err);
				}
			});
		} catch (err) {
			reject({ ok: false, msg: "find error", error: err });
		}
	});
	return promise;
};

const postStudent = (course_code) => {};

router.post("/", (req, res) => {});

router.get("/", async (req, res) => {
	if (req.obj.role === "student") {
		findStudentByEmail(req.obj.email)
			.then((student) => {
				if (student.course_enrolled) {
					res.json(student.course_enrolled);
				} else {
					res.json({
						ok: false,
						msg: "student has not registered in any course",
					});
				}
			})
			.catch((err) => res.json({ ok: false, msg: "get / error" }));
	} else if (req.obj.role === "teacher") {
		const teacher = await teacherUser.findOne({ email: req.obj.email }).exec();
		findCourseProperty("teacher_id", teacher._id)
			.then((courses) => {
				if (courses) {
					res.json(courses);
				} else {
					res.json({ ok: false, msg: "not found" });
				}
			})
			.catch((err) => res.json(err));
	}
});

function findCourse(code) {
	const promise = new Promise((res, rej) => {
		try {
			courseIndex.find({ course_code: code }).then((course, err) => {
				if (!err) {
					res(course);
				} else {
					rej(null);
				}
			});
		} catch (err) {
			console.log(err);
			rej(null);
		}
	});

	return promise;
}

const findTeacherById = (id) => {
	const promise = new Promise(async (res, rej) => {
		try {
			const teacher = await teacherUser.findById(id).exec();
			res(teacher);
		} catch (err) {
			console.log(err);
			rej(null);
		}
	});

	return promise;
};

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

router.post("/:code", async (req, res) => {
	try {
		code = req.params.code;
		let isCourse = await findCourse(code);
		if (isCourse.length > 0) {
			isCourse = isCourse[0];
			const teacher = await findTeacherById(isCourse.teacher_id);
			if (teacher) {
				teacher.courses.map(async (course, index) => {
					if (course.code === code) {
						// console.log(course);
						const student = await findStudentByEmail(req.obj.email);
						// console.log(student);
						if (student) {
							// console.log(teacher.courses[index].students_enrolled)
							// console.log((student._id).toString())

							const students_enrolled = new Set(
								teacher.courses[index].students_enrolled
							);
							if (students_enrolled.has(student._id.toString())) {
								res.json({
									ok: false,
									msg: "Student already registered",
								});
								return;
							} else {
								students_enrolled.add(student._id.toString());
								teacher.courses[index].students_enrolled =
									Array.from(students_enrolled);
							}
							// teacher.courses[index].students_enrolled.push(
							//   student._id.toString()
							// );
							const courseObj = {
								course_id: course.code,
								course_name: teacher.courses[index].name,
								teacher_id: teacher._id.toString(),
							};
							student.course_enrolled.push(courseObj);
							teacher
								.save()
								.then((data) => {
									//   console.log(data);
									student
										.save()
										.then((data) => {
											//   console.log(data);
											res.json({
												ok: true,
												msg: "Student successfully registered",
											});
										})
										.catch((err) => {
											console.log(err);
											res.json({
												ok: false,
												msg: "Cannot update student",
											});
										});
								})
								.catch((err) => {
									console.log(err);
									res.json({
										ok: false,
										msg: "An error occured",
									});
								});
						} else {
							res.json({ ok: false, msg: "No student found" });
						}
					}
				});
			} else {
				res.json({ ok: false, msg: "No teacher with that ID found" });
			}
			//   console.log(isCourse, req.obj);
		} else {
			res.json({ ok: false, msg: "No course found" });
		}
	} catch (err) {
		console.log(err);
		res.json({ ok: false, msg: "An Error occured", error: err });
	}
});

router.get("/:code", async (req, res) => {
	if (req.obj.role === "student") {
		var isStudentEnrolled = await findStudentByEmail(req.obj.email)
			.then((student) => {
				return student.course_enrolled.some(
					(c) => c.course_id === req.params.code
				);
			})
			.catch((err) => console.log(err));

		if (isStudentEnrolled) {
			var collection = mongoose.model(req.params.code, courseSchema);
			var tests = await collection.find({}).exec();
			var response = tests.map((test) => {
				var obj = {
					test_name: test.test_name,
					test_type: test.test_type,
					total_marks: test.total_marks,
					isStarted: test.isStarted,
					createdAt: test.createdAt,
				};
				// if (test.isStarted) {
				//     obj.quiz = test.quiz.map((question) => {
				//         return {
				//             id: question.id,
				//             marks: question.marks,
				//             question: question.question,
				//             options: question.options,
				//         };
				//     });
				// }
				return obj;
			});
			res.json(response);
		}
	} else if (req.obj.role === "teacher") {
		var course_auth = false;
		var teacher = await teacherUser.findOne({ email: req.obj.email }).exec();
		await findCourseProperty("course_code", req.params.code)
			.then(async ([course]) => {
				if (course) {
					course_auth = teacher._id.toString() === course.teacher_id.toString();
					console.log(course_auth);
				} else {
					res.json({ ok: false, msg: "not found" });
				}
			})
			.catch((err) => res.json(err));

		if (course_auth) {
			const collection = mongoose.model(req.params.code, courseSchema);
			collection.find({}, "-quiz -_id -createdBy", (err, course) => {
				if (!err) {
					console.log(course);
					res.json(course);
				} else {
					res.json(err);
				}
			});
		}
	}
});

router.get("/:code/:test", async (req, res) => {
	if (req.obj.role === "student") {
		var isStudentEnrolled = await findStudentByEmail(req.obj.email)
			.then((student) => {
				return student.course_enrolled.some(
					(c) => c.course_id === req.params.code
				);
			})
			.catch((err) => console.log(err));

		if (isStudentEnrolled) {
			var collection = mongoose.model(req.params.code, courseSchema);
			var test = await collection
				.findOne({ test_name: req.params.test })
				.exec();
			if (test) {
				var obj = {
					test_name: test.test_name,
					test_type: test.test_type,
					total_marks: test.total_marks,
					isStarted: test.isStarted,
					createdAt: test.createdAt,
				};
				if (test.isStarted) {
					obj.quiz = test.quiz.map((question) => {
						return {
							id: question.id,
							marks: question.marks,
							question: question.question,
							options: question.options,
						};
					});
				}
				res.json(obj);
			} else {
				res.json({ ok: false, msg: `Test doesn't exist` });
			}
		}
	} else if (req.obj.role === "teacher") {
		const teacher = await teacherUser.findOne({ email: req.obj.email }).exec();
		if (teacher) {
			// console.log(teacher);
			let isCourseByThisTeacher = false;
			teacher.courses.map((course) => {
				if (course.code === req.params.code) {
					isCourseByThisTeacher = true;
				}
			});

			if (isCourseByThisTeacher) {
				const collection = mongoose.model(req.params.code, courseSchema);
				let test = await collection
					.findOne({ test_name: req.params.test }, "-_id -__v -createdBy")
					.exec();
				if (test) {
					// test.map;
					res.json({ ok: true, data: test });
				} else {
					res.json({ ok: false, msg: "No test with found" });
				}
			} else {
				res.json({ ok: false, msg: "Not authorised" });
			}
		} else {
			res.json({ ok: false, msg: "No teacher found" });
		}
	} else {
		res.json({ ok: false, msg: "Not authorised" });
	}
});

router.post("/:code/:test/start", async (req, res) => {
	if (req.obj.role === "teacher") {
		const teacher = await teacherUser.findOne({ email: req.obj.email }).exec();
		if (teacher) {
			// console.log(teacher);
			let isCourseByThisTeacher = false;
			teacher.courses.map((course) => {
				if (course.code === req.params.code) {
					isCourseByThisTeacher = true;
				}
			});

			if (isCourseByThisTeacher) {
				const collection = mongoose.model(req.params.code, courseSchema);
				const test = await collection
					.findOne({ test_name: req.params.test })
					.exec();
				if (
					req.body.start !== undefined &&
					typeof req.body.start === "boolean"
				) {
					test.isStarted = req.body.start;
					test
						.save()
						.then((testObj) => {
							testObj.isStarted
								? res.json({ ok: true, msg: "Test succesfully started" })
								: res.json({ ok: true, msg: "Test succesfully Closed" });
						})
						.catch((err) => {
							res.json({ ok: false, msg: "An error occured", error: err });
						});
				} else {
					res.json({ ok: false, msg: "Please provide valid credentials" });
				}
			} else {
				res.json({
					ok: false,
					msg: "You're not authorized to do this task",
				});
			}
		} else {
			res.json({ ok: false, msg: "No teacher with that credentials" });
		}
	}
});
module.exports = router;
