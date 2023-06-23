const onboardroutes = require('express').Router();
const multer = require('multer')();

const mediastorage = require('../multimediaupload/mediaupload');

function redirecttoactualrouter(req, res) {
    console.log(req.url);
    switch (req.url) {
        case '/register':
            console.log("Regristration");
            mediastorage.upload.single('image')(req, res, () => {
                const regroutes = require('./regristration/registeration');
                regroutes.registeruser(req, res);
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