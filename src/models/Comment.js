const mongoose = require('mongoose');


const CommentSchema  = new mongoose.Schema({
    playerId: {
        type: String,
        required: true
    },
    lastComment: {
        type: Date,
        required: true
    }
},{collection: 'comment'});



const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;