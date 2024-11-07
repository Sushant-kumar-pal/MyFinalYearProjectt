const express = require('express');
const router = express.Router();
const wrapAsyncy = require('../utils/wrapAsncy.js')
const generateUniqueCode = require('../utils/generateUniqueCode');
const{isLogedin} = require('../middware.js');
const Class = require('../model/class.js');

router.get('/',isLogedin,wrapAsyncy( async(req, res) => {
    const uniqueCode = await generateUniqueCode();
    res.render('create-class', { uniqueCode });
}));

router.post('/',isLogedin,wrapAsyncy( async (req, res) => {
   
    req.flash('success', 'Class Created Suceessfuly');
        const class1 = new Class({
            class_name: req.body.class_name,
            instructor_id: req.session.userId,
            class_code: req.body.class_code,
            secion: req.body.secion,
            subject: req.body.subject,
            background:req.body.background,
        });
        await class1.save();
        res.redirect('/dashboard');
    
}));

module.exports =router;
