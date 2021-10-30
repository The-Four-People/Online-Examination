const express = require('express')
const { courseModel } = require('../../Models/modelIndex')

const router = express.Router()

router.post('/', (req, res) => {
    let { name, total_marks, isStarted, quiz } = req.body
    save(name, total_marks, isStarted, quiz)
        .then((data, err) => {
            err ? res.json(err) : res.json(data)
        })
        .catch(err => {
            res.json({ ok: false, msg: "An error occured", error: err })
        })
})

function save(name, total_marks, isStarted, quiz) {
    // const ques = [quiz]
    console.log(quiz)
    const promise = new Promise((res, rej) => {
        try {

            courseModel.create({
                name,
                total_marks,
                isStarted,
                quiz
            })
                .then((data, err) => {
                    if (!err) {
                        res({ ok: true, msg: "Course Successfully created" })
                    } else {
                        rej({ ok: false, msg: "An Error Occured", error: err })
                    }
                })
                .catch(err => {
                    rej({ok:false,msg:"Error",error:err})
                })
        } catch (err) {
            rej({ ok: false, msg: "An error occured", error: err })
        }
    })
    return promise
}
module.exports = router
