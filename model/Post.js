const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    postTitle: {
        type: String,
        required: true
    },
    postDesc: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Post', PostSchema)