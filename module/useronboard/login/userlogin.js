const loginroutes = require('express').Router();

const jwt = require('../../security/jwt/jwtmanager');
const database = require('../../databasemanager/databasemanager');
const tableCheck = require('../../databasemanager/tablecheck');


function userlogin(req, res) {
    tableCheck.checkUserTablePresent(resp => {
        if (resp == 1) {
            database.connection.query("select * from `mystudio`.`user` where mobilenumber = " + `${req.body.mobilenumber}`, (error, result, fields)=> {
                if(error){
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    const count = result.length;
                    if (count < 1) {
                        res.status(200).json({ error: 'User not found' });
                        return;
                    }
                    if (result[0].mobilenumber ==  req.body.mobilenumber) {
                        var jwttoken;
                        jwt.generateToken(result[0], response => {
                            jwttoken = response;
                        });
                       
                        var response = {
                            token : jwttoken,
                            mobilenumber : result[0].mobilenumber,
                            userId : result[0].userId,
                            email : result[0].email,
                            state : result[0].state,
                            distict : result[0].distict,
                            profileimage: "http://localhost:3000/api/" + result[0].profileimage
                        };
                        res.status(200).json(response);
                    } else {

                        res.status(200).json({ error: 'You have not registered, please register first.'});
                    }
                }
            });
        } else {
            res.status(200).json({ error: 'You have not registered, please register first.' });
        }
    });
};

function resetpassword(req, res) {
    jwt.verifyToken(req.body.token , (error, decoded) => {
        if (error == 1) {            
            database.connection.query("select * from `mystudio`.`user` where mobilenumber = " + `${decoded.mobilenumber}`, (error, result, fields)=> {
                if(error){
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    const count = result.length;
                    if (count < 1) {
                        res.status(200).json({ error: 'User not found' });
                        return;
                    }
                    if (result[0].password == req.body.currentpassword) {  
                        const query = 'UPDATE `mystudio`.`user` SET `password` = ? WHERE (`mobilenumber` = ?)';
                        database.connection.query(query, [req.body.newpassword, decoded.mobilenumber], (error, results) => {
                            if (error) {
                                console.error('Error updating password: ' + error.stack);
                                return;
                            }
                            console.log('Password updated successfully.');
                            res.status(200).json({ message: 'Password updated successfully.' });
                        });
                    }
                }
            });
        } else {
            res.status(200).json({ message: 'Token Expired'});
        }
    });
};

function updateprofile(req, res) {
    jwt.verifyToken(req.body.token, response => {
        res.status(200).json({ message: 'Token Verified successfully -> update profile' });
    });
};

function getuserprofile(req, res) {
    jwt.verifyToken(req.body.token, response => {
        console.log("\n\n********Get profile*******\n\n");
        res.status(200).json({ message: 'Token Verified successfully -> Get profile' });
    });
};

module.exports = loginroutes;
module.exports = {
                    userlogin,
                    resetpassword,
                    updateprofile,
                    getuserprofile
                };