//
//  onboard.js -> routing helper for Loging and Regristration. 
//
//  Created by Gyan on 23/06/2023.
//

const onboardroutes = require('express').Router();
const multer = require('multer')();
const fs = require('fs');

function redirecttoactualrouter(req, res) {
    console.log(req.url);
    switch (req.url) {
        case '/register':
            console.log("Regristration");
                const albumPath = `./Media/Profile/`;
                fs.mkdir(albumPath, { recursive: true }, (err) => {
                    if (err) {
                        res.status(400).json({ error: 'Internal Server Error' });
                    } else {
                        const FileUtility = require('../multimediaupload/mediaupload');

                        const fileUtil = new FileUtility(albumPath);
                        const fieldName = 'file'; // The name of the field in the form data
            
                        // Call uploadSingleFile as a function
                        const uploadFunction = fileUtil.uploadSingleFile(fieldName);
            
                        // Call the upload function by passing the request object
                        uploadFunction(req, res, function(err) {
                            if (err) {
                                console.error('Error uploading file:', err);
                                // Handle the error
                            } else {
                                // File uploaded successfully
                                // Handle the success case
                                console.log("\n\n--------------------------------------------------------\n\n");
                                const regroutes = require('./regristration/registeration');
                                regroutes.registeruser(req, res, '../../Media');
                            }
                        });
                    }
                });
            break;
        case '/login':
            console.log("login");
            multer.none()(req, res, () => {
                const loginroutes = require('./login/userlogin');
                loginroutes.userlogin(req, res);
            });
            break;
        case '/forgotpassword':
            console.log("forgotpassword");
            multer.none()(req, res, () => {
                const loginroutes = require('./login/userlogin');
                loginroutes.userlogin(req, res);
            });
            break;
        case '/resetpassword':
            console.log("resetpassword");
            multer.none()(req, res, () => {
                const loginroutes = require('./login/userlogin');
                loginroutes.resetpassword(req, res);
            });
            break;
        case '/updateprofile':
            console.log("updateprofile");
            multer.none()(req, res, () => {
                const loginroutes = require('./login/userlogin');
                loginroutes.updateprofile(req, res);
            });
            break;
        case '/getProfile':
            console.log("Get Profile");
            multer.none()(req, res, () => {
                const loginroutes = require('./login/userlogin');
                loginroutes.getuserprofile(req, res);
            });
            break;
        default:
            console.log("No API");
    }
}

module.exports = onboardroutes;
module.exports = {redirecttoactualrouter};