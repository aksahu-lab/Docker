// Import required modules
const { Router } = require('express');
const database = require('../databasemanager/databasemanager');
const jwt = require('../security/jwt/jwtmanager');
const mongodatabase = require('../databasemanager/mongodbmanager');
const multer = require('multer')();

// Create the router
const socialBuilderRoute = Router();

// Route: /searchFriend
// Description: Searches for a friend
socialBuilderRoute.post('/searchFriend', multer.none(), verifyToken, (req, res) => {
    // Access the user information from the decoded token
    const user = req.user;
    console.log("*******");
    // TODO: Implement search functionality
    searchByNameCharacters(req.body.searchBy, (error, results) => {
        if (error) {
            res.status(200).json({ message: "No User found."});
        }
        res.status(200).json(results);
    });
});

// Route: /sendRequest
// Description: Sends a friend request
socialBuilderRoute.post('/sendRequest', multer.none(), verifyToken, (req, res) => {
    // Access the user information from the decoded token
    const user = req.user;

    // TODO: Implement friend request sending functionality

    res.status(200).json({ message: 'Search successful', user });
});

// Route: /addFriend
// Description: Adds a friend
socialBuilderRoute.post('/addFriend', multer.none(), verifyToken, (req, res) => {
    // Access the user information from the decoded token
    const user = req.user;

    // TODO: Implement adding a friend functionality
    res.status(200).json({ message: 'Search successful', user });
});

// Route: /unFriend
// Description: Removes a friend
socialBuilderRoute.post('/unFriend', multer.none(), verifyToken, (req, res) => {
    // Access the user information from the decoded token
    const user = req.user;

    // TODO: Implement removing a friend functionality
    res.status(200).json({ message: 'Search successful', user });
});

// Route: /block
// Description: Blocks a user
socialBuilderRoute.post('/block', multer.none(), verifyToken, (req, res) => {
    // Access the user information from the decoded token
    const user = req.user;

    // TODO: Implement blocking a user functionality
    res.status(200).json({ message: 'Search successful', user });
});

// Route: /reportFakeUser
// Description: Reports a fake user
socialBuilderRoute.post('/reportFakeUser', multer.none(), verifyToken, (req, res) => {
    // Access the user information from the decoded token
    const user = req.user;
    
    // TODO: Implement reporting a fake user functionality
    res.status(200).json({ message: 'Search successful', user });
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


// Function to search for characters in first name or last name
function searchByNameCharacters(searchTerm, callback) {
    const query = "SELECT * FROM `mystudio`.`user` WHERE `firstname` LIKE '" + searchTerm + "%' OR `lastname` LIKE '" + searchTerm + "%'";
    database.connection.query(query, (error, results) => {
        var userList = [];
        if (error) {
            callback(error, null);
            return;
        }
        results.forEach((file) => {
            userList.push({
                username : file.username,
                userId : file.userId,
                city : file.city,
                profileimage: "http://localhost:3000/api/" + file.profileimage,
                firstname: file.firstname,
                lastname: file.lastname,
                gender: file.gender
            });
        });
        
        callback(null, userList);
    });
}

// Export the router
module.exports = socialBuilderRoute;
