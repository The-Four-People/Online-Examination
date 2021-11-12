import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/componentIndex';

export default function Home() {
    document.title = 'Online Examination';
    return (
        <>
            <Navbar />
            <div>
                <h1>Hello this is Home of our Online Examination 😆</h1>
                <h2>
                    <Link to='/login'>Login</Link>
                </h2>
                <h2>
                    <Link to='/register'>Register</Link>
                </h2>
                <h2>
                    <Link to='/dashboard'>Dashboard</Link>
                </h2>
            </div>
        </>
    );
}
