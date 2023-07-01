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
        } else {
            return res.status(400).json({ error: 'Session Expired' });
        }
    })
});

usrdashboardroutes.post('/savefilestoalbum', fileUtility.uploadMultipleFiles(`files`, 5), function (req, res) {
    // console.log("\n\n" + req.body.token);
    jwt.verifyToken(req.body.token, async (error, decoded) => {
        if (error == 1) {
            const query = { userId: decoded.userId, albumID: req.body.albumID };
            try {
                const documents = await mongodatabase.findDocuments("useralbum", query);
                if (documents.length == 0) {
                    return res.status(400).json({ message: "Something Went Wrong!!.." });
                }
                const updateDoc = documents[0];
                console.log("\n\n\nupdateDoc = " + JSON.stringify(updateDoc) + "\n\n***\n\n\n");
                const userAlbumPath = `Media/${decoded.userId}/${updateDoc.albumName}`;
                const FileHandler = require('../multimediaupload/FileHandler');
                const fileHandler = new FileHandler();

                console.log("\n\n\n******\n\n***\n\n\n AAA = " + req.files);

                for (const file of req.files) {
                    console.log("\n\nfile.path\n\n");
                    console.log(file.path);
                    // Move a file
                    await fileHandler.moveFile(`${file.path}`, `${userAlbumPath}/${file.filename}`);
                    updateDoc.files.push({
                        filename: file.originalname,
                        filepath: "http://localhost:3000/api/" + `${userAlbumPath}/${file.filename}`
                    });
                }

                console.log("\n\n\n******\n\n***\n\n\n");

                console.log("File save to DB = " + JSON.stringify(updateDoc));

                await mongodatabase.updateDocument("useralbum", query, updateDoc);

                return res.status(200).json({ message: 'Files Stored Successfully...' });
            } catch (error) {
                console.log(error);
                return res.status(400).json({ error: 'Failed to Store The Album files...' });
            }
        } else {
            return res.status(400).json({ error: 'Session Expired' });
        }
    });
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