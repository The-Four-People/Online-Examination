import jwt from "jsonwebtoken";

function hasToken() {
	try {
		const token = JSON.parse(localStorage.getItem("token"));
		const result = jwt.verify(token, process.env.REACT_APP_KEY);
		return { ok: true, ...result };
	} catch (err) {
		return { ok: false, error: err };
	}
}

export default hasToken;
