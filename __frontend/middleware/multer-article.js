const multer = require('multer');
const path = require('path');

let name;
let extension;
let fullName;
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
    };

const storage =  multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, `${path.join(__dirname, `../uploads/articles`)}`);
    },
    filename: (req, file, callback) => {
        name = file.originalname.split(' ').join('_').replace('.','_');
        extension = MIME_TYPES[file.mimetype];
        fullName = name + Date.now() + '.' + extension;
        if(!extension) callback(new Error("Only images allowed"))
        callback(null, fullName);
    }
    
    });
    


module.exports =  multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
          //return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
}).single('miniature-upload');
/*module.exports = async (req, res, next) =>{
    await setup()
    console.log(extension)
    if(extension)multer({storage: storage}).single('miniature-upload');
    else next();
}*/
