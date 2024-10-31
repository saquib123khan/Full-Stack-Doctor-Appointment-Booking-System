import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Folder where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keep the original name of the file
    }
});

const upload = multer({ storage });

export default upload;