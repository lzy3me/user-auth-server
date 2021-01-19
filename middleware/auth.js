const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.header('token')
    if (!token) return res.status(401).json({message: "auth key failed"})

    try {
        const decoded = jwt.verify(token, process.env.RAND_STR)
        req.user = decoded.user
        next()
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "invalid token"})
    }
}