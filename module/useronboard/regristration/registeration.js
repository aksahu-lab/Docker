//
//  regristration.js
//
//  Created by Gyan on 23/06/2023.
//

const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const database = require('../../databasemanager/databasemanager');
const tableCheck = require('../../databasemanager/tablecheck');

const regroutes = express.Router();

/**
 * Registers a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} path - The path of the profile image.
 */
function registerUser(req, res, path) {
  tableCheck.checkUserTablePresent((result) => {
    if (result === 1) {
      const sql = 'SELECT COUNT(*) AS total FROM user';

      database.connection.query(sql, (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
          return;
        }

        const userId = uuidv4().replace(/-/g, '').slice(0, 16);
        const currentDate = new Date();
        const regSql =
          'INSERT INTO `mystudio`.`user` (`username`, `userId`, `createdDate`, `usertype`, `password`, `profileimage`, `firstname`, `lastname`, `gender`, `city`) VALUES ?';

        const values = [
          [
            req.body.username,
            userId,
            currentDate,
            req.body.usertype,
            req.body.password,
            path,
            req.body.firstname,
            req.body.lastname,
            req.body.gender,
            req.body.city,
          ],
        ];

        database.connection.query(regSql, [values], (error, result, fields) => {
          if (error) {
            deleteFile(path, (response) => {
              console.log('File Deleted Successfully: ' + response);
            });
            console.log(error);
            if (error.code === 'ER_DUP_ENTRY') {
              res.status(409).json({ error: 'Duplicate entry' });
            } else {
              res.status(500).json({ error: 'Internal server error' });
            }
          } else {
            console.log('\n\n' + JSON.stringify(result) + '\n\n');
            res.status(200).json({ message: 'You have registered successfully.' });
          }
        });
      });
    } else {
      res.status(404).json({ error: 'Internal Server Error.' });
    }
  });
}

/**
 * Deletes a file.
 * @param {string} file - The path of the file to delete.
 * @param {function} callback - The callback function.
 */
function deleteFile(file, callback) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    callback(1);
  } else {
    callback(0);
  }
}

module.exports = regroutes;
module.exports = { registerUser };
