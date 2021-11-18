import "./App.css";
import { Home, Dashboard, Course, Test } from "./pages/pageIndex";
import { Login, RegisterStudent, Test } from "./components/componentIndex";
import { BrowserRouter, Switch, Route } from "react-router-dom";
// import { Navbar, Sidebar } from "./components/componentIndex";

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/">
					<Home />
				</Route>
				<Route exact path="/login">
					<Login />
				</Route>
				<Route exact path="/register">
					<RegisterStudent />
				</Route>
				<Route exact path="/c/:courseid/new">
					<Test />
				</Route>
				<Route exact path="/dashboard">
					<Dashboard />
				</Route>
				<Route exact path="/c/:code">
					<Course />
				</Route>
				<Route exact path="/c/:code/:test">
					<Test />
				</Route>
				<Route>
					<h1>404 Not found</h1>
				</Route>
			</Switch>
		</BrowserRouter>
	);
}

export default App;
