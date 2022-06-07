const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    tag: {
        type: String,
    },
    description: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Notes', NotesSchema);