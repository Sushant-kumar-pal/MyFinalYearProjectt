const express = require('express');
const router = express.Router();
const wrapAsyncy = require('../utils/wrapAsncy.js');
const User = require('../model/user.js');
const passport = require('passport');


router.get('',(req,res)=>{
    res.render('index');
})

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', wrapAsyncy(async (req, res, next) => {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    try {
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.session.userId = registeredUser._id; // Assign the new user's id to the session
            req.flash('success', 'Welcome Sir/Student');
            res.redirect('/dashboard');
        });
    } catch (e) {
        console.error(e);
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}));


router.get('/login', wrapAsyncy((req, res) => {
    res.render('login');
}));

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
    req.session.userId = req.user._id; // Use the logged-in user's id
    req.flash('success', 'Welcome back!');
    res.redirect('/dashboard');
});

router.get('/logout',(req,res,next)=>{
    req.logout((err)=>{
     if(err){
         return next (err)
        }
     req.flash('success','You are Log-Out!');
        res.redirect('/')
    })
})


module.exports = router;
