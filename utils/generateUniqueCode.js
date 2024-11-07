const Class = require('../model/class.js');

const generateUniqueCode = async () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    let isUnique = false;

    while (!isUnique) {
        code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const existingClass = await Class.findOne({ class_code: code });
        if (!existingClass) {
            isUnique = true;
        }
    }

    return code;
};

module.exports = generateUniqueCode;
