
const { Router } = require('express');
const database = require('../../databasemanager/databasemanager');
const jwt = require('../../security/jwt/jwtmanager');
const mongodatabase = require('../../databasemanager/mongodbmanager');
const tableCheck = require('../../databasemanager/tablecheck');

// Create the router
const studioInfo = Router();

const multer = require('multer')();


// Route: /block
// Description: Blocks a user
studioInfo.post('/getStudioList', multer.none(), verifyToken, (req, res) => {
    // Access the user information from the decoded token
    const user = req.user;

    let tableName = "studio";
    let columnName = "studioName";
    let condition = "usertype = 'Studio'";
    let limit = 10;

    let selectQuery = `
    SELECT *
    FROM \`${tableName}\`
    WHERE ${condition}
    LIMIT ${limit};
    `;

    database.connection.query(selectQuery, (error, results) => {
        var userList = [];
        if (error) {
            // TODO: Implement adding a friend functionality
            res.status(400).json({ message: 'Something Went Wrong.', user });
        } else {
            // TODO: Implement blocking a user functionality
            res.status(200).json(results);
        }
    });
});


function verifyToken(req, res, next) {
    jwt.verifyToken(req.body.token, (error, decoded) => {
        if (error === 1) {
            // Handle the error, e.g., return an error response
            // Success condition: Token is valid
            // You can access the decoded token information here
            req.user = decoded; // Attach the decoded token information to the request object
            next(); // Proceed to the next middleware or route handler
        } else {
            res.status(200).json({ message: 'Token Expired' });
        }
    });
}


// Export the router
module.exports = studioInfo;
