import React from "react";
import { picEmptyProfile } from "../res/resIndex";
import { Sidebar } from "./componentIndex";
import hasToken from "../methods/hasToken";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

// const sha1 = "#3aafa9";	Never used
// const secd = "#2b7a78";

const UserCard = () => {
	const [isClicked, setIsClicked] = React.useState(true);
	const [isLoggedOut, setisLoggedOut] = React.useState(false);
	const [name, setName] = React.useState("");
	const handleClick = () => {
		const btn = document.querySelector(".card-user-container");
		const show = document.querySelector(".dropdown-content");
		if (isClicked) {
			btn.style.backgroundColor = "#17252a";
			btn.style.color = "white";
			show.style.display = "block";
			btn.style.border = "white solid 1px";
		} else {
			btn.style.backgroundColor = "white";
			show.style.display = "none";
			btn.style.color = "black";
			btn.style.border = "none";
		}
		setIsClicked(!isClicked);
	};
	React.useEffect(() => {
		var obj = hasToken();
		if (obj) setName(obj.name);
	}, []);

	const logOut = () => {
		localStorage.clear();
		setisLoggedOut(true);
	};

	return (
		<div className="dropdown">
			<div className="card-user-container" onClick={() => handleClick()}>
				<img src={picEmptyProfile} alt="user" className="card-user-icon" />
				<span id="card-user-name">{name}</span>
			</div>
			<div className="dropdown-content" id="card-dropdown">
				<Link to="/dashboard">Dashboard</Link>
				<p onClick={logOut}>Log out</p>
			</div>
			{isLoggedOut ? <Redirect to="/login" /> : null}
		</div>
	);
};

const NavbarSignInBtn = () => {
	const [isClicked, setIsClicked] = React.useState(false);
	const handleClick = () => {
		// const btn = document.querySelector("#btn-sign-in");
		// const show = document.querySelector(".dropdown-content");
		// if (isClicked) {
		// 	btn.style.backgroundColor = secd;
		// 	show.style.display = "block";
		// } else {
		// 	btn.style.backgroundColor = sha1;
		// 	show.style.display = "none";
		// }
		// setIsClicked(!isClicked);
		// return <Redirect to="/login" />;
		// console.log(isClicked);
		setIsClicked(true);
	};

	return (
		<div className="dropdown">
			<button
				className="btn btn-primary btn-round"
				id="btn-sign-in"
				onClick={() => handleClick()}
			>
				Sign In
			</button>
			{isClicked ? <Redirect to="/login" /> : null}
		</div>
	);
};

const NavbarBrand = () => {
	return (
		<div className="navbar-brand">
			{hasToken().ok ? <Sidebar /> : ""}

			<img
				src="https://gpmumbai.ac.in/gpmweb/wp-content/uploads/2021/04/GPM-LOGO-2021.png"
				className="navbar-icon"
				alt="logo"
			/>
			<h3>Exam Portal</h3>
		</div>
	);
};

const NavbarItems = (props) => {
	const showUserCard = () => {
		if (props.signIn) {
			return <NavbarSignInBtn />;
		} else {
			return <UserCard />;
		}
	};
	React.useEffect(() => showUserCard(), []);
	return <div className="navbar-items">{showUserCard()}</div>;
};

const Navbar = (props) => {
	return (
		<>
			<nav className="navbar-container">
				<NavbarBrand />
				<NavbarItems signIn={props.signIn} />
			</nav>
		</>
	);
};

export default Navbar;
