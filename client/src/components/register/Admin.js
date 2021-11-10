import React, { useRef, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { Navbar } from "../componentIndex";

export default function Register() {
	document.title = "Sign up | Online Examination";
	const name = useRef(null);
	const email = useRef(null);
	const password = useRef(null);

	// For checking if registration is successfull and then redirecting to login page
	const [success, setSuccess] = useState(false);

	function handleFormSubmit(e) {
		e.preventDefault();
		const Name = name.current.value;
		const Email = email.current.value;
		const Password = password.current.value;
		console.log("Registering.....");
		if (Name && Email && Password) {
			fetch(`${process.env.REACT_APP_BASE_URI}/api/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: Name,
					email: Email,
					password: Password,
				}),
			})
				.then((data, err) => {
					if (!err) {
						return data.json();
					} else {
						console.log(err);
					}
				})
				.then((data) => {
					console.log(data);
					if (data.ok === true) {
						setSuccess(true);
					}
				})
				.catch((err) => console.log(err));
		}
	}

	return (
		<>
			<Navbar signIn={true} />
			<div className="main-form-container">
				<div className="form-container">
					<form className="form" onSubmit={handleFormSubmit}>
						<input
							name="name"
							type="text"
							placeholder="Name"
							required
							maxLength="20"
							ref={name}
						/>

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
							// pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
						/>

						<input type="submit" value="Register" />
						<p className="reg-login">
							Have an account?{" "}
							<Link className="reg-login-link" to="/login">
								Login
							</Link>
						</p>
					</form>
				</div>
				{success && <Redirect push to="/login" />}
			</div>
		</>
	);
}
