const path = require('path')
function checkFileType(file, cb) {
    // only allow 
    const fileType = /jpeg|jpg|png|gif|svg/
    // check extension
    const extname = fileType.test(path.extname(file.originalname).toLowerCase())
    // check mime type
    const mimetype = fileType.test(file.mimetype)
    if (mimetype && extname) {
      cb(null, true)
    } else {
      cb('only image file')
    }
}
module.exports = checkFileType;