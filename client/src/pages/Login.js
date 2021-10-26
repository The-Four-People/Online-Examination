import React, { useEffect, useRef, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Navbar } from '../components/componentIndex';

export default function Login() {
    document.title = 'Login | Online Examination';
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [sec, setSec] = useState(() => {
        if (localStorage.getItem('user')) {
            const temp = JSON.parse(localStorage.getItem('user'));
            return temp.sec;
        } else {
            return null;
        }
    });
    const email = useRef(null);
    const password = useRef(null);

    useEffect(() => {
        if (sec !== null) {
            fetch(`${process.env.REACT_APP_BASE_URI}/api/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sec,
                }),
            })
                .then((data, err) => {
                    if (data) {
                        return data.json();
                    } else {
                        console.log(err);
                    }
                })
                .then((data) => {
                    if (data.ok === true) {
                        setisLoggedIn(true);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        return () => {
            setisLoggedIn(false);
        };
    }, [sec, isLoggedIn]);

    function handleFormSubmit(e) {
        e.preventDefault();
        console.log('Login.......');
        const Email = email.current.value;
        const Password = password.current.value;
        if (Email && Password) {
            fetch(`${process.env.REACT_APP_BASE_URI}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: Email,
                    password: Password,
                }),
            })
                .then((data, err) => {
                    if (data) {
                        return data.json();
                    } else {
                        console.log(err);
                    }
                })
                .then((data) => {
                    console.log(data);
                    if (data.ok === true) {
                        // setSuccess(true)
                        setSec(data.sec);
                        localStorage.setItem(
                            'user',
                            JSON.stringify({ sec: data.sec })
                        );
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
    return (
        <>
            <Navbar signIn={false} />
            <div className='main-form-container'>
                <div className='form-container'>
                    <form className='form' onSubmit={handleFormSubmit}>
                        <input
                            name='email'
                            type='email'
                            placeholder='Email'
                            ref={email}
                            required
                        />

                        <input
                            name='password'
                            type='password'
                            placeholder='Password'
                            required
                            minLength='5'
                            maxLength='20'
                            ref={password}
                        />

                        <input type='submit' value='Login' />
                        <p className='reg-login'>
                            Don't have an account?{' '}
                            <Link className='reg-login-link' to='/register'>
                                Register
                            </Link>
                        </p>
                    </form>
                </div>
                {isLoggedIn && <Redirect to='/' />}
            </div>
        </>
    );
}
