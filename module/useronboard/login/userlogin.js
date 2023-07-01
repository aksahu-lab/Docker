//
//  Login ->
//      1. userlogin
//      2. resetpassword
//      3. updateprofile
//      4. getuserprofile
//
//  Created by Gyan on 23/06/2023.
//

const loginroutes = require('express').Router();

const jwt = require('../../security/jwt/jwtmanager');
const database = require('../../databasemanager/databasemanager');
const tableCheck = require('../../databasemanager/tablecheck');

/*
-* This function is used to Login the user.
    The below points need to consider while change the function
    -> First we need to check wether the user table is present or not.
    -> If present find the User using the primary key :(In current implementation Mobile Number is the primary key)
    -> match the password then send the user details as response.
*/
function userlogin(req, res) {
    tableCheck.checkUserTablePresent(resp => {
        if (resp == 1) {
            database.connection.query("select * from `mystudio`.`user` where username = " + `${req.body.username}`, (error, result, fields)=> {
                if(error){
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    const count = result.length;
                    if (count < 1) {
                        res.status(200).json({ error: 'User not found' });
                        return;
                    }
                    if (result[0].password ==  req.body.password) {
                        var jwttoken;
                        jwt.generateToken(result[0], response => {
                            jwttoken = response;
                        });
                       
                        var response = {
                            token : jwttoken,
                            username : result[0].username,
                            userId : result[0].userId,
                            city : result[0].city,
                            profileimage: "http://localhost:3000/api/" + result[0].profileimage,
                            firstname: result[0].firstname,
                            lastname: result[0].lastname,
                            gender: result[0].gender
                        };
                        res.status(200).json(response);
                    } else {
                        res.status(200).json({ error: 'Please Enter a correct password.'});
                    }
                }
            });
        } else {
            res.status(200).json({ error: 'You have not registered, please register first.' });
        }
    });
};

/*
-* This function is used to Reset the user password.
    The below points need to consider while change the function
    -> First we need to verify the jwt token.
    -> Get the user details based on mobile number.
    -> match the password then update the password for the same user.
*/
function resetpassword(req, res) {
    jwt.verifyToken(req.body.token , (error, decoded) => {
        if (error == 1) {           
            const selectQuery = "SELECT * FROM `mystudio`.`user` WHERE `userId` = '" + decoded.userId + "'";
 
            database.connection.query(selectQuery, (error, result, fields)=> {
                if(error){
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    const count = result.length;
                    if (count < 1) {
                        res.status(200).json({ error: 'User not found' });
                        return;
                    }
                    if (result[0].password == decoded.password) {  
                        const query = 'UPDATE `mystudio`.`user` SET `password` = ? WHERE (`userId` = ?)';
                        database.connection.query(query, [req.body.newpassword, decoded.userId], (error, results) => {
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

/*
-* This function is used to Update Profile.
    The below points need to consider 
*/
function updateprofile(req, res) {
    jwt.verifyToken(req.body.token, (error, decoded) => {
        if (error == 1) {     
            const selectQuery = "SELECT * FROM `mystudio`.`user` WHERE `userId` = '" + decoded.userId + "'";
            database.connection.query(selectQuery, (error, result, fields)=> {
                if(error) {
                    console.log(error);
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    const count = result.length;
                    if (count < 1) {
                        res.status(200).json({ error: 'User not found' });
                        return;
                    }
                    if (result[0].password == decoded.password) {  

                        const u_query = 'UPDATE `mystudio`.`user` SET `firstname` = ?, `lastname` = ?, `gender` = ?, `city` = ? WHERE (`userId` = ?)';
                        const values = [req.body.firstname, req.body.lastname, req.body.gender, req.body.city, decoded.userId];

                        database.connection.query(u_query, values, (error, results) => {
                            if (error) {
                                console.error('Error updating Profile: ' + error.stack);
                                return;
                            }
                            console.log('Profile updated successfully.');
                            res.status(200).json({ message: 'Profile updated successfully.' });
                        });
                    }
                }
            });
        } else {
            res.status(200).json({ message: 'Token Expired'});
        }
    });
};

/*
-* This function is used to Get the user Profile.
*/
function getuserprofile(req, res) {
    jwt.verifyToken(req.body.token, (error, decoded)  => {
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
                    result[0].profileimage = "http://localhost:3000/api/" + result[0].profileimage;
                    res.status(200).json(result[0]);
                }
            });
        } else {
            res.status(200).json({ message: 'Token Expired'});
        }
    });
};


module.exports = loginroutes;
module.exports = {
                    userlogin,
                    resetpassword,
                    updateprofile,
                    getuserprofile
                };