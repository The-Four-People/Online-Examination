import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData1 } from './SidebarData1';
const Sidebar = () => {
    const [isMenuActive, setIsMenuActive] = React.useState(false);
    const toggleMenu = () => setIsMenuActive(!isMenuActive);
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
                    {SidebarData1.map((item, index) => {
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
