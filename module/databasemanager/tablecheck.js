//
//  tablecheck.js -> It will verify the my sql tables
//
//  Created by Gyan on 23/06/2023.
//

const database = require('../databasemanager/databasemanager');

function checkUserTablePresent(myCallback) {
    let checkUserTblExist = "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE  table_schema = 'mystudio' AND    table_name = 'user');";
    database.connection.query(checkUserTblExist, (error, result, fields)=> {
        if(error) {
            creatUserTable(result => {
                myCallback(0);
                return;
            });
        } else {
            const tablePresent = JSON.stringify(result[0][Object.keys(result[0])[0]]);
            if (tablePresent == 1) {
                myCallback(1);
                return;
            } else {
                creatUserTable(result => {
                    myCallback(1);
                    return;
                });
            }
        }
    });
}

function creatUserTable(myCallback) {
    let createTablesqlQ = "CREATE TABLE `mystudio`.`user` (`mobilenumber` VARCHAR(45) NOT NULL, `userId` VARCHAR(45) NOT NULL, `email` VARCHAR(45) NULL, `createdDate` VARCHAR(45) NULL, `usertype` VARCHAR(45) NULL, `password` VARCHAR(150) NULL, `state` VARCHAR(45) NULL, `distict` VARCHAR(45) NULL, `profileimage` VARCHAR(500) NULL, PRIMARY KEY (`mobilenumber`));";
    database.connection.query(createTablesqlQ, (error, result, fields)=> {
        myCallback(0);
        return;
    });
}


function checkUserAlbumTablePresent(myCallback) {
    let checkUserTblExist = "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE  table_schema = 'mystudio' AND    table_name = 'useralbum');";
    database.connection.query(checkUserTblExist, (error, result, fields)=> {
        if(error) {
            creatUserAlbumTable(result => {
                myCallback(0);
                return;
            });
        } else {
            const tablePresent = JSON.stringify(result[0][Object.keys(result[0])[0]]);
            if (tablePresent == 1) {
                myCallback(1);
                return;
            } else {
                creatUserAlbumTable(result => {
                    myCallback(1);
                    return;
                });
            }
        }
    });
}

function creatUserAlbumTable(myCallback) {
    let createTablesqlQ = "CREATE TABLE `mystudio`.`useralbum` (`userId` VARCHAR(45) NOT NULL, `albumId` VARCHAR(45) NOT NULL, `createdDate` VARCHAR(45) NULL, `eventDate` VARCHAR(45) NULL, `albumName` VARCHAR(45) NULL, `eventType` VARCHAR(150) NOT NULL, `albumpath` VARCHAR(150) NULL);";
    database.connection.query(createTablesqlQ, (error, result, fields)=> {
        myCallback(0);
        return;
    });
}

module.exports = { 
                    checkUserTablePresent,
                    checkUserAlbumTablePresent
                };
