const fs = require('fs');
const path = require('path');

class FileHandler {
  constructor() {
    // Set the base directory for file operations
    this.baseDirectory = '';
  }

  moveFile(sourcePath, destinationPath) {
    const sourceFile = path.join(this.baseDirectory, sourcePath);
    const destinationFile = path.join(this.baseDirectory, destinationPath);

    fs.renameSync(sourceFile, destinationFile);
    console.log('File moved successfully.');
  }

  copyFile(sourcePath, destinationPath) {
    const sourceFile = path.join(this.baseDirectory, sourcePath);
    const destinationFile = path.join(this.baseDirectory, destinationPath);

    fs.copyFileSync(sourceFile, destinationFile);
    console.log('File copied successfully.');
  }

  deleteFile(filePath) {
    const file = path.join(this.baseDirectory, filePath);

    fs.unlinkSync(file);
    console.log('File deleted successfully.');
  }

  saveFileToDirectory(file, directoryPath) {
    const destinationDirectory = path.join(this.baseDirectory, directoryPath);
    const destinationFile = path.join(destinationDirectory, file.originalname);

    // Create the destination directory if it doesn't exist
    if (!fs.existsSync(destinationDirectory)) {
      fs.mkdirSync(destinationDirectory, { recursive: true });
    }

    fs.writeFileSync(destinationFile, file.buffer);
    console.log('File saved to directory successfully.');
  }

  deleteDirectory(filePath) {
    const file = path.join(this.baseDirectory, filePath);
    fs.rmdir(file, { recursive: true }, (err) => {
      if (err) {
        console.error('Failed to delete directory:', err);
        throw err;
      }
      console.log('Directory deleted successfully:', file);
    });
  }

}

module.exports = FileHandler;
