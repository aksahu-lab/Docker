//
//  Login ->
//      1. userlogin
//      2. resetpassword
//      3. updateprofile
//      4. getuserprofile
//
//  Created by Gyan on 23/06/2023.
//

const loginRoutes = require('express').Router();

const jwt = require('../../security/jwt/jwtmanager');
const database = require('../../databasemanager/databasemanager');
const tableCheck = require('../../databasemanager/tablecheck');

/**
 * Handles the login request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function userLogin(req, res) {
  tableCheck.checkUserTablePresent((resp) => {
    if (resp === 1) {
      const { username, password } = req.body;
      const query = 'SELECT * FROM `mystudio`.`user` WHERE username = ?';
      database.connection.query(query, [username], (error, result, fields) => {
        if (error) {
          res.status(500).json({ error: 'Internal server error' });
        } else {
          if (result.length < 1) {
            res.status(400).json({ error: 'User not found' });
          } else {
            const user = result[0];
            if (user.password === password) {
              jwt.generateToken(user, (token) => {
                const response = {
                  token: token,
                  username: user.username,
                  userId: user.userId,
                  city: user.city,
                  profileimage: `http://localhost:8080/api/${user.profileimage}`,
                  firstname: user.firstname,
                  lastname: user.lastname,
                  gender: user.gender,
                };
                res.status(200).json(response);
              });
            } else {
              res.status(200).json({ error: 'Please enter the correct password.' });
            }
          }
        }
      });
    } else {
      res.status(200).json({ error: 'You have not registered, please register first.' });
    }
  });
}

/**
 * Handles the reset password request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function resetPassword(req, res) {
  jwt.verifyToken(req.body.token, (error, decoded) => {
    if (error === 1) {
      const userId = decoded.userId;
      const newPassword = req.body.newpassword;
      const selectQuery = 'SELECT * FROM `mystudio`.`user` WHERE `userId` = ?';
      database.connection.query(selectQuery, [userId], (error, result, fields) => {
        if (error) {
          res.status(500).json({ error: 'Internal server error' });
        } else {
          if (result.length < 1) {
            res.status(200).json({ error: 'User not found' });
          } else {
            const user = result[0];
            if (user.password === decoded.password) {
              const query = 'UPDATE `mystudio`.`user` SET `password` = ? WHERE (`userId` = ?)';
              database.connection.query(query, [newPassword, userId], (error, results) => {
                if (error) {
                  res.status(500).json({ error: 'Internal server error' });
                }
                console.log('Password updated successfully.');
                res.status(200).json({ message: 'Password updated successfully.' });
              });
            }
          }
        }
      });
    } else {
      res.status(200).json({ message: 'Token Expired' });
    }
  });
}

/**
 * Handles the get user profile request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function getUserProfile(req, res) {
  jwt.verifyToken(req.body.token, (error, decoded) => {
    if (error === 1) {
      const userId = decoded.userId;
      const query = 'SELECT * FROM `mystudio`.`user` WHERE userId = ?';
      database.connection.query(query, [userId], (error, result, fields) => {
        if (error) {
          console.error('Error getting user profile:', error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          if (result.length < 1) {
            res.status(200).json({ error: 'User not found' });
          } else {
            const user = result[0];
            user.profileimage = `http://localhost:3000/api/${user.profileimage}`;
            res.status(200).json(user);
          }
        }
      });
    } else {
      res.status(200).json({ message: 'Token Expired' });
    }
  });
}

/**
 * Handles the forgot password request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function forgotPassword(req, res) {
  const username = req.body.username;

  const query = 'SELECT * FROM `mystudio`.`user` WHERE username = ?';
  database.connection.query(query, [username], (error, result, fields) => {
    if (error) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (result.length < 1) {
        res.status(200).json({ error: 'User not found' });
      } else {
        const user = result[0];

        res.status(200).json({ message: 'Password reset instructions sent to your email.' });
      }
    }
  });
}


/**
 * Handles the update profile request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function updateStudioProfile(req, res) {
  jwt.verifyToken(req.body.token, (error, decoded) => {
    if (error === 1) {
      const userId = decoded.userId;
      const selectQuery = 'SELECT * FROM `mystudio`.`studio` WHERE `studioId` = ?';
      database.connection.query(selectQuery, [userId], (error, result, fields) => {
        if (error) {
          res.status(500).json({ error: 'Internal server error' });
        } else {
          if (result.length < 1) {
            res.status(200).json({ error: 'User not found' });
          } else {
            const user = result[0];
            if (user.password === decoded.password) {
              const updateQuery =
                'UPDATE `mystudio`.`studio` SET `studioName` = ?, `emailOrContact` = ?, `contactFirstname` = ?, `contactLastname` = ?, `contactnumber` = ?, `gender` = ?, `city` = ?, `pinCode` = ?, `street` = ?, `landMark` = ?, `latitude` = ?, `longnitute` = ?, `businessWPNumber` = ?, `aboutStudio` = ?, `establishedon` = ?, `travelpolicy` = ?, `cancelpolicy` = ?, `paymentpolicy` = ?, `studiowebsite` = ?, `studiofbpage` = ?, `studiotweeterpage` = ?, WHERE (`studioId` = ?)';
              const { studioName, emailOrContact, contactFirstname, contactLastname, contactnumber, gender, city, pinCode, street, landMark, latitude, longnitute, businessWPNumber, aboutStudio, establishedon, travelpolicy, cancelpolicy, paymentpolicy, studiowebsite, studiofbpage, studiotweeterpage} = req.body;
              const values = [studioName, emailOrContact, contactFirstname, contactLastname, contactnumber, gender, city, pinCode, street, landMark, latitude, longnitute, businessWPNumber, aboutStudio, establishedon, travelpolicy, cancelpolicy, paymentpolicy, studiowebsite, studiofbpage, studiotweeterpage, userId];
              database.connection.query(updateQuery, values, (error, results) => {
                if (error) {
                  res.status(500).json({ error: 'Internal server error' });
                } else {
                  res.status(200).json({ message: 'Profile updated successfully.' });
                }
              });
            }
          }
        }
      });
    } else {
      res.status(200).json({ message: 'Token Expired' });
    }
  });
}

  
module.exports = loginRoutes;
module.exports = {
    userLogin,
    resetPassword,
    updateStudioProfile,
    getUserProfile,
    forgotPassword
};
