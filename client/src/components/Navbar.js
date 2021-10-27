import React from 'react';
import { picEmptyProfile } from '../res/resIndex';
import { Sidebar } from './componentIndex';

const sha1 = '#3aafa9';
const secd = '#2b7a78';

const UserCard = () => {
    const [isClicked, setIsClicked] = React.useState(true);
    const handleClick = () => {
        const btn = document.querySelector('.card-user-container');
        const show = document.querySelector('.dropdown-content');
        if (isClicked) {
            btn.style.backgroundColor = '#17252a';
            btn.style.color = 'white';
            show.style.display = 'block';
            btn.style.border = 'white solid 1px';
        } else {
            btn.style.backgroundColor = 'white';
            show.style.display = 'none';
            btn.style.color = 'black';
            btn.style.border = 'none';
        }
        setIsClicked(!isClicked);
    };
    return (
        <div className='dropdown'>
            <div className='card-user-container' onClick={() => handleClick()}>
                <img
                    src={picEmptyProfile}
                    alt='user'
                    className='card-user-icon'
                />
                <span id='card-user-name'>SS19CO018</span>
            </div>
            <div
                className='dropdown-content'
                id='card-dropdown'
                style={{ marginLeft: '1.5rem' }}
            >
                <a href='http://#'>Profile</a>
                <a href='http://#'>Log out</a>
            </div>
        </div>
    );
};

const NavbarSignInBtn = () => {
    const [isClicked, setIsClicked] = React.useState(true);
    const handleClick = () => {
        const btn = document.querySelector('#btn-sign-in');
        const show = document.querySelector('.dropdown-content');
        if (isClicked) {
            btn.style.backgroundColor = secd;
            show.style.display = 'block';
        } else {
            btn.style.backgroundColor = sha1;
            show.style.display = 'none';
        }
        setIsClicked(!isClicked);
    };

    return (
        <div className='dropdown'>
            <button
                className='btn btn-primary btn-round'
                id='btn-sign-in'
                onClick={() => handleClick()}
            >
                Sign In
            </button>
            <div className='dropdown-content'>
                <a href='http://#'>Student</a>
                <a href='http://#'>Teacher</a>
            </div>
        </div>
    );
};

const NavbarBrand = () => {
    return (
        <div className='navbar-brand'>
            <Sidebar />
            <img
                src='https://gpmumbai.ac.in/gpmweb/wp-content/uploads/2021/04/GPM-LOGO-2021.png'
                className='navbar-icon'
                alt='logo'
            />
            <h3>Exam Portal</h3>
        </div>
    );
};

const NavbarItems = (props) => {
    const showUserCard = () => {
        if (props.signIn) {
            return <NavbarSignInBtn />;
        }
    };
    React.useEffect(() => showUserCard(), []);
    return (
        <div className='navbar-items'>
            <a href='https:/#' className='navbar-link'>
                page1
            </a>
            <a href='https://#' className='navbar-link'>
                page2
            </a>
            <a href='https://#' className='navbar-link'>
                page3
            </a>
            {showUserCard()}
        </div>
    );
};

const Navbar = (props) => {
    return (
        <>
            <nav className='navbar-container'>
                <NavbarBrand />
                <NavbarItems signIn={props.signIn} />
            </nav>
        </>
    );
};

export default Navbar;
