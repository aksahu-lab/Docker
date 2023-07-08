//
//  tablecheck.js -> It will verify the my sql tables
//
//  Created by Gyan on 23/06/2023.
//

const database = require('../databasemanager/databasemanager');

function checkUserTablePresent(myCallback) {
    let checkUserTblExist = "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'mystudio' AND table_name = 'user');";
    database.connection.query(checkUserTblExist, (error, result, fields)=> {
        if(error) {
            creatUserTable(result => {
                myCallback(0);
            });
        } else {
            const tablePresent = result[0][Object.keys(result[0])[0]];
            if (tablePresent === 1) {
                myCallback(1);
            } else {
                creatUserTable(() => {
                    myCallback(1);
                });
            }
        }
    });
}

function creatUserTable(myCallback) {
    let createTablesqlQ = "CREATE TABLE `mystudio`.`user` ( `username` VARCHAR(25) NOT NULL, `userId` VARCHAR(20) NOT NULL UNIQUE, `createdDate` VARCHAR(25) NULL, `usertype` VARCHAR(20) NULL, `password` VARCHAR(15) NULL, `profileimage` VARCHAR(150) NULL, `firstname` VARCHAR(20) NULL, `lastname` VARCHAR(20) NULL, `gender` VARCHAR(10) NULL, `city` VARCHAR(30) NULL, PRIMARY KEY (`username`));"
    database.connection.query(createTablesqlQ, (error, result, fields)=> {
        myCallback(0);
        return;
    });
}

function checkUserAlbumTablePresent(myCallback) {
    let checkUserTblExist = "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE  table_schema = 'mystudio' AND    table_name = 'useralbum');";
    database.connection.query(checkUserTblExist, (error, result, fields)=> {
        if(error) {
            creatUserAlbumTable(() => {
                myCallback(0);
            });
        } else {
            const tablePresent = result[0][Object.keys(result[0])[0]];
            if (tablePresent === 1) {
                myCallback(1);
            } else {
                creatUserAlbumTable(result => {
                    myCallback(1);
                });
            }
        }
    });
}

function creatUserAlbumTable(myCallback) {
    let createTablesqlQ = "CREATE TABLE `mystudio`.`useralbum` (`userId` VARCHAR(45) NOT NULL, `albumId` VARCHAR(45) NOT NULL, `createdDate` VARCHAR(45) NULL, `eventDate` VARCHAR(45) NULL, `albumName` VARCHAR(45) NULL, `eventType` VARCHAR(150) NOT NULL, `albumpath` VARCHAR(150) NULL);";
    database.connection.query(createTablesqlQ, (error, result, fields)=> {
        myCallback(0);
    });
}


function checkUserFriendListTablePresent(myCallback) {
    let checkUserTblExist = "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE  table_schema = 'mystudio' AND    table_name = 'friendlist');";
    database.connection.query(checkUserTblExist, (error, result, fields)=> {
        if(error) {
            creatUserFriendListTable(() => {
                myCallback(0);
            });
        } else {
            const tablePresent = result[0][Object.keys(result[0])[0]];
            if (tablePresent === 1) {
                myCallback(1);
            } else {
                creatUserFriendListTable(result => {
                    myCallback(1);
                });
            }
        }
    });
}

function creatUserFriendListTable(myCallback) {
    let createTablesqlQ = "CREATE TABLE `mystudio`.`friendlist` (`userId` VARCHAR(45) NOT NULL, `currentDate` VARCHAR(45) NOT NULL, `friendId` VARCHAR(20) NOT NULL, `firstName` VARCHAR(45) NULL, `lastName` VARCHAR(45) NULL, `profileImage` VARCHAR(300) NULL, PRIMARY KEY (`userId`), UNIQUE INDEX `userId_UNIQUE` (`userId` ASC) VISIBLE);";
    database.connection.query(createTablesqlQ, (error, result, fields)=> {
        myCallback(0);
    });
}

module.exports = { 
                    checkUserTablePresent,
                    checkUserAlbumTablePresent,
                    checkUserFriendListTablePresent
                };