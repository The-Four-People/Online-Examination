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

router.get("/", (req, res) => {
  if (req.obj.role === "teacher") {
    findCourseProperty("teacher_id", req.obj._id)
      .then((courses) => {
        if (courses) {
          console.log("Getting all courses");
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
              teacher.courses[index].students_enrolled.push(
                student._id.toString()
              );
              const courseObj = {
                  course_id:course.code,
                  course_name:teacher.courses[index].name,
                  teacher_id:teacher._id.toString()
              }
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
                      res.json({ ok: false, msg: "Cannot update student" });
                    });
                })
                .catch((err) => {
                  console.log(err);
                  res.json({ ok: false, msg: "An error occured" });
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
  } else if (req.obj.role === "teacher") {
    var course_auth = false;
    await findCourseProperty("course_code", req.params.code)
      .then(async ([course]) => {
        if (course) {
          course_auth = req.obj._id.toString() === course.teacher_id.toString();
          console.log(course_auth);
        } else {
          res.json({ ok: false, msg: "not found" });
        }
      })
      .catch((err) => res.json(err));

    if (course_auth) {
      const collection = mongoose.model(req.params.code, courseSchema);
      collection.find({}, (err, course) => {
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

module.exports = router;
