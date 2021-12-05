import React, { useState, useLayoutEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData1 } from './SidebarData1';
import { SidebarData2 } from './SidebarData2';
import { SidebarData3 } from './SidebarData3';
import hasToken from '../methods/hasToken';

const Sidebar = () => {
    const [user] = useState(hasToken());
    const [sidebarData, setSidebarData] = useState([]);
    const [isMenuActive, setIsMenuActive] = React.useState(false);
    const toggleMenu = () => setIsMenuActive(!isMenuActive);
    useLayoutEffect(() => {
        switch (user.role) {
            case 'admin':
                setSidebarData(SidebarData1);
                break;
            case 'teacher':
                setSidebarData(SidebarData2);
                break;
            case 'student':
                setSidebarData(SidebarData3);
                break;
            default:
                setSidebarData([]);
        }
    }, [user.role]);
    return (
        <>
            <div className='sidebar'>
                <Link to='#' className='menu-btn'>
                    <FaIcons.FaBars onClick={() => toggleMenu()} />
                </Link>
            </div>
            <nav className={isMenuActive ? 'menu active' : 'menu'}>
                <ul className='menu-items'>
                    <li className='menu-close-btn'>
                        <Link
                            to='#'
                            className='menu-btn'
                            onClick={() => toggleMenu()}
                        >
                            <AiIcons.AiOutlineClose />
                        </Link>
                    </li>
                    {sidebarData.map((item, index) => {
                        if (item.title === 'Manage Database') {
                            return (
                                <li key={index} className={item.cName}>
                                    <a href={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </a>
                                </li>
                            );
                        }

                        return (
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </>
    );
};
export default Sidebar;
