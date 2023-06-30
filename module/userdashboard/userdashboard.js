//
//  UserDashBoard ->
//
//  Created by Gyan on 23/06/2023.
//

const usrdashboardroutes = require('express').Router();
const multer = require('multer')();
const fs = require('fs');

const jwt = require('../security/jwt/jwtmanager');
const mongodatabase = require('../databasemanager/mongodbmanager');

const albumPath = `./Media/`;

const FileUtility = require('../multimediaupload/mediaupload');
const fileUtility = new FileUtility(albumPath);

usrdashboardroutes.post('/createAlbum', multer.none(), (req, res) => {
    jwt.verifyToken(req.body.token , (error, decoded) => {
        if (error == 1) {
            const query = { userId: decoded.userId, albumName: req.body.albumName };
            mongodatabase.findDocuments("useralbum", query)
            .then((documents) => {
                if (documents.length > 0) {
                    res.status(200).json({ message: "Album Already Presents. Please create a different album."});
                } else {
                    const directoryPath = `./Media/${decoded.userId}/${req.body.albumName}`;

                    fs.mkdir(directoryPath, { recursive: true }, (err) => {
                        if (err) {
                            res.status(400).json({ error: 'Internal Server Error' });
                        } else {
                            const generatedDate = getCurrentDate();                                                                
                            const document = { 
                                userId: decoded.userId, 
                                albumName: req.body.albumName, 
                                albumID: "Mystudio_" + decoded.userId, 
                                generatedDate: generatedDate,
                                eventDate: req.body.eventDate,
                                eventType: req.body.eventType,
                                albumPath: directoryPath,
                                files: []
                            };

                            mongodatabase.insertDocument("useralbum", document)
                            .then((result) => {
                                res.status(200).json({ message: 'Album Created Successfully.'});
                            })
                            .catch((error) => {
                                res.status(404).json({ message: 'Failed to Create Album.'});
                            });
                        }
                    });
                }
            })
            .catch((error) => {
                console.error('Failed to find documents:', error);
            });
        } else {
            res.status(200).json({ message: 'Token Expired'});
        }
    })
});
  
usrdashboardroutes.post('/deleteAlbum', multer.none(), (req, res) => {
    jwt.verifyToken(req.body.token , (error, decoded) => {
        if (error == 1) {
            const directoryPath = `./Media/${decoded.userId}/${req.body.albumName}`;
            deleteDirectory(directoryPath, result => {
                if (result == 1) {
                    const query = { userId: decoded.userId, albumName: req.body.albumName };
                    mongodatabase.deleteDocument("useralbum", query)
                    .then((result) => {
                        res.status(200).json({ message: 'Album Deleted Successfully.'});
                    })
                    .catch((error) => {
                        res.status(400).json({ message: 'Failed to Delete Album.'});
                    });
                } else {
                    res.status(200).json({ error: 'Please choose a Album to Delete' });
                }
            });
        }
    })
});

usrdashboardroutes.post('/renameAlbum', multer.none(), (req, res) => {
    jwt.verifyToken(req.body.token , (error, decoded) => {
        if (error == 1) {
            const oldPath = `./Media/${decoded.userId}/${req.body.albumName}`;
            const newPath = `./Media/${decoded.userId}/${req.body.newName}`;
            renameDirectory(oldPath, newPath, result => {
                if (result == 1) {
                    const generatedDate = getCurrentDate();                                                                
                    const document = { 
                        userId: decoded.userId, 
                        albumName: req.body.newName, 
                        albumID: "Mystudio_" + decoded.userId, 
                        generatedDate: generatedDate,
                        eventDate: req.body.eventDate,
                        eventType: req.body.eventType,
                        albumPath: newPath,
                        files: []
                    };                    
                    const query = { userId: decoded.userId, albumName: req.body.albumName };
                    mongodatabase.updateDocument("useralbum", query, document)
                    .then(result => {
                        res.status(200).json({ message: 'Album Renamed Successful...' });
                    })
                    .catch(error => {
                        res.status(400).json({ error: 'Failed to Rename The Album...' });
                    });
                } else {
                    res.status(200).json({ error: 'Please choose a Album to Delete' });
                }
            });
        }
    })
});

usrdashboardroutes.post('/savefilestoalbum',  fileUtility.uploadMultipleFiles(`files`, 5), function (req, res) {
    // console.log("\n\n" + req.body.token);
    jwt.verifyToken(req.body.token , (error, decoded) => {
        if (error == 1) {                  
            const query = { userId: decoded.userId, albumID: req.body.albumID, albumName: req.body.albumName };
            mongodatabase.findDocuments("useralbum", query)
            .then(documents => {
                if (documents.length == 0) {
                    res.status(400).json({ message: "Something Went Wrong!!.."});
                } else {
                    const albumPath = `Media/${decoded.userId}/${req.body.albumName}`;
                    const FileHandler = require('../multimediaupload/FileHandler');
                    const fileHandler = new FileHandler();
                    var updateDoc = documents[0];
                    // var fileInfo = documents[0].files;
                    req.files.forEach((file) => {
                        // Move a file
                        fileHandler.moveFile(`${file.path}`, `${albumPath}/${file.filename}`);
                        updateDoc.files.push({
                            filename: file.originalname,
                            filepath: "http://localhost:3000/api/" + `${albumPath}/${file.filename}`
                        });
                    });
                    // const generatedDate = getCurrentDate();                                                                
                    // updateDoc.files = fileInfo;  
                    mongodatabase.updateDocument("useralbum", query, updateDoc)
                    .then(documents => {
                        // File upload completed successfully
                        return res.status(200).json({ message: 'Files Stored Successfull...' });
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(400).json({ error: 'Failed to Store The Album files...' });
                    });
                }
            })
            .catch(error => {
                console.log(error);
                res.status(400).json({ error: 'Failed to Store The Album files...' });
            });
        } else {
            res.status(400).json({ error: 'Session Expired' });
        }
    })
});

function deleteDirectory(directoryPath, callback) {
    if (fs.existsSync(directoryPath)) {
      fs.readdirSync(directoryPath).forEach(file => {
        const filePath = `${directoryPath}/${file}`;
        if (fs.lstatSync(filePath).isDirectory()) {
          // Recursively delete subdirectory
          deleteDirectory(filePath);
        } else {
          // Delete file
          fs.unlinkSync(filePath);
        }
      });
      // Delete the empty directory
      fs.rmdirSync(directoryPath);
      callback(1);
    } else {
      callback(0);
    }
}

function renameDirectory(oldPath, newPath, callback) {
    if (fs.existsSync(oldPath)) {
      fs.rename(oldPath, newPath, (error) => {
        if (error) {
          callback(false);
        } else {
          callback(true);
        }
      });
    } else {
      callback(false);
    }
  }

function getCurrentDate() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    return `${day}/${month}/${year}`;
}

module.exports = usrdashboardroutes;