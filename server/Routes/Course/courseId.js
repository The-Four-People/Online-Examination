const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const { teacherUser, studentUser } = require("../../Models/modelIndex");
const { courseIndex } = require("../../Models/modelIndex");
const { courseSchema, testSchema } = require("../../Schema/schemaIndex");

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

router.post("/", (req, res) => {
	res.send("Not Found");
});

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
			.catch((err) => {
				console.log(err);
				res.json({ ok: false, error: err });
			});

		if (isStudentEnrolled) {
			var collection = mongoose.model(req.params.code, courseSchema);
			var tests = await collection.find({}).exec();
			var response = tests.map((test) => {
				// console.log(test);
				var obj = {
					test_name: test.test_name,
					test_type: test.test_type,
					total_marks: test.total_marks,
					isStarted: test.isStarted,
					course_name: test.name,
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
		} else {
			res.json({ ok: false, msg: "Not Enrolled" });
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
	} else {
		res.json({ ok: false, msg: "Not Authorized" });
	}
});

function updateStudentUser(email, collectionName, marks) {
	const promise = new Promise(async (resolve, reject) => {
		try {
			const student = await findStudentByEmail(email);
			if (student) {
				student.test_attempted.push({
					code: collectionName,
					marks: marks,
				});
				student
					.save()
					.then((data, err) => {
						// console.log("Hello", data, err);
						if (!err) {
							resolve(true);
						} else {
							reject(false);
						}
					})
					.catch((err) => {
						console.log(err);
						reject(false);
					});
			} else {
				reject(false);
			}
		} catch (err) {
			console.log(err);
			reject(false);
		}
	});
	return promise;
}

function checkMarks(original_quiz, attempt_quiz) {
	const promise = new Promise((resolve, reject) => {
		try {
			let marks = 0;
			const ids = Object.keys(attempt_quiz);
			// console.log(original_quiz);
			ids.map((id) => {
				// console.log(id);
				original_quiz.find((curr) => {
					// console.log(curr.id == parseInt(id + 1));
					// console.log(curr.id, parseInt(id) + 1);
					if (curr.id === parseInt(id) + 1) {
						// console.log(
						// 	curr.id,
						// 	id,
						// 	curr.answer,
						// 	Object.values(attempt_quiz[id])[0]
						// );
						// console.log(curr.answer === Object.values(attempt_quiz[id])[0]);
						if (curr.answer === Object.values(attempt_quiz[id])[0]) {
							marks += curr.marks;
							// console.log(marks);
						}
					}
				});
			});
			resolve(marks);
		} catch (e) {
			reject(null);
			console.log(e);
		}
	});

	return promise;
}
// router.use("/:code/:test/attempt", TestAttempt);
router.post(
	"/:code/:test/attempt",
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
	async (req, res) => {
		try {
			const [original_quiz, original_quiz_length] = await getQuestionCounts(
				req.params.code,
				req.params.test
			);
			const attempt_quiz_length = req.body.length;

			const marks = await checkMarks(original_quiz, req.body);
			console.log(marks);

			if (original_quiz_length === attempt_quiz_length) {
				const model = mongoose.model(
					`${req.params.code}-${req.params.test}`,
					testSchema
				);
				let attempt = [];
				req.body.map((data) => {
					let key = Object.keys(data)[0];
					let tempObj = {
						id: key,
						answer: data[key],
					};
					attempt.push(tempObj);
				});

				const already_attempted = await model
					.findOne({ student_email: req.obj.email })
					.exec();
				if (already_attempted) {
					res.json({ ok: false, msg: "Already attempted" });
				} else {
					model
						.create({
							course_code: req.params.code,
							test_name: req.params.test,
							student_email: req.obj.email,
							quiz: attempt,
						})
						.then((data, err) => {
							if (!err) {
								updateStudentUser(
									req.obj.email,
									`${req.params.code}-${req.params.test}`,
									marks
								).then((data, err) => {
									if (data) {
										res.json({ ok: true, msg: "Test succesfully attempted" });
									} else {
										res.json({
											ok: false,
											msg: "Updating student unsuccessfull",
										});
									}
								});
							} else {
								res.json({
									ok: false,
									msg: "Test attempt unsuccessfull",
									error: err,
								});
							}
						})
						.catch((err) => {
							res.json({
								ok: false,
								msg: "Test attempt unsuccessful",
								error: err,
							});
						});
				}
			} else {
				res.json({ ok: false, msg: "All questions should be answered" });
			}
		} catch (err) {
			console.log(err);
		}
	}
);

async function getQuestionCounts(code, test) {
	const course = mongoose.model(code, courseSchema);
	let testDoc = await course.findOne({ test_name: test }).select("-_id").exec();
	if (testDoc) {
		return [testDoc.quiz, testDoc.quiz.length];
	}
}

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
					course_name: test.name,
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
				res.json({ ok: true, ...obj });
			} else {
				res.json({ ok: false, msg: `Test doesn't exist` });
			}
		} else {
			res.json({ ok: false, msg: "Student Not register" });
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
