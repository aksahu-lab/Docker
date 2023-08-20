//
//  Login ->
//      1. userlogin
//      2. resetpassword
//      3. updateprofile
//      4. getuserprofile
//
//  Created by Gyan on 23/06/2023.
//

const clientmanagerRoutes = require('express').Router();
const axios = require('axios');

const jwt = require('../../../security/jwt/jwtmanager');
const database = require('../../../databasemanager/databasemanager');
const tableCheck = require('../../../databasemanager/tablecheck');

/**
 * Handles the get user profile request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function getAllClients(req, res) {
  // jwt.verifyToken(req.body.token, (error, decoded) => {
  //   if (error === 1) {
        (async () => {
            try {
                const data = await fetchClientsFromDifferentServer();
                const inProgressArray = [];
                const completedArray = [];
                const deliveredArray = [];

                // Iterate over each item in the data array
                data.forEach((item) => {
                  // if (item.state === 1) {
                      const clientInfo = {
                          "usertype": "General",
                          "profileimage": item.download_url,
                          "firstname": "Gyana",
                          "lastname": "Gouda",
                          "gender": "Male",
                          "city": "Berhampur",
                          "Contact": "+91-8895666168",
                          "EventDate": "29/Dec/2023"
                      }
                      inProgressArray.push(clientInfo);
                  // } else if (item.state === 2) {
                      completedArray.push(clientInfo);
                  // } else if (item.state === 3) {
                      deliveredArray.push(clientInfo);
                  // }
                });
    
                res.status(200).json({inprogressAlbum: inProgressArray, completedAlbum:completedArray, deliveredAlbum:deliveredArray});    
            } catch (error) {
                console.error('Error:', error);
            }
        })();     
  //   } else {
  //     res.status(200).json({ message: 'Token Expired' });
  //   }
  // });
}

/**
 * Handles the get user profile request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function getAlbumForClient(req, res) {
  // jwt.verifyToken(req.body.token, (error, decoded) => {
  //   if (error === 1) {

        (async () => {
            try {
                const data = await fetchClientsFromDifferentServer();
                const inProgressArray = [];
                const completedArray = [];
                const deliveredArray = [];

                // Iterate over each item in the data array
                data.forEach((item) => {
                // if (item.state === 1) {
                   
                    const albumInfo = {
                      "albumId": "General",
                      "imageUrl": item.download_url,
                      "firstname": "Gyana",
                      "lastname": "Gouda",
                      "name": "Gyana",
                      "Contact": "+91-8895666168",
                      "EventDate": "29/Dec/2023"
                  }
                    inProgressArray.push(albumInfo);
                // } else if (item.state === 2) {
                //     completedArray.push(item);
                // } else if (item.state === 3) {
                //     deliveredArray.push(item);
                // }
                });
    
                res.status(200).json(inProgressArray);    
            } catch (error) {
                console.error('Error:', error);
            }
        })();     
  //   } else {
  //     res.status(200).json({ message: 'Token Expired' });
  //   }
  // });
}

/**
 * Handles the get user profile request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function getAllphotos(req, res) {
  // jwt.verifyToken(req.body.token, (error, decoded) => {
  //   if (error === 1) {

        (async () => {
            try {
                const data = await fetchClientsFromDifferentServer();
                const inProgressArray = [];
                // Iterate over each item in the data array

                data.forEach((item) => {
                  const photoInfo = {
                      "albumId": "General",
                      "imageUrl": item.download_url,
                      "downloadUrl": item.download_url,
                      "fileName": "Gyana",
                      "fileId": "Gobjbbjuda",
                      "width":'325',
                      "height":'200',
                      "Resolution":'144 × 144',
                      "fileSize":'10MB',
                      "EventDate": "29/Dec/2023",
                      "selected":true,
                      "isdeleted":false,
                      "createdDate": "29/Dec/2023",
                      "comments": [
                          {
                            'commented' : 'Self',
                            'CommentText': "You can now view mystudiostudiounboard in the browser.",
                            'profileImage': 'https://fastly.picsum.photos/id/102/4320/3240.jpg?hmac=ico2KysoswVG8E8r550V_afIWN963F6ygTVrqHeHeRc'
                          },
                          {
                            'commented' : 'You',
                            'CommentText': "You can now view mystudiostudiounboard in the browser.",
                            'profileImage': 'https://fastly.picsum.photos/id/103/2592/1936.jpg?hmac=aC1FT3vX9bCVMIT-KXjHLhP6vImAcsyGCH49vVkAjPQ'
                          },{
                            'commented' : 'Self',
                            'CommentText': "You can now view mystudiostudiounboard in the browser.",
                            'profileImage': 'https://fastly.picsum.photos/id/102/4320/3240.jpg?hmac=ico2KysoswVG8E8r550V_afIWN963F6ygTVrqHeHeRc'
                          },
                          {
                            'commented' : 'You',
                            'CommentText': "You can now view mystudiostudiounboard in the browser.",
                            'profileImage': 'https://fastly.picsum.photos/id/103/2592/1936.jpg?hmac=aC1FT3vX9bCVMIT-KXjHLhP6vImAcsyGCH49vVkAjPQ'
                          },{
                            'commented' : 'Self',
                            'CommentText': "You can now view mystudiostudiounboard in the browser.",
                            'profileImage': 'https://fastly.picsum.photos/id/102/4320/3240.jpg?hmac=ico2KysoswVG8E8r550V_afIWN963F6ygTVrqHeHeRc'
                          },
                          {
                            'commented' : 'You',
                            'CommentText': "You can now view mystudiostudiounboard in the browser.",
                            'profileImage': 'https://fastly.picsum.photos/id/103/2592/1936.jpg?hmac=aC1FT3vX9bCVMIT-KXjHLhP6vImAcsyGCH49vVkAjPQ'
                          },{
                            'commented' : 'Self',
                            'CommentText': "You can now view mystudiostudiounboard in the browser.",
                            'profileImage': 'https://fastly.picsum.photos/id/102/4320/3240.jpg?hmac=ico2KysoswVG8E8r550V_afIWN963F6ygTVrqHeHeRc'
                          },
                          {
                            'commented' : 'You',
                            'CommentText': "You can now view mystudiostudiounboard in the browser.",
                            'profileImage': 'https://fastly.picsum.photos/id/103/2592/1936.jpg?hmac=aC1FT3vX9bCVMIT-KXjHLhP6vImAcsyGCH49vVkAjPQ'
                          },{
                            'commented' : 'Self',
                            'CommentText': "You can now view mystudiostudiounboard in the browser.",
                            'profileImage': 'https://fastly.picsum.photos/id/102/4320/3240.jpg?hmac=ico2KysoswVG8E8r550V_afIWN963F6ygTVrqHeHeRc'
                          },
                          {
                            'commented' : 'You',
                            'CommentText': "You can now view mystudiostudiounboard in the browser.",
                            'profileImage': 'https://fastly.picsum.photos/id/103/2592/1936.jpg?hmac=aC1FT3vX9bCVMIT-KXjHLhP6vImAcsyGCH49vVkAjPQ'
                          },{
                            'commented' : 'Self',
                            'CommentText': "You can now view mystudiostudiounboard in the browser.",
                            'profileImage': 'https://fastly.picsum.photos/id/102/4320/3240.jpg?hmac=ico2KysoswVG8E8r550V_afIWN963F6ygTVrqHeHeRc'
                          },
                          {
                            'commented' : 'You',
                            'CommentText': "You can now view mystudiostudiounboard in the browser.",
                            'profileImage': 'https://fastly.picsum.photos/id/103/2592/1936.jpg?hmac=aC1FT3vX9bCVMIT-KXjHLhP6vImAcsyGCH49vVkAjPQ'
                          }
                        ]
                  }
                  inProgressArray.push(photoInfo);
                });
    
                res.status(200).json(inProgressArray);    
            } catch (error) {
                console.error('Error:', error);
            }
        })();     
  //   } else {
  //     res.status(200).json({ message: 'Token Expired' });
  //   }
  // });
}
  

async function fetchClientsFromDifferentServer() {
    try {
      const response = await axios.get('https://picsum.photos/v2/list?page=2&limit=1000'); // Replace with your API endpoint
  
      if (response.status === 200) {
        const responseData = response.data;
        return responseData;
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
      throw error;
    }
}

module.exports = clientmanagerRoutes;
module.exports = {
    getAllClients,
    getAlbumForClient,
    getAllphotos
};
