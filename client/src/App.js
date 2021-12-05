import "./App.css";
import { Dashboard, Course, Test, Result } from "./pages/pageIndex";
import {
	Login,
	LoginAdmin,
	RegisterStudent,
} from "./components/componentIndex";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import hasToken from "./methods/hasToken";
// import { Navbar, Sidebar } from "./components/componentIndex";

function App() {
	const [isLoggedIn, setisLoggedIn] = useState(false);

	useLayoutEffect(() => {
		const data = hasToken();
		setisLoggedIn(data.ok);
	}, []);

	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/">
					{isLoggedIn ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
				</Route>
				<Route exact path="/login">
					<Login />
				</Route>
				<Route exact path="/login-admin">
					<LoginAdmin />
				</Route>
				<Route exact path="/register">
					<RegisterStudent />
				</Route>
				{/* <Route exact path="/c/:courseid/new">
					<Test />
				</Route> */}
				<Route exact path="/dashboard">
					<Dashboard />
				</Route>
				<Route exact path="/c/:code">
					<Course />
				</Route>
				<Route exact path="/c/:code/:test">
					<Test />
				</Route>
				<Route exact path="/c/:code/:test/result">
					<Result />
				</Route>
				<Route>
					<h1>404 Not found</h1>
				</Route>
			</Switch>
		</BrowserRouter>
	);
}

export default App;
