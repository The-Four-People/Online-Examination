import React, { useState, useRef, useLayoutEffect } from 'react';
import hasToken from '../../methods/hasToken';
import { Navbar } from '../componentIndex';
import { Redirect } from 'react-router-dom';

const LoginAdmin = () => {
    document.title = 'Login | Online Examination';
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [msg, setMsg] = useState('');
    const email = useRef(null);
    const password = useRef(null);

    useLayoutEffect(() => {
        const data = hasToken();
        setisLoggedIn(data.ok);
    }, []);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const Email = email.current.value;
        const Password = password.current.value;
        if (Email && Password) {
            fetch(`${process.env.REACT_APP_BASE_URI}/api/login/admin`, {
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
                    setMsg(data.msg);
                    if (data.ok === true) {
                        localStorage.setItem(
                            'token',
                            JSON.stringify(data.token)
                        );
                        setisLoggedIn(true);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    return (
        <>
            {isLoggedIn && <Redirect to='/' />}
            <Navbar signIn={!hasToken().ok} />
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
                        {msg}
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginAdmin;
