const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
const { teacherUser } = require("../Models/modelIndex");

dotenv.config({
	path: path.join(__dirname, "../", ".env"),
});

const hasToken = async (req, res, next) => {
	try {
		const auth = req.headers["authorization"];
		const authToken = auth.split(" ")[1];
		const result = jwt.verify(authToken, process.env.key);
		if (
			result.role === "admin" ||
			result.role === "student" ||
			result.role === "teacher"
		) {
			req.obj = result;
			next();
		} else {
			res.json({ ok: false, msg: "hasToken - Unidentified token" });
		}
	} catch (err) {
		res.json({ ok: false, msg: "Please provide a valid token" });
		console.log(err);
	}
};
module.exports = hasToken;
