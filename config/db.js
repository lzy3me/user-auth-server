const mongoose = require('mongoose')

const URL = process.env.DB_CONN
const InitiateMongoServer = async () => {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true
        })
        console.info('🔥 Connect to DB 🔥')
    } catch (err) {
        console.error('an error occured => ', err)
        throw err
    }
}

module.exports = InitiateMongoServer