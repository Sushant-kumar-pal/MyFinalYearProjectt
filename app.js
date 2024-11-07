const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const multer = require('multer');
const ejs_mate = require('ejs-mate');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Import your routers and other required files
const dashboardRouter = require('./routes/dashboard.js');
const create_classRouter = require('./routes/create-class.js');
const class_joinRouter = require('./routes/class-join.js');
const leaveRouter = require('./routes/leave-class.js');
const classesRouter = require('./routes/class.js');
const userRouter = require('./routes/user.js');
const { fetchCreatedAndJoinedClasses } = require('./middware.js'); // Import your middleware

// Models
const User = require('./model/user.js');
const Class = require('./model/class.js');
const path = require('path');

const MongoURL = 'mongodb://127.0.0.1:27017/classroom';
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.engine('ejs', ejs_mate);

app.use(session({
    secret: 'oriva mr prince',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MongoURL,
        touchAfter: 24 * 3600 // time period in seconds
    }),
    cookie: {
        expires: Date.now() + 24 * 60 * 60 * 1000,
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
    } // 1 day in milliseconds
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

app.use(fetchCreatedAndJoinedClasses); // Use your middleware here

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, '/public')));

mongoose.connect(MongoURL)
    .then(() => console.log('Connected to DB'))
    .catch(err => console.log(err));

// Routes
app.use('/dashboard', dashboardRouter);
app.use('/create-class', create_classRouter);
app.use('/class-join', class_joinRouter);
app.use('/leave-class', leaveRouter);
app.use('/class', classesRouter);
app.use('/', userRouter);

// Route to render the profile picture update form
app.get('/profile/edit', (req, res) => {
    res.render('profile-edit.ejs', { currentUser: req.user });
});

// Route to handle the profile picture update
app.post('/profile/edit', upload.single('profile_pic'), (req, res) => {
    if (req.file) {
        req.user.profile_pic = req.file.path;
        req.user.save();
        req.flash('success', 'Profile picture updated successfully');
    } else {
        req.flash('error', 'No file uploaded');
    }
    res.redirect('/dashboard');
});

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Internal Server Error' } = err;
    res.status(statusCode).render('error.ejs', { message });
});

app.listen(8080, () => {
    console.log('App listening on PORT 8080');
});
