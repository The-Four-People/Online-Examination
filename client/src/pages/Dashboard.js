import React from "react";
import hasToken from "../methods/hasToken";
import { Navbar, DashboardTr, DashboardSt } from "../components/componentIndex";

const Dashboard = () => {
	const [user, setUser] = React.useState({});

	document.title = "Dashboard | Online Examination";
	React.useLayoutEffect(() => {
		setUser(hasToken());
	}, []);
	const decideRender = () => {
		if (user.role === "teacher") {
			return (
				<>
					<Navbar signIn={!user.ok} />
					<DashboardTr user={user} />
				</>
			);
		} else if (user.role === "student") {
			return (
				<>
					<Navbar signIn={!user.ok} />
					<DashboardSt user={user} />
				</>
			);
		} else {
			return <h1>Something went wrong</h1>;
		}
	};
	return decideRender();
};

export default Dashboard;
