const express = require('express');
const router = express.Router();
const wrapAsyncy = require('../utils/wrapAsncy.js')
const Class = require('../model/class.js');
const PDF = require('../model/Pdf.js');
const Comment = require('../model/Comment.js');
const multer = require('multer');
const path = require('path');
const{isLogedin} = require('../middware.js');

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

router.get('/add-more/:classId',isLogedin,wrapAsyncy( (req, res) => {
    const { classId } = req.params;
    console.log(req.user)
    res.render('upload-pdf.ejs', { classId });
}));

router.post('/add-more/:classId', upload.single('pdf_file'), isLogedin, wrapAsyncy(async (req, res) => {
    const { class_id, Descrioptions } = req.body;
    const originalFileName = req.file.originalname; // Get the original file name

    req.flash('success', 'File uploaded successfully');
    try {
        const pdf = new PDF({
            class_id: class_id,
            uploader_id: req.session.userId,
            file_url: req.file.path,
            Descrioption: Descrioptions,
            originalFileName: originalFileName // Save the original file name
        });
        await pdf.save();
        res.redirect(`/dashboard/show-detail/${class_id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error uploading PDF');
    }
}));



// Route to delete a PDF and its related comments
router.post('/delete-pdf/:pdfId', isLogedin,wrapAsyncy(async (req, res) => {
    

    req.flash('error', 'File Deleted');
    const { pdfId } = req.params;
    const pdf = await PDF.findById(pdfId);

    if (!pdf) {
        return res.status(404).send('PDF not found');
    }

    const classInfo = await Class.findById(pdf.class_id);
    if (!classInfo) {
        return res.status(404).send('Class not found');
    }

    // Check if the user is the class creator or the uploader of the PDF
    if (classInfo.instructor_id.equals(req.session.userId) || pdf.uploader_id.equals(req.session.userId)) {
        // Delete the PDF
        await PDF.findByIdAndDelete(pdfId);
        // Delete associated comments
        await Comment.deleteMany({ pdf_id: pdfId });
        return res.redirect(`/dashboard/show-detail/${pdf.class_id}`);
    } else {
        return res.status(403).send('Unauthorized');
    }
}));




// Show form to edit PDF URL
router.get('/edit-pdf/:pdfId',isLogedin,wrapAsyncy( async (req, res) => {
    
    
        const pdf = await PDF.findById(req.params.pdfId);
        if(!pdf){
            req.flash('error', 'pdf dont`s exsit');
            res.redirect(`/dashboard`);
        }
        
        
        res.render('edit-pdf', { pdf });
    
}));


// Handle form submission to update PDF URL and file
router.post('/edit-pdf/:pdfId', upload.single('pdf_file'), isLogedin, wrapAsyncy(async (req, res) => {
    req.flash('success', 'File Edited');
    const pdf = await PDF.findById(req.params.pdfId);
    if (!pdf) {
        return res.status(404).send('PDF not found');
    }

    // Update the PDF file URL if a new file was uploaded
    if (req.file) {
        pdf.file_url = req.file.path;
    }

    // Update the description
    pdf.Descrioption = req.body.Descrioptions;

    await pdf.save();
    res.redirect(`/dashboard/show-detail/${pdf.class_id}`);
}));

// Handle form submission to add comment without PDF
router.post('/add-comment-without-pdf',isLogedin,wrapAsyncy( async (req, res) => {
    
    req.flash('success', 'Annoucment INFO Added');
  
        const { class_id, comment_text } = req.body;
        const classInfo = await Class.findById(class_id);

        if (!classInfo || !classInfo.instructor_id.equals(req.session.userId)) {
            return res.status(403).send('You are not authorized to add a comment without PDF');
        }

        const newComment = new Comment({
            class_id: class_id,
            user_id: req.session.userId,
            comment_text: comment_text
        });

        await newComment.save();
        res.redirect(`/dashboard/show-detail/${class_id}`);
  
}));



router.post('/add-comment',isLogedin,wrapAsyncy( async (req, res) => {
    

    
        const { pdf_id, comment_text } = req.body;
        const pdf = await PDF.findById(pdf_id);

        if (!pdf) {
            return res.status(404).send('PDF not found');
        }

        const newComment = new Comment({
            pdf_id: pdf._id,
            user_id: req.session.userId,
            comment_text: comment_text
        });


        await newComment.save();
        res.redirect(`/dashboard/show-detail/${pdf.class_id}`);
    
}));


router.post('/delete-comment/:commentId',isLogedin, wrapAsyncy(async (req, res) => {
    

    
        const { commentId } = req.params;
        const { classId } = req.query;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).send('Comment not found');
        }

        const classInfo = await Class.findById(classId);
        if (!classInfo) {
            return res.status(404).send('Class not found');
        }

        if (comment.user_id.equals(req.session.userId) || classInfo.instructor_id.equals(req.session.userId)) {
            req.flash('error', 'Comment Deleted');
            await Comment.findByIdAndDelete(commentId);
            res.redirect(`/dashboard/show-detail/${classId}`);
        } else {
            return res.status(403).send('Unauthorized');
        }
    
}));

module.exports =router;