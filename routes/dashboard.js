const express = require('express');
const router = express.Router();
const wrapAsyncy = require('../utils/wrapAsncy.js');
const Class = require('../model/class.js');
const ClassMembership = require('../model/ClassMembership.js');
const PDF = require('../model/Pdf.js');
const Comment = require('../model/Comment.js');
const User = require('../model/user.js');
const multer = require('multer');
const path = require('path');
const Assignment = require('../model/Assignment');
const { isLogedin } = require('../middware.js');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });
// Serve static files from the 'uploads' directory
router.use('/uploads', express.static('uploads'));
router.use(express.static(path.join(__dirname,'/public')))

router.get('/', isLogedin, wrapAsyncy(async (req, res) => {
    const createdClasses = await Class.find({ instructor_id: req.session.userId }).populate('instructor_id');
    const userMemberships = await ClassMembership.find({ user_id: req.session.userId }).populate({
        path: 'class_id',
        populate: {
            path: 'instructor_id'
        }
    });
    const user = await User.findById(req.session.userId);
    res.render('dashboard', { createdClasses, userMemberships, profile: user.profile });
}));



router.get('/show-detail/:classId', isLogedin, wrapAsyncy(async (req, res, next) => {
    const { classId } = req.params;
    const data = await PDF.find({ class_id: classId }).populate('uploader_id'); 

    const commentsWithPDF = await Comment.find({ pdf_id: { $in: data.map(pdf => pdf._id) } }).populate('user_id');
    const commentsWithoutPDF = await Comment.find({ pdf_id: null, class_id: classId }).populate('user_id');

    const classInfo = await Class.findById(classId);
    if (!classInfo) {
        console.log(`Class not found for ID: ${classId}`);
        return res.status(404).send('Class not found');
    }

    
    const classCreatorId = classInfo.instructor_id ? classInfo.instructor_id.toString() : null;
    const userId = req.session.userId ? req.session.userId.toString() : null;

    if (!userId) {
        console.log('User ID is undefined or null');
    }

    let classCreatorName = '';
    if (classCreatorId) {
        const classCreator = await User.findById(classCreatorId);
        classCreatorName = classCreator ? classCreator.username : 'Unknown';
    }

    res.render('class-detail', { data, commentsWithPDF, commentsWithoutPDF, classId, userId, classCreatorId, classCreatorName,class_code: classInfo.class_code });
}));



router.get('/show-detail/:classId/Assignment', isLogedin, wrapAsyncy(async (req, res) => {
    const { classId } = req.params;
    const assignments = await Assignment.find({ class_id: classId }).populate('createdBy').populate({
        path: 'submissions',
        populate: {
            path: 'user_id',
            model: 'User'
        }
    });
    const classInfo = await Class.findById(classId);
    const instructorId = classInfo.instructor_id.toString();
    const userId = req.session.userId;
    res.render('Assignment.ejs', { assignments, classId , instructorId, userId });
}));


router.get('/create-assignment/:classId', isLogedin, async (req, res) => {
    const { classId } = req.params;
    const classInfo = await Class.findById(classId);
    res.render('new-assignment.ejs', { classInfo,classId });
});

router.post('/create-assignment/:classId', isLogedin, upload.single('file'), async (req, res) => {
    try {
        const { title, description, dueDate, class_id } = req.body;
        const newAssignment = new Assignment({
            title,
            description,
            dueDate,
            class_id,
            createdBy: req.session.userId,
            file_url: req.file.path,
        });
        await newAssignment.save();
        req.flash('success', 'Assignment created successfully!');
        res.redirect(`/dashboard/show-detail/${class_id}/Assignment`);
    } catch (err) {
        console.error('Error creating assignment:', err);
        req.flash('error', 'There was a problem creating the assignment.');
        res.redirect(`/dashboard/create-assignment/${req.params.classId}`);
    }
});

router.get('/assignments/submit/:assignmentId', isLogedin, async (req, res) => {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId);
    res.render('Assignment-submission.ejs', { assignment });
});

router.post('/assignments/submit/:assignmentId', isLogedin, upload.single('file'), async (req, res) => {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId);

    // Check if the due date has passed
    if (new Date() > new Date(assignment.dueDate)) {
        req.flash('error', 'The due date for this assignment has passed. You cannot submit files.');
        return res.redirect(`/dashboard/show-detail/${assignment.class_id}/Assignment`);
    }

    assignment.submissions.push({
        user_id: req.session.userId,
        file_url: req.file.path,
        submittedAt: new Date()
    });
    await assignment.save();
    req.flash('success', 'Assignment Submited successfully!');
    res.redirect(`/dashboard/show-detail/${assignment.class_id}/Assignment`);
});



router.get('/show-detail/:classId/people',isLogedin,wrapAsyncy(async (req, res) => {
    const { classId } = req.params;
    const classMembers = await ClassMembership.find({ class_id: classId }).populate('user_id');
    const userId = req.session.userId ? req.session.userId.toString() : null;
    const classInfo = await Class.findById(classId).populate('instructor_id');
    const classCreatorId = classInfo.instructor_id ? classInfo.instructor_id._id.toString() : null;
    const classCreatorName = classInfo.instructor_id ? classInfo.instructor_id.username : null;

    res.render('class-member', { classId, classMembers, userId, classCreatorId, classCreatorName });

}));

router.post('/class/delete-member/:classMemberId', isLogedin, wrapAsyncy(async (req, res) => {
    try {
        const { classMemberId } = req.params;
        const { class_id } = req.body;

        // Log the incoming classMemberId and class_id
        console.log(`Attempting to delete class member with ID: ${classMemberId} from class with ID: ${class_id}`);

        // Check if the logged-in user is the creator of the class
        const classInfo = await Class.findById(class_id);
        if (!classInfo) {
            console.log(`Class not found for ID: ${class_id}`);
            return res.status(404).send('Class not found');
        }

        if (!classInfo.instructor_id.equals(req.session.userId)) {
            console.log(`User ${req.session.userId} is not authorized to delete members from class ${class_id}`);
            return res.status(403).send('You are not authorized to delete class members.');
        }

        // Delete the class membership
        const deletedMember = await ClassMembership.findByIdAndDelete(classMemberId);
        if (!deletedMember) {
            console.log(`Class member not found for ID: ${classMemberId}`);
            return res.status(404).send('Class member not found.');
        }

        // Delete associated comments without PDF
        await Comment.deleteMany({ user_id: deletedMember.user_id, pdf_id: null, class_id: classInfo._id });

        // Get all PDFs in the class
        const pdfsInClass = await PDF.find({ class_id: classInfo._id });

        // Delete comments associated with PDFs in the class
        await Comment.deleteMany({ pdf_id: { $in: pdfsInClass.map(pdf => pdf._id) }, user_id: deletedMember.user_id });

        // Get PDFs uploaded by the deleted member
        const pdfsToDelete = pdfsInClass.filter(pdf => pdf.uploader_id.equals(deletedMember.user_id));

        // Delete associated PDFs and comments with PDFs uploaded by the deleted member
        for (const pdf of pdfsToDelete) {
            await Comment.deleteMany({ pdf_id: pdf._id });
            await PDF.deleteOne({ _id: pdf._id });
        }

        req.flash('success', 'Class member and associated data deleted successfully.');
        res.redirect(`/dashboard/show-detail/${class_id}`);
    } catch (err) {
        console.error('Error deleting class member:', err);
        res.status(500).send('Internal Server Error');
    }
}));


router.get('/update-class/:classId', isLogedin, wrapAsyncy(async (req, res) => {
    const classinfo = await Class.findById(req.params.classId);
    if (!classinfo.instructor_id.equals(req.session.userId)) {
        return res.status(403).send('You are not authorized to update this class');
    }
    res.render('update-class.ejs', { classinfo });
}));

router.post('/update-class/:classId', isLogedin, wrapAsyncy(async (req, res) => {
    req.flash('success', 'Class updated!');
    const classinfo = await Class.findById(req.params.classId);
    if (!classinfo.instructor_id.equals(req.session.userId)) {
        return res.status(403).send('You are not authorized to update this class');
    }
    classinfo.class_name = req.body.class_name;
    classinfo.secion = req.body.section;
    classinfo.subject = req.body.subject;
    await classinfo.save();
    res.redirect('/dashboard');
}));

router.post('/profile/update', isLogedin, upload.single('profilePic'), async (req, res) => {
    try {
        const userId = req.session.userId;
        const profilePic = req.file ? req.file.path : null;

        // Update user with the new profile picture URL
        await User.findByIdAndUpdate(userId, { profile: profilePic });
        const profile= userId.profile;
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error updating profile picture:', err);
        req.flash('error', 'There was a problem updating your profile picture.');
        res.redirect('/dashboard');
    }
});

module.exports = router;
