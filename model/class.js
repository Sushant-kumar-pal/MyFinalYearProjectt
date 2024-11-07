const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
    class_name: String,
    instructor_id: { type: Schema.Types.ObjectId, ref: 'User' },
    secion : String,
    subject : String,
    class_code: String,
    background:String
});

const Class = mongoose.model('Class', ClassSchema);
module.exports= Class;