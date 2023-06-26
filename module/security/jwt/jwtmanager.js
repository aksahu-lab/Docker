//
//  jwtmanager.js
//
//  Created by Gyan on 23/06/2023.
//

const jwt = require('jsonwebtoken');

const secretKey = 'qwertyuiop';

function generateToken(req, callback) {
    const payload = {
        password: req.password,
        userId: req.userId
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    callback(token);
}

function verifyToken(token, callback) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        callback(0, decoded);
        return;
      }
      callback(1, decoded);
    });
}

module.exports = {
    generateToken,
    verifyToken
}