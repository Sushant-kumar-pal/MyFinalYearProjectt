const express = require('express');
const router = express.Router();
const wrapAsyncy = require('../utils/wrapAsncy.js')
const ClassMembership = require('../model/ClassMembership.js');
const{isLogedin} = require('../middware.js');


router.post('/:classId',isLogedin,wrapAsyncy( async (req, res) => {
    
    try {
        await ClassMembership.findOneAndDelete({ user_id: req.session.userId, class_id: req.params.classId });
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.send('Error leaving class');
    }
}));

module.exports =router;