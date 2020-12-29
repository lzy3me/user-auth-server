const express = require('express')
const { check, validationResult } = require('express-validator/check')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

const User = require('../model/user')
const auth = require('../middleware/auth')

/**
 * @method - POST
 * @param - /signup
 * @description - User Sign Up
 */
router.post('/signup', [
    check('username', '#101-username-void')
        .not()
        .isEmpty(),
    check('email', '#102-email-vaild').isEmail(),
    check('password', '#103-password-vaild')
        .isLength({
            min: 8
        })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {
        username,
        email,
        password
    } = req.body

    try {
        let user = await User.findOne({
            email
        })

        if (user) {
            return res.status(400).json({
                msg: 'this username already taken'
            })
        }

        user = new User({
            username,
            email,
            password
        })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        await user.save()

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            process.env.RAND_STR, {
                expiresIn: 10000
            },
            (err, token) => {
                if (err) throw err
                res.status(200).json({
                    token
                })
            }
        )
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Error in saving')
    }
})

/**
 * @method - POST
 * @param - /signin
 * @description - User Sign into the server
 */
router.post('/signin', [
    check('email', '#201-email-valid').isEmail(),
    check('password', '#202-password-valid').isLength({
        min: 8
    })
], async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { email, password } = req.body
    try {
        let user = await User.findOne({
            email
        })

        if (!user)
            return res.status(400).json({
                message: 'this user dose not exist'
            })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) 
                return res.status(400).json({
                    message: "incorrect password"
                })

            const payload = {
                user: {
                    id: user.id
                }
            }
    
            jwt.sign(
                payload,
                process.env.RAND_STR, {
                    expiresIn: 3600
                },
                (err, token) => {
                    if (err) throw err
                    res.status(200).json({
                        token
                    })
                }
            )
            
    } catch (err) {
        console.error(err.message)
        res.status(500).send('an error occured on server or someting')
    }
})

/**
 * @method - GET
 * @param - /profile
 * @@description - Get logged in user
 */
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        res.json(user)
    } catch (err) {
        res.status(400).json({
            message: "error fetching user"
        })
    }
})

module.exports = router