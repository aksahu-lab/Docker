// const MongoClient = require('mongodb').MongoClient;
const { MongoClient } = require('mongodb');
const database = require('../databasemanager/databasemanager');

const url = 'mongodb://127.0.0.1:27017'; // Replace with your MongoDB URL
const dbName = 'mystudio'; // Replace with your database name

// Function to connect to MongoDB
const connectToMongoDB = async () => {
  try {
    const client = new MongoClient(url);
    await client.connect();
    console.log('Connected successfully to the database');
    return client.db(dbName);
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
};

// Function to insert a document
const insertDocument = async (collectionName, document) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(document);
    console.log('Document inserted successfully');
    return result;
  } catch (error) {
    console.error('Failed to insert document:', error);
    throw error;
  }
};

// Function to find documents
const findDocuments = async (collectionName, query) => {
  try {
    const db = await connectToMongoDB();
    console.log("\n=============Connect======== " + "\n");
    const collection = db.collection(collectionName);
    const documents = await collection.find(query).toArray();
    console.log('Documents found successfully' + documents);
    return documents;
  } catch (error) {
    console.log("\n=============Throw========\n");
    console.error('Failed to find documents:', error);
    throw error;
  }
};

// Function to update a document
const updateDocument = async (collectionName, query, update) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection(collectionName);
    const result = await collection.updateOne(query, { $set: update });
    console.log('Document updated successfully');
    return result;
  } catch (error) {
    console.error('Failed to update document:', error);
    throw error;
  }
};

// Function to delete a document
const deleteDocument = async (collectionName, query) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne(query);
    console.log('Document deleted successfully');
    return result;
  } catch (error) {
    console.error('Failed to delete document:', error);
    throw error;
  }
};

// Function to GET COllection document count
const collectionDataCount = async (collectionName) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection(collectionName);
    // Get the count of documents in the collection
    console.log("\nDocuemnt Count  ==>> " + collectionName);
    const count = await collection.countDocuments();
    return count;
  } catch (error) {
    console.error('Failed to delete document:', error);
    throw error;
  }
};

// Function to like/unlike a comment
const likeUnlikeComment = async (feedId, userId, like) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection('publicfeeds');
    // Retrieve the comment
    const comment = await collection.findOne({ feedId: feedId });

    if (!comment) {
      console.log('Comment not found.');
      return;
    }

    // Check if the user has already liked the comment
    const userIndex = comment.likes.indexOf(userId);
    if (like === `1` && userIndex === -1) {
      comment.likes.push(userId);
    } else if (like === `0` && userIndex !== -1) {
      comment.likes.splice(userIndex, 1);
    } else {
      console.log('Invalid like/unlike operation.');
      return;
    }

    // Update the comment
    await collection.updateOne({ feedId: feedId }, { $set: { likes: comment.likes } }); // likesCount: comment.likesCount
    const message = like === `0` ? 'Unliked' : 'Liked';

    return `${message} the feed.`;
  } catch (error) {
    console.error('Failed to like/unlike comment:', error);
    throw error;
  }
};

// Function to comment on a feed
const commentOnFeed = async (feedId, userId, commentText) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection('publicfeeds');

    // Retrieve the feed
    const feed = await collection.findOne({ feedId: feedId });

    if (!feed) {
      console.log('Feed not found.');
      return;
    }

    // Create a new comment object
    const newComment = {
      userId: userId,
      commentText: commentText
    };

    // Add the comment to the feed's comments array
    feed.comments.push(newComment);

    // Update the feed with the new comment
    await collection.updateOne({ feedId: feedId }, { $set: { comments: feed.comments } });

    return 'Comment added successfully.';
  } catch (error) {
    console.error('Failed to comment on feed:', error);
    throw error;
  }
};

// Function to comment pic from album
const commentOnAlbumPic = async (albumID, fileId, userId, commentText) => {
  try {
      const db = await connectToMongoDB();
      const collection = db.collection('useralbum');
      // Retrieve the feed
      const feed = await collection.findOne({ albumID: albumID });
      if (!feed) {
        console.log('Photo/Video not found.');
        return 'Photo/Video not found.';
      }
      const selectQuery = "SELECT * FROM `mystudio`.`user` WHERE `userId` = '" + userId + "'";
      await database.connection.query(selectQuery, (error, result, fields)=> {
          if(error){
              // res.status(500).json({ error: 'Internal server error' });
              return 'Internal server error';
          } else {
              const count = result.length;
              if (count < 1) {
                  return 'User not found';
              }
              // Create a new comment object
              const newComment = {
                userId: userId,
                firstname: result[0].firstname,
                lastname: result[0].lastname,
                profilepic: "http://localhost:3000/api/" + result[0].profileimage,
                commentText: commentText
              };

              // Update the album with the new comment
              const updateResult = collection.updateOne(
                { 'files.fileId': fileId },
                { $push: { 'files.$.comments': newComment } }
              );

              if (updateResult.modifiedCount > 0) {
                console.log('Comment inserted successfully');
                return;// 'Comment added successfully.';
              } else {
                console.log('Failed to add comment');
                return;// 'Failed to add comment.';
              }

          }
      });

  } catch (error) {
    console.error('Failed to comment on feed:', error);
    throw error;
  }
};


module.exports = {
  connectToMongoDB,
  insertDocument,
  findDocuments,
  updateDocument,
  deleteDocument,
  collectionDataCount,
  likeUnlikeComment,
  commentOnFeed,
  commentOnAlbumPic
};
