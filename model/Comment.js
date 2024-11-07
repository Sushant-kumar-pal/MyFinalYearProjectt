const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    class_id: { type: Schema.Types.ObjectId, ref: 'Class' },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    pdf_id: { type: Schema.Types.ObjectId, ref: 'PDF' },
    comment_text: String,
    comment_date: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
