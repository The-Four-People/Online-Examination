import React from 'react';
// import * as FaIcons from 'react-icons/fa'; Never Used
// import * as IoIcons from 'react-icons/io';
import { RiDashboardFill } from 'react-icons/ri';
import { MdCreate } from 'react-icons/md';

export const SidebarData2 = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <RiDashboardFill />,
        cName: 'menu-text',
    },
    {
        title: 'Create Student',
        path: '/register/student',
        icon: <MdCreate />,
        cName: 'menu-text',
    },
];
