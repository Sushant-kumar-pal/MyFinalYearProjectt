module.exports.isLogedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Welcome! Please sign in or create an account to proceed.');
        return res.redirect('/');
    }
    next();
}

// middware.js

const Class = require('./model/class.js');
const ClassMembership = require('./model/ClassMembership.js');

module.exports.fetchCreatedAndJoinedClasses = async (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        try {
            const createdClasses = await Class.find({ instructor_id: req.user._id });
            const userMemberships = await ClassMembership.find({ user_id: req.user._id }).populate('class_id');
            const joinedClasses = userMemberships.map(membership => membership.class_id);
            res.locals.createdClasses = createdClasses;
            res.locals.joinedClasses = joinedClasses;
        } catch (error) {
            console.error(error);
            res.locals.createdClasses = [];
            res.locals.joinedClasses = [];
        }
    } else {
        res.locals.createdClasses = [];
        res.locals.joinedClasses = [];
    }
    next();
};
