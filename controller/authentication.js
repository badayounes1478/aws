//Final code all done
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../Schema/user');

const signupController = (req, res) => {
    user.find({ email: req.body.email }).then(data => {
        if (data.length >= 1) {
            return res.status(409).json({
                message: 'user exists'
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    user.create({
                        email: req.body.email,
                        password: hash,
                    }).then(data => {
                        const token = jwt.sign({
                            email: data.email,
                            userId: data._id
                        }, "secret",
                            {
                                expiresIn: "1h"
                            })
                        return res.status(201).json({
                            message: 'User Created',
                            token: token,
                        })
                    }).catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })
                }
            })
        }
    })
}


const loginController =  (req, res) => {
    user.find({ email: req.body.email }).then(data => {
        if (data.length < 1) {
            return res.status(401).json({
                message: 'Auth Failed'
            })
        }
        bcrypt.compare(req.body.password, data[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Auth Failed',
                })
            }
            if (result) {
                const token = jwt.sign({
                    email: data[0].email,
                    user_id: data[0]._id
                }, "secret",
                    {
                        expiresIn: "1h"
                    })
                return res.status(200).json({
                    message: 'Auth Sucess',
                    token: token,
                })
            } return res.status(401).json({
                message: 'Auth Failed'
            })
        })
    })
}

module.exports = {
    signupController,
    loginController
}