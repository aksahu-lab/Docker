//
//  regristration.js
//
//  Created by Gyan on 23/06/2023.
//

const regroutes = require('express').Router();
const fs = require('fs');

const database = require('../../databasemanager/databasemanager');
const tableCheck = require('../../databasemanager/tablecheck');


function registeruser(req, res, path) {
    tableCheck.checkUserTablePresent(result => {
        if (result == 1) {   
            // const sql = `SELECT COUNT(*) AS mystudio FROM user`;
            const sql = `SELECT COUNT(*) AS total FROM user`;

            // Execute the query to get the user count
            database.connection.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                const userCount = results[0].total;

                const { v4: uuidv4 } = require('uuid');
                const userId = uuidv4().replace(/-/g, userCount + 1).substr(0, 16);
                console.log(userId);
                
                // const userId = 'USER_' + (userCount + 1).toString().padStart(7, '0');
                const currentDate = new Date();

                var regSql = "INSERT INTO `mystudio`.`user` (`username`, `userId`, `createdDate`, `usertype`, `password`, `profileimage`, `firstname`, `lastname`, `gender`, `city`) VALUES ?";
                var value = [
                    [
                        req.body.username,
                        userId,
                        currentDate,
                        "General",
                        req.body.password,
                        path,
                        req.body.firstname, 
                        req.body.lastname,
                        req.body.gender, 
                        req.body.city
                    ]
                ];
                database.connection.query(regSql, [value], (error, result, fields)=> {
                    if(error) {
                        deleteFile(req.file.path, response => {
                            console.log("File Deleted Sucessfully " + response);
                        });
                        console.log(error);
                        if (error.code === 'ER_DUP_ENTRY') {
                            res.status(409).json({ error: 'Duplicate entry' });
                        } else {
                            res.status(500).json({ error: 'Internal server error' });
                        }
                    } else {
                        console.log("\n\n" + JSON.stringify(result) + "\n\n");
                        res.status(200).json({ message: 'You have registered successfully.' });
                    }
                });
            });
        } else {
            res.status(200).json({ error: 'You have not registered, please register first.' });
        }
    });
};

function deleteFile(file, callback) {
    // Check if the file exists
    if (fs.existsSync(file)) {
      // Delete the file
      fs.unlinkSync(file);
      callback(1);
    } else {
      callback(0);
    }
}

module.exports = regroutes;
module.exports = { registeruser }