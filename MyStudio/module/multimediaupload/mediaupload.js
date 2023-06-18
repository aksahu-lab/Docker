const express = require('express');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();

// Create a custom destination directory if it doesn't exist
const createCustomDirectory = (req, file, cb) => {
    const fileType = file.mimetype;
    var customDirectory;
    // Process the file based on its type
    if (fileType.startsWith('image/')) {
        // It's an image file
        console.log('Image file uploaded');
        customDirectory = `./Media/Photo/${req.body.mobilenumber}`
    } else if (fileType.startsWith('video/')) {
        // It's a video file
        console.log('Video file uploaded');
        customDirectory = `./Media/Video/${req.body.mobilenumber}`
    } else {
        // It's neither an image nor a video
        console.log('Unknown file type');
        customDirectory = `./Media/${req.body.mobilenumber}`
    }
  
    fs.mkdirSync(customDirectory, { recursive: true });
    cb(null, customDirectory);
};

// Multer configuration
const storage = multer.diskStorage({
    destination: createCustomDirectory,
    filename: (req, file, cb) => {
        const originalname = file.originalname;
        const extension = originalname.split('.').pop();
        const filenameWithoutExtension = originalname.slice(0, originalname.lastIndexOf('.'));
        const currentTimeInMilliseconds = Date.now();
        let newFilename = `${filenameWithoutExtension}_${currentTimeInMilliseconds}.${extension}`;
        cb(null, newFilename);
      }
});
  
const upload = multer({ storage: storage });
  
router.post('/uploadVideo', upload.single('video'), (req, res) => {
    // Handle the uploaded file
    // console.log(req.body.user); // Access the uploaded file details
    res.send('File uploaded successfully');
});
  
router.post('/uploadVideos', upload.array('videos'), (req, res) => {
    // Handle the uploaded file
    console.log(req.file); // Access the uploaded file details
    res.send('File uploaded successfully');
});
  
router.post('/uploadImage', upload.single('image'), (req, res) => {
    // Handle the uploaded file
    console.log(req.file); // Access the uploaded file details
    res.send('File uploaded successfully');
});
  
router.post('/uploadImages', upload.array('images'), (req, res) => {
    // Handle the uploaded file
    console.log(req.file); // Access the uploaded file details
    res.send('File uploaded successfully');
});
  
module.exports = router;
module.exports = {upload};
