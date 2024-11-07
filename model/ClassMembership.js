const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassMembershipSchema = new Schema({
    class_id: { type: Schema.Types.ObjectId, ref: 'Class' },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' }
});

const ClassMembership = mongoose.model('ClassMembership', ClassMembershipSchema);

module.exports = ClassMembership;
  