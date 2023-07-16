//
//  tablecheck.js -> It will verify the my sql tables
//
//  Created by Gyan on 23/06/2023.
//

const database = require('../databasemanager/databasemanager');

//////****************** Client ******************/
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
    let checkUserTblExist = "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE  table_schema = 'mystudio' AND  table_name = 'friendlist');";
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
    console.log("Table creating *************");
    let createTablesqlQ = "CREATE TABLE `mystudio`.`friendlist` (`userId` VARCHAR(45) NOT NULL, `currentDate` VARCHAR(45) NOT NULL, `friendId` VARCHAR(20) NOT NULL, `firstName` VARCHAR(45) NULL, `lastName` VARCHAR(45) NULL, `profileImage` VARCHAR(300) NULL, `status` INT NULL, PRIMARY KEY (`userId`));";
    database.connection.query(createTablesqlQ, (error, result, fields)=> {
        myCallback(0);
    });
}

/////******************** END **********************/



function checkStudioTablePresent(myCallback) {
    let checkUserTblExist = "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'mystudio' AND table_name = 'studio');";
    database.connection.query(checkUserTblExist, (error, result, fields)=> {
        if(error) {
            creatStudioTable(result => {
                myCallback(0);
            });
        } else {
            const tablePresent = result[0][Object.keys(result[0])[0]];
            if (tablePresent === 1) {
                myCallback(1);
            } else {
                creatStudioTable(() => {
                    myCallback(1);
                });
            }
        }
    });
}


function creatStudioTable(myCallback) {
    let createTablesqlQ = `
    CREATE TABLE \`mystudio\`.\`studio\` (
      \`studioName\` VARCHAR(50) NOT NULL UNIQUE,
      \`emailOrContact\` VARCHAR(30) NOT NULL UNIQUE,
      \`studioId\` VARCHAR(20) NOT NULL UNIQUE,
      \`createdDate\` VARCHAR(25) NULL,
      \`usertype\` VARCHAR(20) NULL,
      \`password\` VARCHAR(15) NULL,
      \`contactFirstname\` VARCHAR(20) NULL,
      \`contactLastname\` VARCHAR(15) NULL,
      \`contactnumber\` VARCHAR(15) NULL,
      \`gender\` VARCHAR(10) NULL,
      \`city\` VARCHAR(30) NULL,
      \`pinCode\` VARCHAR(20) NULL,
      \`street\` VARCHAR(30) NULL,
      \`landMark\` VARCHAR(50) NULL,
      \`latitude\` VARCHAR(30) NULL,
      \`longnitute\` VARCHAR(30) NULL,
      \`businessWPNumber\` VARCHAR(15) NULL,
      \`aboutStudio\` VARCHAR(500) NULL,
      \`establishedon\` VARCHAR(30) NULL,
      \`profilepic\` VARCHAR(200) NULL,
      \`coverpic\` VARCHAR(200) NULL,
      \`travelpolicy\` VARCHAR(200) NULL,
      \`cancelpolicy\` VARCHAR(200) NULL,
      \`paymentpolicy\` VARCHAR(200) NULL,
      \`studiowebsite\` VARCHAR(100) NULL,
      \`studiofbpage\` VARCHAR(200) NULL,
      \`studiotweeterpage\` VARCHAR(200) NULL,
      PRIMARY KEY (\`studioId\`)
    );
  `;
      
    database.connection.query(createTablesqlQ, (error, result, fields)=> {
        myCallback(0);
        return;
    });
}


module.exports = { 
                    checkUserTablePresent,
                    checkUserAlbumTablePresent,
                    checkUserFriendListTablePresent,
                    checkStudioTablePresent
                };