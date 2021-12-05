import React from 'react';
// import * as FaIcons from 'react-icons/fa'; Never Used
import * as AiIcons from 'react-icons/ai';
// import * as IoIcons from 'react-icons/io';
import { RiDashboardFill } from 'react-icons/ri';
import { MdCreate } from 'react-icons/md';

export const SidebarData1 = [
    {
        title: 'Manage Database',
        path: 'https://cloud.mongodb.com/v2/6171676e158c9b40d2ef7855#metrics/replicaSet/617168ab48e6233daccedc83/explorer/Users',
        icon: <RiDashboardFill />,
        cName: 'menu-text',
    },
    {
        title: 'Create Admin',
        path: '/register/admin',
        icon: <MdCreate />,
        cName: 'menu-text',
    },
    {
        title: 'Create Teacher',
        path: '/register/teacher',
        icon: <MdCreate />,
        cName: 'menu-text',
    },
];
