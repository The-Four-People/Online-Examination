const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { studentUser } = require('../../Modals/modalsIndex')
const dotenv = require('dotenv')
const path = require('path')
const { body, validationResult } = require('express-validator')
const jwt = require("jsonwebtoken")

dotenv.config({
    path: path.join(__dirname, '../', '.env')
})



const validate = (req, res, next) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        errors = errors.errors
        console.log(errors)
        if (errors.length > 1) {
            return res.json({
                ok: false,
                msg: "Not a valid email address and password should me minimum 5 chracters" +
                    "and maximum 20 characters"
            })
        } else {
            if (errors[0].param === 'email') {
                return res.json({ ok: false, msg: "Provide a valid email address" })
            } else {
                return res.json({ ok: false, msg: "Password should be minimum 5 characters and maximum 20 characters" })
            }
        }
    }

    next()
}

function findUser(email) {
    const promise = new Promise((resolve, reject) => {
        try {
            studentUser.findOne({ email: email },
                function (err, user) {
                    if (!err) {
                        resolve(user)
                    } else {
                        reject(err)
                    }
                }
            )
        } catch (err) {
            reject({ ok: false, msg: "Error", error: err })
        }
    })
    return promise
}

function checkpassword(password, hash) {
    try {
        const login = bcrypt.compareSync(password, hash)
        if (login === true) {
            return true
        } else {
            return false
        }
    } catch (err) {
        console.log(err)
        return false
    }
}


router.post('/',
    body('email').isEmail(),
    body('password').isLength({ min: 5, max: 20 }),
    validate,
    (req, res) => {
        let { email, password } = req.body
        password = password.toString()
        findUser(email, password)
            .then((user, err) => {
                if (user) {
                    const isPasswordCorrect = checkpassword(password, user.password)
                    if (isPasswordCorrect) {
                        const { name, email, role } = user
                        const jwt_token = jwt.sign({ name: name, email: email, role: role }, process.env.key, { expiresIn: '2h' })
                        console.log(jwt_token)
                        res.json({ ok: true, msg: "User found", token: jwt_token })
                    } else {
                        res.json({ ok: false, msg: "Password Incorrect" })
                    }
                } else {
                    res.json({ ok: false, msg: "Student not found" })
                }
            }).
            catch(err => {
                res.json(err)
            })
    })

router.get('/', (req, res) => {
    res.sendStatus(404)
})

module.exports = router