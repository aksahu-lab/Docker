const onboardroutes = require('express').Router();
const multer = require('multer')();

const mediastorage = require('../multimediaupload/mediaupload');

function redirecttoactualrouter(req, res) {
    console.log(req.url);
    switch (req.url) {
        case '/regristration':
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
        default:
            console.log("No API");
    }
}

module.exports = onboardroutes;
module.exports = {redirecttoactualrouter};