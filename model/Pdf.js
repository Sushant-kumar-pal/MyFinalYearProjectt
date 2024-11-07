const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    uploader_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    file_url: { type: String, required: true },
    Descrioption: { type: String, required: true },
    originalFileName: { type: String, required: true } // New field for original file name
});

module.exports = mongoose.model('PDF', pdfSchema);
