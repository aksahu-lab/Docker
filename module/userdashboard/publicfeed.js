//
//  PublicFeed.js ->
//
//  Created by Gyan on 23/06/2023.
//

const publicfeedrote = require('express').Router();
const multer = require('multer')();
const database = require('../databasemanager/databasemanager');

const fs = require('fs');

const jwt = require('../security/jwt/jwtmanager');
const mongodatabase = require('../databasemanager/mongodbmanager');

const albumPath = `./Media/`;

const FileUtility = require('../multimediaupload/mediaupload');
const fileUtility = new FileUtility(albumPath);

publicfeedrote.post('/postfeed', fileUtility.uploadMultipleFiles(`files`, 5), (req, res) => {
    jwt.verifyToken(req.body.token , (error, decoded) => {
        if (error == 1) {
            mongodatabase.collectionDataCount("publicfeeds")
            .then(count => {
                const feedId = `Mystudio_${count}_` + decoded.userId;
                const albumPath = `Media/publicfeeds/${feedId}/`;
                fs.mkdir(albumPath, { recursive: true }, (err) => {
                    if (err) {
                        res.status(400).json({ error: 'Internal Server Error' });
                    } else {
                        const FileHandler = require('../multimediaupload/FileHandler');
                        const fileHandler = new FileHandler();
                        var updateDoc = [];
                        const generatedDate = getCurrentDate();  
                        updateDoc = { 
                            userId: decoded.userId, 
                            feedId: feedId, 
                            generatedDate: generatedDate,
                            albumPath: albumPath,
                            description: req.body.description,
                            posttype: req.body.posttype,
                            feeling: req.body.feeling,
                            tagedpeople: req.body.tagedpeople,
                            files: [],
                            likes: [],
                            comments: []
                        };
                        req.files.forEach((file) => {
                            // Move a file
                            fileHandler.moveFile(`${file.path}`, `${albumPath}${file.filename}`);
                            const { v4: uuidv4 } = require('uuid');
                            const userId = uuidv4().replace(/-/g, '').slice(0, 16);   
                            updateDoc.files.push({
                                filename: file.originalname,
                                fileId: "PF_" + userId,
                                filepath: "http://localhost:3000/api/" + `${albumPath}${file.filename}`
                            });
                        });
                        mongodatabase.insertDocument("publicfeeds", updateDoc)
                        .then(documents => {
                            // File upload completed successfully
                            return res.status(200).json({ message: 'Files Stored Successfull...' });
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(400).json({ error: 'Failed to Store The Album files...' });
                        });
                    }
                });
            })
            .catch((error) => {
                res.status(400).json({ message: 'Failed to Delete Album.'});
            });

        } else {
            res.status(200).json({ message: 'Token Expired'});
        }
    })
});

publicfeedrote.post('/updatefeed', fileUtility.uploadMultipleFiles(`files`, 5), (req, res) => {
    jwt.verifyToken(req.body.token , (error, decoded) => {
        if (error == 1) {
            console.log("\n\nUpdate Post : " + JSON.stringify(req.body) + "\n\n");
            const FileHandler = require('../multimediaupload/FileHandler');
            const fileHandler = new FileHandler();

            var updateDoc = { 
                userId: decoded.userId, 
                feedId: req.body.feedId, 
                albumPath: req.body.albumPath,
                description: req.body.description,
                posttype: req.body.posttype,
            };

            req.files.forEach((file) => {
                // Move a file
                fileHandler.moveFile(`${file.path}`, `${albumPath}/${file.filename}`);
                updateDoc.files.push({
                    filename: file.originalname,
                    filepath: "http://localhost:3000/api/" + `${albumPath}/${file.filename}`
                });
            });
            const query = { userId: decoded.userId, feedId: req.body.feedId };

            mongodatabase.updateDocument("publicfeeds", query, updateDoc)
            .then(documents => {
                // File upload completed successfully
                return res.status(200).json({ message: 'Files Stored Successfull...' });
            })
            .catch(error => {
                console.log(error);
                res.status(400).json({ error: 'Failed to Store The Album files...' });
            });
        } else {
            res.status(200).json({ message: 'Token Expired'});
        }
    })
});

publicfeedrote.post('/deleteFeed', fileUtility.uploadMultipleFiles(`files`, 5), (req, res) => {
    jwt.verifyToken(req.body.token , (error, decoded) => {
        if (error == 1) {
            const FileHandler = require('../multimediaupload/FileHandler');
            const fileHandler = new FileHandler();
            var updateDoc = [];
            fileHandler.deleteDirectory(req.body.albumPath, res);
            const query = { userId: decoded.userId, feedId: req.body.feedId };
            mongodatabase.deleteDocument("publicfeeds", query)
            .then((result) => {
                res.status(200).json({ message: 'Album Deleted Successfully.'});
            })
            .catch((error) => {
                if (!res.headersSent) {
                    console.error('Failed to delete directory:', err);
                    res.status(500).json({ error: 'Failed to delete directory' });
                }
            });
        } else {
            res.status(200).json({ message: 'Token Expired'});
        }
    })
});


publicfeedrote.post('/likeFeed', multer.none(), (req, res) => {
    jwt.verifyToken(req.body.token , (error, decoded) => {
        if (error == 1) {
            mongodatabase.likeUnlikeComment(req.body.feedId, decoded.userId, req.body.like)
            .then(response => {
                // File upload completed successfully
                return res.status(200).json({ message: response});
            })
            .catch(error => {
                console.log(error);
                res.status(400).json({ error: 'Failed to Store The Album files...' });
            });
        } else {
            res.status(200).json({ message: 'Token Expired'});
        }
    })
});

publicfeedrote.post('/commentFeed', multer.none(), (req, res) => {
    jwt.verifyToken(req.body.token , (error, decoded) => {
        if (error == 1) {
            
            mongodatabase.commentOnFeed(req.body.feedId, decoded.userId, req.body.comment)
            .then(response => {
                // File upload completed successfully
                return res.status(200).json({ message: response});
            })
            .catch(error => {
                console.log(error);
                res.status(400).json({ error: 'Failed to Store The Album files...' });
            });
            
        } else {
            res.status(200).json({ message: 'Token Expired'});
        }
    })
});


publicfeedrote.post('/searchUser', multer.none(), (req, res) => {
    jwt.verifyToken(req.body.token , (error, decoded) => {
        if (error == 1) {
            // Example usage
            searchByNameCharacters(req.body.user, (error, results) => {
                if (error) {
                    res.status(200).json({ message: "No User found"});
                }
                res.status(200).json(results);
            });
        } else {
            res.status(200).json({ message: 'Token Expired'});
        }
    })
});

// Function to search for characters in first name or last name
function searchByNameCharacters(searchTerm, callback) {
    const query = "SELECT * FROM `mystudio`.`user` WHERE `firstname` LIKE '" + searchTerm + "%' OR `lastname` LIKE '" + searchTerm + "%'";
    database.connection.query(query, (error, results) => {
        var userList = [];
        if (error) {
            callback(error, null);
            return;
        }
        results.forEach((file) => {
            userList.push({
                username : file.username,
                userId : file.userId,
                city : file.city,
                profileimage: "http://localhost:3000/api/" + file.profileimage,
                firstname: file.firstname,
                lastname: file.lastname,
                gender: file.gender
            });
        });
        
        callback(null, userList);
    });
}

  
function getCurrentDate() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    return `${day}/${month}/${year}`;
}

module.exports = publicfeedrote;