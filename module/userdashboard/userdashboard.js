const usrdashboardroutes = require('express').Router();
const multer = require('multer')();
const fs = require('fs');

const jwt = require('../security/jwt/jwtmanager');
const database = require('../databasemanager/databasemanager');
const tableCheck = require('../databasemanager/tablecheck');
const { decode } = require('jsonwebtoken');


usrdashboardroutes.post('/createAlbum', multer.none(), (req, res) => {
    jwt.verifyToken(req.body.token , (error, decoded) => {
        if (error == 1) {
            const directoryPath = `./Media/Photo/${decoded.mobilenumber}/${req.body.albumName}`;
            fs.mkdir(directoryPath, { recursive: true }, (err) => {
                if (err) {
                    res.status(200).json({ error: 'Internal Server Error' });
                } else {
                    res.status(200).json({ message: 'Album Created successfully'});
                }
            });
        }
    })
});

usrdashboardroutes.post('/deleteAlbum', multer.none(), (req, res) => {
    jwt.verifyToken(req.body.token , (error, decoded) => {
        if (error == 1) {
            const directoryPath = `./Media/Photo/${decoded.mobilenumber}/${req.body.albumName}`;
            deleteDirectory(directoryPath, result => {
                if (result == 1) {
                    res.status(200).json({ message: 'Album Deleted successfully'});
                } else {
                    res.status(200).json({ error: 'Please choose a Album to Delete' });
                }
            });
        }
    })
});

function deleteDirectory(directoryPath, callback) {
    console.log(directoryPath);
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
      console.log('Directory deleted successfully');
      callback(1);
    } else {
      console.log('Directory does not exist');
      callback(0);
    }
  }

module.exports = usrdashboardroutes;