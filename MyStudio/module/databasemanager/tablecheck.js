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
    let createTablesqlQ = "CREATE TABLE `mystudio`.`user` (`mobilenumber` VARCHAR(45) NOT NULL, `userId` VARCHAR(45) NOT NULL, `email` VARCHAR(45) NULL, `createdDat` VARCHAR(45) NULL, `usertype` VARCHAR(45) NULL, `password` VARCHAR(150) NULL, `state` VARCHAR(45) NULL, `distict` VARCHAR(45) NULL, `profileimage` VARCHAR(500) NULL, PRIMARY KEY (`mobilenumber`));";
    database.connection.query(createTablesqlQ, (error, result, fields)=> {
        myCallback(0);
        return;
    });
}

module.exports = { 
                    checkUserTablePresent
                };
