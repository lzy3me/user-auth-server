const express = require('express')
const bodyParser = require('body-parser')
const user = require('./routes/user')
const InitiateMongoServer = require('./config/db')

InitiateMongoServer()

const app = express()
// PORT
const PORT = process.env.PORT || 3000
// Middleware
app.use(bodyParser.json())

/**
 * Router Middleware
 * Router - /user/*
 * Method - *
 */
app.use('/user', user)

app.listen(PORT, (req, res) => {
    console.info(`🚀 Server Started at http://localhost:${PORT} 🚀`)
})