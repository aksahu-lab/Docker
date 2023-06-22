const loginroutes = require('express').Router();
const multer = require('multer')();
const fs = require('fs');

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

loginroutes.post('/profileimage', multer.none(), (req, res) => {
    jwt.verifyToken(req.body.token, response => {
        if (response == 1) {
            const { imagePath } = req.body;        
            // Check if the file exists
            if (fs.existsSync(`/Users/hritvik/Documents/My_Projects/MyStudio/${imagePath}`)) {
                // Set the appropriate headers for the response
                res.setHeader('Content-Type', 'image/jpeg');
                res.setHeader('Content-Disposition', 'attachment; filename=image.jpg');
            
                // Read the file and send it as the response
                fs.createReadStream(`/Users/hritvik/Documents/My_Projects/MyStudio/${imagePath}`).pipe(res);
            } else {
                console.log("********* Profile Image ********* " + `/Users/hritvik/Documents/My_Projects/MyStudio/${imagePath}`);
                res.status(404).send('Image not found');
            }
        }
    });
});


module.exports = loginroutes;
module.exports = {userlogin};