import React, { useRef, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'


export default function Login() {
    document.title = "Login | Online Examination"
    const [success, setSuccess] = useState(false)
    const email = useRef(null)
    const password = useRef(null)

    function handleFormSubmit(e) {
        e.preventDefault()
        console.log("Login.......")
        const Email = email.current.value
        const Password = password.current.value
        console.log(Email, Password)
        if (Email && Password) {
            fetch(
                `${process.env.REACT_APP_BASE_URI}/api/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: Email,
                        password: Password
                    })
                }
            )
                .then((data, err) => {
                    if (data) {
                        return data.json()
                    } else {
                        console.log(err)
                    }
                })
                .then(data => {
                    console.log(data)
                    if(data.ok === true){
                        setSuccess(true)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    return (
        <div className='main-form-container'>
            <div className="form-container">
                <form className="form" onSubmit={handleFormSubmit}>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        ref={email}
                        required />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        minLength="5"
                        maxLength="20"
                        ref={password}
                    // pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
                    />

                    <input type="submit" value="Register" />
                    <p className="reg-login">Have an account? <Link className="reg-login-link" to="/register">Register</Link></p>
                </form>
            </div>
            {success && <Redirect push to="/"/>}
        </div>
    )
}
