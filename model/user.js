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
                level: {
                    type: Number,
                    default: 1
                },
                experience: {
                    type: Number,
                    default: 0
                },
                dialogues: String,
            },
            skills: {
                vision: Number,
            },
        },
    },
})

module.exports = mongoose.model('user', UserSchema)