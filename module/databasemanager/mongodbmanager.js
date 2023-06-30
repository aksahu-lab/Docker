// const MongoClient = require('mongodb').MongoClient;
const { MongoClient } = require('mongodb');

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


module.exports = {
  connectToMongoDB,
  insertDocument,
  findDocuments,
  updateDocument,
  deleteDocument,
  collectionDataCount
};
