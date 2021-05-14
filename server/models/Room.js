const mongoose = require('mongoose')
const schema = mongoose.Schema

const roomSchema = new schema({
    name: {
        type: String,
        required: true
    }
})

const Room = mongoose.model('Room', roomSchema)

module.exports = Room