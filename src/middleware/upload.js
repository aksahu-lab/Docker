const multer = require('multer');
const fs = require('fs');
const path = require('path');


const generateStorage = (filePath) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join('uploads', filePath);
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
      // cb(null, file.originalname);
    },
  });
};

// Custom file upload middleware
const uploadMiddleware = (path, maxFiles) => async (req, res, next) => {
  const upload = multer({ storage: generateStorage(path) });
  // Use multer upload instance
  upload.array('files', maxFiles)(req, res, (err) => {
    if (err) {
      if(err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ error: `More than ${maxFiles} files not allowed` });
      }
      return res.status(400).json({ error: err.message });
    }
    if(!req.files) {
      return res.status(400).json({ error:  'no files sent in the request'});
    }
    
    // Retrieve uploaded files
    const files = req.files;
    const errors = [];
    
    
    // Validate file types and sizes
    files.forEach((file) => {

      const allowedTypes = ['image/jpeg', 'image/png', 'image/bmp'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.mimetype} for file ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      // Remove uploaded files
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }

    // Attach files to the request object
    req.files = files;

    // Proceed to the next middleware or route handler
    next();
  });
};

// Custom file upload middleware
const singleUploadMiddleware = (path) => async (req, res, next) => {
  const upload = multer({ storage: generateStorage(path) });
  // Use multer upload instance
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if(!req.file) {
      return res.status(400).json({ error:  'no file sent in the request'});
    }
    const file = req.file;
    const errors = [];
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/bmp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.mimetype)) {
      errors.push(`Invalid file type: ${file.mimetype} for file ${file.originalname}`);
    }

    if (file.size > maxSize) {
      errors.push(`File too large: ${file.originalname}`);
    }

    // Handle validation errors
    if (errors.length > 0) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ errors });
    }
    req.file = file;
    next();
  });
};

module.exports = {
  uploadMiddleware,
  singleUploadMiddleware
}