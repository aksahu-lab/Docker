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
    console.log("Creat User Table");
    let createTablesqlQ = "CREATE TABLE `mystudio`.`user` ( `username` VARCHAR(25) NOT NULL, `userId` VARCHAR(20) NOT NULL, `createdDate` VARCHAR(25) NULL, `usertype` VARCHAR(20) NULL, `password` VARCHAR(15) NULL, `profileimage` VARCHAR(150) NULL, `firstname` VARCHAR(20) NULL, `lastname` VARCHAR(20) NULL, `gender` VARCHAR(10) NULL, `city` VARCHAR(30) NULL, PRIMARY KEY (`username`));"
    database.connection.query(createTablesqlQ, (error, result, fields)=> {
        console.log(error);
        console.log(result);

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
