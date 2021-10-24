const express = require('express')
const UserModal = require('../Modals/User')
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator')
const Router = express.Router()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

function save(name, email, password) {
    const promise = new Promise(function (resolve, reject) {
        try {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password.toString(), salt)
            UserModal.create({
                name,
                email,
                password: hash
            }).then((data, err) => {
                if (!err) {
                    console.log(data)
                    resolve({ ok: true, msg: 'User successfully registered' })
                } else {
                    reject({ ok: false, msg: 'Operation Unsucessfull', error: err })
                }
            }).catch(err => {
                reject({ ok: false, msg: 'Error', error: err })
            })
        } catch (err) {
            reject({ ok: false, msg: "Error", error: err })
        }
    })
    return promise
}

const validation = (req, res, next) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        errors = errors.errors
        const length = errors.length
        if (length > 1) {
            return res.status(400).json({
                ok: false, msg: "Not a valid email address and " +
                    "password should be atleast 5 characters long", error: errors
            })
        } else {
            if (errors[0].param === "email") {
                return res.status(400).json({ ok: false, msg: "Not an valid email address", error: errors })
            } else {
                return res.status(400).json({ ok: false, msg: "Password should be more than 5 characters", error: errors })
            }
        }
    }
    next()
}
Router.post('/',
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    validation,
    (req, res) => {
        const { name, email, password } = req.body
        save(name, email, password)
            .then((data, err) => {
                err ? res.json(err) : res.json(data)
            })
            .catch(err => {
                res.json({ ok: false, msg: 'An error occured', error: err })
            })
    })

Router.get('/', (req, res) => {
    res.sendStatus(404) 
})


module.exports = Router