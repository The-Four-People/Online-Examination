import React, { useState } from 'react'

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
                "http://localhost:5000/register",
                {
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            )
            .then((data,err) => {
                if(!err){
                    return data.json()
                }else{
                    console.log(err)
                }
            })
            .then(data => console.log(data))
            .catch(err => console.log(err))
        }

    }

    return (
        <div className='register-container'>
            <form onSubmit={handleFormSubmit}>
                <input onChange={handleNameChange} name="name" type="text" required />
                <input onChange={handleEmailChange} name="email" type="email" required />
                <input onChange={handlePasswordChange} name="password" type="password" required />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}
