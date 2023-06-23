//
//  UserDashBoard ->
//
//  Created by Gyan on 23/06/2023.
//

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
            tableCheck.checkUserAlbumTablePresent(result => {
                if (result == 1) {   
                    const directoryPath = `./Media/Photo/${req.body.userId}/${req.body.albumName}`;
                    fs.mkdir(directoryPath, { recursive: true }, (err) => {
                        if (err) {
                            res.status(400).json({ error: 'Internal Server Error' });
                        } else {
                            var regSql = "INSERT INTO `mystudio`.`useralbum` (`userId`, `createdDate`, `eventDate`, `albumName`, `eventType`, `albumpath`) VALUES ?";
                            const generatedDate = getCurrentDate();                            
                            var value = [
                                [
                                    req.body.userId,
                                    generatedDate,
                                    req.body.eventDate,
                                    req.body.albumName,
                                    req.body.eventType,
                                    directoryPath
                                ]
                            ];
                            database.connection.query(regSql, [value], (error, result, fields)=> {
                                if(error) {                                
                                    if (error.code === 'ER_DUP_ENTRY') {
                                        res.status(409).json({ error: 'Duplicate entry' });
                                    } else {
                                        res.status(500).json({ error: 'Internal server error' });
                                    }
                                } else {
                                    console.log("\n\n" + JSON.stringify(result) + "\n\n");
                                    res.status(200).json({ message: 'Album Created successfully'});
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.status(200).json({ message: 'Token Expired'});
        }
    })
});
  
usrdashboardroutes.post('/deleteAlbum', multer.none(), (req, res) => {
    jwt.verifyToken(req.body.token , (error, decoded) => {
        if (error == 1) {
            const directoryPath = `./Media/Photo/${req.body.userId}/${req.body.albumName}`;
            deleteDirectory(directoryPath, result => {
                if (result == 1) {
                    const query = 'DELETE FROM `mystudio`.`useralbum` WHERE userId = ? AND albumName = ?';
                
                    database.connection.query(query, [req.body.userId, req.body.albumName], (error, result, fields)=> {
                        if(error) {                                
                            res.status(500).json({ error: 'Internal server error' });
                        } else {
                            console.log("\n\n" + JSON.stringify(result) + "\n\n");
                            res.status(200).json({ message: 'Album Deleted successfully'});
                        }
                    });
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

function getCurrentDate() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    return `${day}/${month}/${year}`;
}

module.exports = usrdashboardroutes;