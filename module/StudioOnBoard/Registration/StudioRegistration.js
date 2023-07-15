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
  tableCheck.checkStudioTablePresent((result) => {
    if (result === 1) {
      const sql = 'SELECT COUNT(*) AS total FROM studio';
      database.connection.query(sql, (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
          return;
        }
        const currentDate = new Date();
        let tableName = "studio";
        let insertQuery = `
          INSERT INTO \`${tableName}\`
          (
            \`studioName\`,
            \`studioId\`,
            \`createdDate\`,
            \`usertype\`,
            \`password\`,
            \`contactFirstname\`,
            \`contactLastname\`,
            \`contactnumber\`,
            \`gender\`,
            \`city\`,
            \`pinCode\`,
            \`street\`,
            \`landMark\`,
            \`latitude\`,
            \`longnitute\`,
            \`businessWPNumber\`,
            \`aboutStudio\`,
            \`establishedon\`,
            \`profilepic\`,
            \`coverpic\`,
            \`travelpolicy\`,
            \`cancelpolicy\`,
            \`paymentpolicy\`,
            \`studiowebsite\`,
            \`studiofbpage\`,
            \`studiotweeterpage\`
          )
          VALUES ?;
        `;

        const studioId = uuidv4().replace(/-/g, '').slice(0, 16);

        const values = [
          [
            req.body.studioName,
            studioId,
            currentDate,
            req.body.userType,
            req.body.password,
            req.body.contactFirstname,
            req.body.contactLastname,
            req.body.contactNumber,
            req.body.gender,
            req.body.city,
            req.body.pinCode,
            req.body.street,
            req.body.landMark,
            req.body.latitude,
            req.body.longitude,
            req.body.businessWPNumber,
            req.body.aboutStudio,
            req.body.establishedOn,
            "",
            "",
            req.body.travelPolicy,
            req.body.cancelPolicy,
            req.body.paymentPolicy,
            req.body.studioWebsite,
            req.body.studioFBPage,
            req.body.studioTwitterPage,
          ],
        ];

        database.connection.query(insertQuery, [values], (error, result, fields) => {
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
