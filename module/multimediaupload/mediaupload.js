//
//  mediaupload.js
//
//  Created by Gyan on 23/06/2023.
//


const multer = require('multer');
const fs = require('fs');
const path = require('path');

class FileUtility {
  constructor(uploadDir) {
    this.uploadDir = uploadDir;
    this.initializeStorage();
  }

  initializeStorage() {
    console.log("\n\n Multiple Upload \n\n Path ==>>>> " + this.uploadDir);

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
      }
    });

    this.upload = multer({ storage });
  }

  uploadSingleFile(fieldName) {
    return this.upload.single(fieldName);
  }

  uploadMultipleFiles(fieldName, maxCount) {
    console.log("\n\n Multiple Upload \n\n " + fieldName + " == Max Count : " + maxCount );
    return this.upload.array(fieldName, maxCount);
  }

  downloadFile(req, res, filePath, fileName) {
    const fullPath = path.join(filePath, fileName);

    if (fs.existsSync(fullPath)) {
      res.download(fullPath, fileName, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          res.status(500).json({ error: 'Failed to download file' });
        }
      });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  }
}

module.exports = FileUtility;
