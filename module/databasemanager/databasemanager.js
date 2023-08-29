//
//  databasemanager.js
//
//  Created by Gyan on 23/06/2023.
//

const express = require('express');
const mysql = require('mysql');

const router = express.Router();

// Create a connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Admin@777',
  database: 'mystudio',
  insecureAuth : true
});

module.exports = {connection};