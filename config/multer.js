// config/multer.js

const multer = require('multer');

const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, 'uploads/'); // Save uploaded files to the 'uploads' directory
  // },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Add timestamp to avoid filename conflicts
  }
});

module.exports = storage;
