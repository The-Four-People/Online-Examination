import "./App.css";
import { Home } from "./pages/pageIndex";
import { Login, RegisterStudent } from "./components/componentIndex";
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
			</Switch>
		</BrowserRouter>
	);
}

export default App;
