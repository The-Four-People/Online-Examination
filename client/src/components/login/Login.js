import React, { useLayoutEffect, useRef, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { Navbar } from "../componentIndex";
import hasToken from "../../methods/hasToken";

export default function Login() {
	document.title = "Login | Online Examination";
	const [isLoggedIn, setisLoggedIn] = useState(false);
	const [role, setrole] = useState("teacher");
	const [teacherColor, setteacherColor] = useState("#ffbb00");
	const [studentColor, setstudentColor] = useState("#00ffdd");
	const email = useRef(null);
	const password = useRef(null);

	useLayoutEffect(() => {
		const data = hasToken();
		setisLoggedIn(data.ok);
	}, []);

	function teacherClickHandle(e) {
		e.preventDefault();
		setrole("teacher");
		setteacherColor("#ffbb00");
		setstudentColor("#00ffdd");
	}

	function studentClickHandle(e) {
		e.preventDefault();
		setrole("student");
		setstudentColor("#ffbb00");
		setteacherColor("#00ffdd");
	}

	function handleFormSubmit(e) {
		e.preventDefault();
		console.log("Login.......");
		const Email = email.current.value;
		const Password = password.current.value;
		if (Email && Password) {
			fetch(`${process.env.REACT_APP_BASE_URI}/api/login/${role}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: Email,
					password: Password,
				}),
			})
				.then((data, err) => {
					if (data) {
						return data.json();
					} else {
						console.log(err);
					}
				})
				.then((data) => {
					// console.log(data);
					if (data.ok === true) {
						localStorage.setItem("token", JSON.stringify(data.token));
						setisLoggedIn(true);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}
	return (
		<>
			{isLoggedIn && <Redirect to="/" />}
			<Navbar signIn={false} />
			<div className="main-form-container">
				<div className="form-container">
					<form className="form" onSubmit={handleFormSubmit}>
						<div className="btn-cont">
							<button
								className="btn-role"
								style={{ backgroundColor: teacherColor }}
								onClick={teacherClickHandle}
							>
								Teacher
							</button>
							<button
								className="btn-role"
								style={{ backgroundColor: studentColor }}
								onClick={studentClickHandle}
							>
								Student
							</button>
						</div>
						<input
							name="email"
							type="email"
							placeholder="Email"
							ref={email}
							required
						/>

						<input
							name="password"
							type="password"
							placeholder="Password"
							required
							minLength="5"
							maxLength="20"
							ref={password}
						/>

						<input type="submit" value="Login" />
						<p className="reg-login">
							Don't have an account?{" "}
							<Link className="reg-login-link" to="/register">
								Register
							</Link>
						</p>
					</form>
				</div>
			</div>
		</>
	);
}
