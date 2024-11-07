const express = require('express');
const router = express.Router();
const wrapAsyncy = require('../utils/wrapAsncy.js')
const Class = require('../model/class.js');
const ClassMembership = require('../model/ClassMembership.js');
const{isLogedin} = require('../middware.js');


router.get('/',isLogedin,wrapAsyncy( (req, res) => {
    
    
    res.render('join-class.ejs');
}));

router.post('/',isLogedin, wrapAsyncy(async (req, res) => {
   
        const { class_code } = req.body;
        const classinfo = await Class.findOne({ class_code: class_code });
        if (!classinfo) {
            req.flash('error', 'Invalid Class Code');
            return res.redirect('/dashboard');
        }
        if (classinfo.instructor_id.equals(req.session.userId)) {
            req.flash('error', 'You are the instructor of this class');
            return res.redirect('/dashboard');
        }
        const membership = new ClassMembership({
            user_id: req.session.userId,
            class_id: classinfo._id
        });
        if(await membership.save()){
            req.flash('success', 'Class Join!');
        }
      
      
        res.redirect('/dashboard');
    
}));
module.exports =router;