import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
    const [name, setname] = useState(null)
    const [email, setemail] = useState(null)
    const [password, setpassword] = useState(null)

    function handleNameChange(e) {
        setname(e.target.value)
    }

    function handleEmailChange(e) {
        setemail(e.target.value)
    }

    function handlePasswordChange(e) {
        setpassword(e.target.value)
    }


    function handleFormSubmit(e) {
        e.preventDefault()
        console.log("hello")
        if (name && email && password) {
            fetch(
                `${process.env.REACT_APP_BASE_URI}/register`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            )
                .then((data, err) => {
                    if (!err) {
                        return data.json()
                    } else {
                        console.log(err)
                    }
                })
                .then(data => console.log(data))
                .catch(err => console.log(err))
        }

    }

    return (
        <div className='register-container'>
            <div className="form-container">
                <form className="form" onSubmit={handleFormSubmit}>
                    <input
                        onChange={handleNameChange}
                        name="name"
                        type="text"
                        placeholder="Name"
                        required
                        maxLength="20" />

                    <input 
                    onChange={handleEmailChange} 
                    name="email" 
                    type="email" 
                    placeholder="Email" 
                    required />

                    <input
                        onChange={handlePasswordChange}
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        minLength="5"
                        maxLength="20" 
                        // pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
                        />

                    <input type="submit" value="Register" />
                    <p className="reg-login">Have an account? <Link className="reg-login-link" to="/login">Login</Link></p>
                </form>
            </div>
        </div>
    )
}
