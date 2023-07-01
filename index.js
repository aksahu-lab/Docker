//
//  Index.js -> App Entry Point
//
//  Created by Gyan on 23/06/2023.
//

const express = require('express');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const YAML = require('yamljs');

const usrdashboardroutes = require('./module/userdashboard/userdashboard');
const publicfeedsroute = require('./module/userdashboard/publicfeed');


// Load and parse the Swagger specification file
const swaggerSpec = YAML.load('./swagger.yaml');

// Serve the Swagger UI at /api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Continue defining your routes and handlers...
app.use('/api/user', (req, res) => {
  const onboard = require('./module/useronboard/onboard');
  onboard.redirecttoactualrouter(req, res);
});

app.use('/api/Media', (req, res) => {
  // const filename = req.params.filename;
  const path = require('path');
  const filePath = path.join("./Media", req.url); // Adjust the folder path as per your image location
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(404).send('File not found');
    }
  });
});

app.use('/api/Assets', (req, res) => {
  // const filename = req.params.filename;
  const path = require('path');
  const filePath = path.join("./Assets", req.url); // Adjust the folder path as per your image location
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(404).send('File not found');
    }
  });
});

app.use('/api/dashboard', usrdashboardroutes, (req, res) => {
  console.log('*** Dashboard');
});

app.use('/api/userfeeds', publicfeedsroute, (req, res) => {
  console.log('*** public feeds route *****');
});

app.get('/', (req, res) => { });

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = app;
