const express = require('express');
const mysql = require('mysql');

const router = express.Router();

// Create a connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'vihan@123',
  database: 'mystudio',
  insecureAuth : true
});

module.exports = {connection};