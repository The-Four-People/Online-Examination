import { React, useLayoutEffect, useState, useRef } from "react";
import hasToken from "../../methods/hasToken";
import { Redirect } from "react-router";
import { Navbar } from "../componentIndex";

export default function Teacher() {
	const [isAuthorise, setisAuthorise] = useState(true);
	const [msg, setMsg] = useState("");
	const name = useRef(null);
	const email = useRef(null);
	const password = useRef(null);

	document.title = "Register Teacher | Online Examination";

	useLayoutEffect(() => {
		const data = hasToken();
		// console.log(data);
		if (data.ok === true && data.role === "admin") {
			setisAuthorise(true);
		} else {
			setisAuthorise(false);
		}
	}, []);

	function handleFormSubmit(e) {
		e.preventDefault();
		console.log(JSON.parse(localStorage.getItem("token")));
		const Name = name.current.value;
		const Email = email.current.value;
		const Password = password.current.value;
		console.log("Registering.....");
		if (Name && Email && Password) {
			fetch(`${process.env.REACT_APP_BASE_URI}/api/register/teacher`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
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
					setMsg(data.msg);
					if (data.ok === true) {
						document.getElementById("form").reset();
					}
				})
				.catch((err) => console.log(err));
		}
	}

	return (
		<>
			{isAuthorise === false ? <Redirect to="/" /> : ""}
			<Navbar signIn={false} />
			<div className="heading-sep">Register Teacher</div>
			<div className="main-form-container">
				<div className="form-container">
					<form id="form" className="form" onSubmit={handleFormSubmit}>
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
						<p className="reg-login">{msg}</p>
					</form>
				</div>
			</div>
		</>
	);
}
