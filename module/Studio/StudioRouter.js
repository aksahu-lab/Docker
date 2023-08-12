//
//  onboard.js -> routing helper for Loging and Regristration. 
//
//  Created by Gyan on 23/06/2023.
//

const studioOnboardRoutes = require('express').Router();
const multer = require('multer')();
const fs = require('fs');


/**
 * Redirects the request to the appropriate router based on the URL.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function redirectToActualRouter(req, res) {
    console.log(req.url);
    switch (req.url) {
      case '/register':
        console.log('Studio Registration');
        const albumPath = './Media/Studio/Profile/';
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
            uploadFunction(req, res, function (err) {
              if (err) {
                console.error('Error uploading file:', err);
                // Handle the error
              } else {
                // File uploaded successfully
                // Handle the success case
                const regroutes = require('./Registration/StudioRegistration');
                if (!req.file) {
                    console.log("\n\nGyana - 1\n\n");
                    regroutes.registerStudio(req, res, `./Assets/profile_placeholder.png`);
                } else {
                    console.log("\n\nGyana - 2\n\n");
                    regroutes.registerStudio(req, res, req.file.path);
                }
              }
            });
          }
        });
        break;
      case '/login':
        console.log('Login');
        multer.none()(req, res, () => {
          const loginRoutes = require('./Login/StudioLogin');
          loginRoutes.userLogin(req, res);
        });
        break;
      case '/forgotpassword':
        console.log('Forgot Password');
        multer.none()(req, res, () => {
          const loginRoutes = require('./Login/StudioLogin');
          loginRoutes.forgotPassword(req, res);
        });
        break;
      case '/resetpassword':
        console.log('Reset Password');
        multer.none()(req, res, () => {
          const loginRoutes = require('./Login/StudioLogin');
          loginRoutes.resetPassword(req, res);
        });
        break;
      case '/updateprofile':
        console.log('Update Profile');
        multer.none()(req, res, () => {
          const loginRoutes = require('./Login/StudioLogin');
          loginRoutes.updateProfile(req, res);
        });
        break;
      case '/getProfile':
        console.log('Get Profile');
        multer.none()(req, res, () => {
          const loginRoutes = require('./Login/StudioLogin');
          loginRoutes.getUserProfile(req, res);
        });
        break;
      case '/getAllClients':
        multer.none()(req, res, () => {
          const clientmanagerRoutes = require('./StudioDashBoard/Client/clientmanager');
          clientmanagerRoutes.getAllClients(req, res);
        });
        break;
      case '/getAlbumForClient':
        multer.none()(req, res, () => {
          const clientRoutes = require('./StudioDashBoard/Client/clientmanager');
          clientRoutes.getAlbumForClient(req, res);
        });
        break;
      case '/getAllphotos':
        multer.none()(req, res, () => {
          const clientRoutes = require('./StudioDashBoard/Client/clientmanager');
          clientRoutes.getAlbumForClient(req, res);
        });
        break;
    
      default:
      console.log('No API');
      break;
    }
}

module.exports = studioOnboardRoutes;
module.exports = { redirectToActualRouter };
