const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    profile: {
        characters: {
            info: {
                nickname: String,
                level: Number,
                experience: Number,
                dialogues: String,
            },
            skills: {
                vision: Number,
            },
        },
    },
})

module.exports = mongoose.model('user', UserSchema)