//
//  UserDashBoard ->
//
//  Created by Gyan on 23/06/2023.
//

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const jwt = require('../security/jwt/jwtmanager');
const mongodatabase = require('../databasemanager/mongodbmanager');
const FileUtility = require('../multimediaupload/mediaupload');
const FileHandler = require('../multimediaupload/FileHandler');
const { Console } = require('console');

const userDashboardRoutes = express.Router();
const upload = multer();

const albumPath = './Media/';
const fileUtility = new FileUtility(albumPath);
const fileHandler = new FileHandler();

userDashboardRoutes.post('/createAlbum', upload.none(), (req, res) => {
  jwt.verifyToken(req.body.token, (error, decoded) => {
    if (error === 1) {
      const query = { userId: decoded.userId, albumName: req.body.albumName };
      mongodatabase.findDocuments('useralbum', query)
        .then((documents) => {
          if (documents.length > 0) {
            res.status(200).json({ message: 'Album Already Exists. Please create a different album.' });
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
                  albumID: `Mystudio_${decoded.userId}`,
                  generatedDate: generatedDate,
                  eventDate: req.body.eventDate,
                  eventType: req.body.eventType,
                  albumPath: directoryPath,
                  files: [],
                };

                mongodatabase.insertDocument('useralbum', document)
                  .then(() => {
                    res.status(200).json({ message: 'Album Created Successfully.' });
                  })
                  .catch(() => {
                    res.status(404).json({ message: 'Failed to Create Album.' });
                  });
              }
            });
          }
        })
        .catch((error) => {
          console.error('Failed to find documents:', error);
        });
    } else {
      res.status(200).json({ message: 'Token Expired' });
    }
  });
});

userDashboardRoutes.post('/deleteAlbum', upload.none(), (req, res) => {
  jwt.verifyToken(req.body.token, (error, decoded) => {
    if (error === 1) {
      const directoryPath = `./Media/${decoded.userId}/${req.body.albumName}`;
      deleteDirectory(directoryPath, (result) => {
        if (result === 1) {
          const query = { userId: decoded.userId, albumName: req.body.albumName };
          mongodatabase.deleteDocument('useralbum', query)
            .then(() => {
              res.status(200).json({ message: 'Album Deleted Successfully.' });
            })
            .catch(() => {
              res.status(400).json({ message: 'Failed to Delete Album.' });
            });
        } else {
          res.status(200).json({ error: 'Please choose an album to delete.' });
        }
      });
    }
  });
});

userDashboardRoutes.post('/renameAlbum', upload.none(), (req, res) => {

  jwt.verifyToken(req.body.token, (error, decoded) => {
    if (error === 1) {
      const oldPath = `./Media/${decoded.userId}/${req.body.albumName}`;
      const newPath = `./Media/${decoded.userId}/${req.body.newName}`;

      renameDirectory(oldPath, newPath, (result) => {
        console.log("result == " + result);
            if (result === true) {
                const document = {
                    userId: decoded.userId,
                    albumName: req.body.newName,
                    albumID: `Mystudio_${decoded.userId}`,
                    albumPath: newPath,
                    files: [],
                };
                const query = { userId: decoded.userId, albumName: req.body.albumName };
                mongodatabase.updateDocument('useralbum', query, document)
                    .then(() => {
                        res.status(200).json({ message: 'Album Renamed Successfully.' });
                    })
                    .catch(() => {
                        res.status(400).json({ error: 'Failed to Rename The Album.' });
                    }
                );
            } else {
            res.status(200).json({ error: 'Please choose an album to rename.' });
            }
      });
    } else {
      return res.status(400).json({ error: 'Session Expired' });
    }
  });
});

userDashboardRoutes.post('/savealbum', fileUtility.uploadMultipleFiles('files', 5), async (req, res) => {
    jwt.verifyToken(req.body.token, async (error, decoded) => {
        if (error === 1) {
            const query = { userId: decoded.userId, albumID: req.body.albumID };
            try {
                const documents = await mongodatabase.findDocuments('useralbum', query);
                if (documents.length === 0) {
                    return res.status(400).json({ message: 'Something Went Wrong!!..' });
                }
                const updateDoc = documents[0];
                const userAlbumPath = `./Media/${decoded.userId}/${updateDoc.albumName}`;

                for (const file of req.files) {                    
                    await fileHandler.moveFile(file.path, `${userAlbumPath}/${file.filename}`);
                    const fileId = generateUniqueId(16, 'Album_');
                    updateDoc.files.push({
                        filename: file.originalname,
                        fileId: fileId,
                        filepath: `http://localhost:3000/api/${userAlbumPath}/${file.filename}`,
                        comments: [],
                    });
                }
                await mongodatabase.updateDocument('useralbum', query, updateDoc);
                return res.status(200).json({ message: 'Files Stored Successfully...' });
            } catch (error) {
                return res.status(400).json({ error: 'Failed to Store The Album files...' });
            }
        } else {
            return res.status(400).json({ error: 'Session Expired' });
        }
    });
});

userDashboardRoutes.post('/commentalbum', upload.none(), (req, res) => {
  jwt.verifyToken(req.body.token, (error, decoded) => {
    if (error === 1) {
      mongodatabase.commentOnAlbumPic(req.body.albumID, req.body.fileId, decoded.userId, req.body.comment)
        .then(response => {
          if (!response) {
            return res.status(200).json({ message: 'Comment added successfully.' });
          } else {
            return res.status(200).json({ message: response });
          }
        })
        .catch(() => {
          res.status(400).json({ error: 'Failed to Store The Album files...' });
        });
    } else {
      res.status(200).json({ message: 'Token Expired' });
    }
  });
});

userDashboardRoutes.post('/deleteFromAlbum', upload.none(), (req, res) => {
  jwt.verifyToken(req.body.token, async (error, decoded) => {
    if (error === 1) {
      mongodatabase.deletePicFromAlbum('useralbum', req.body.albumID, req.body.fileId)
        .then(() => {
          res.status(200).json({ message: 'File Deleted Successfully...' });
        })
        .catch(() => {
          res.status(400).json({ message: 'Failed to Delete File.' });
        });
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
        deleteDirectory(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
    fs.rmdirSync(directoryPath);
    callback(1);
  } else {
    callback(0);
  }
}

function renameDirectory(oldPath, newPath, callback) {
  if (fs.existsSync(oldPath)) {
    fs.rename(oldPath, newPath, (error) => {
        if (error !== null) {
            callback(false);
        } else {
            callback(true);
        }
    });
  } else {
    console.log("\n\n Gyana - 2 \n\n ********* " + oldPath);
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

function generateUniqueId(length, prefix) {
  const { v4: uuidv4 } = require('uuid');
  const uniqueId = uuidv4().replace(/-/g, '').slice(0, length);
  return prefix ? `${prefix}${uniqueId}` : uniqueId;
}

module.exports = userDashboardRoutes;
