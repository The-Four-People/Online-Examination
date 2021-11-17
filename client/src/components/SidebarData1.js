import React from "react";
// import * as FaIcons from 'react-icons/fa'; Never Used
import * as AiIcons from "react-icons/ai";
// import * as IoIcons from 'react-icons/io';
import { RiDashboardFill } from "react-icons/ri";
import { MdCreate } from "react-icons/md";

export const SidebarData1 = [
	{
		title: "Home",
		path: "/",
		icon: <AiIcons.AiFillHome />,
		cName: "menu-text",
	},
	{
		title: "Dashboard",
		path: "/dashboard",
		icon: <RiDashboardFill />,
		cName: "menu-text",
	},
	{
		title: "Create Student",
		path: "/register",
		icon: <MdCreate />,
		cName: "menu-text",
	},
];
