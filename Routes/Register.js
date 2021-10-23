const express = require('express')
const UserModal = require('../Modals/User')
const bcrypt = require('bcrypt')
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
            reject({ok:false,msg:"Error",error:err})
        }
    })
    return promise
}

Router.post('/', (req, res) => {
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
    res.status(404).send("404 NOT FOUND")
})


module.exports = Router