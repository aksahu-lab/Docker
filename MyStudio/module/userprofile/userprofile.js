const profileroutes = require('express').Router();
const multer = require('multer')();
const jwt = require('../security/jwt/jwtmanager');

profileroutes.post('/updateProfile', multer.none(), (req, res) => {
    jwt.verifyToken(req.body.token, response => {


        res.status(200).json({ message: 'Token Verified successfully' });
    });
});

profileroutes.post('/getProfile', multer.none(), (req, res) => {
    jwt.verifyToken(req.body.token, response => {

        console.log("\n\n********Get profile*******\n\n");

        res.status(200).json({ message: 'Token Verified successfully' });
    });
});

module.exports = profileroutes;