const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssignmentSchema = new Schema({



    
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },file_url: {
       type: String
    },
    dueDate: {
        type: Date,
        required: true
    },
    class_id: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    submissions: [{
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        file_url: String,
        submittedAt: Date
    }]
});

const Assignment = mongoose.model('Assignment', AssignmentSchema);
module.exports= Assignment;
