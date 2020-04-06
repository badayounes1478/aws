const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../Schema/user');
const saltRounds = 10;
const router = express.Router()

router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) {
            return res.status(500).send(err)
        } else {
            user.find({ email: req.body.email }).then(data => {
                if (data.length === 0) {
                    user.create({ email: req.body.email, password: hash }).then(data => {
                        let token = jwt.sign({
                            id: data._id,
                            password: data.password
                        }, 'secret', { expiresIn: '1h' });
                        //let decoded = jwt.decode(token);
                        res.send(token);
                    })
                } else {
                    return res.status(409).json({
                        message: "user already exists"
                    })
                }
            })
        }
    });
})


router.post('/login', (req, res) => {
    user.find({ email: req.body.email }).then(data => {
        if (data.length >= 1) {
            bcrypt.compare(req.body.password, data[0].password, function (err, result) {
                if (result === true) {
                    let token = jwt.sign({
                        id: data[0]._id,
                        password: data[0].password
                    }, 'secret', { expiresIn: '1h' });
                    res.send(token);
                } else {
                    res.status(404).json({ message: "not found" })
                }
            })
        } else {
            res.status(404).json({ message: "not found" })
        }
    })
})

module.exports = router