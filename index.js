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

const userDashboardRoutes = require('./module/userdashboard/userdashboard');
const publicFeedsRoute = require('./module/userdashboard/publicfeed');
const onboardRoutes = require('./module/useronboard/clientOnBoard');
const socialBuilderRoute = require('./module/SocialBuilder/socialBuilder');

const studioOnboardRoutes = require('./module/StudioOnBoard/StudioOnboard');

// Load and parse the Swagger specification file
const swaggerSpec = YAML.load('./swagger.yaml');

// Serve the Swagger UI at the /api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Redirects the request to the appropriate router for user-related actions.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.use('/api/user', onboardRoutes.redirectToActualRouter);

/**
 * Redirects the request to the appropriate router for user-related actions.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.use('/api/studio', studioOnboardRoutes.redirectToActualRouter);


/**
 * Downloads a file from the Media folder.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.use('/api/Media', (req, res) => {
  const path = require('path');
  const filePath = path.join('./Media', req.url);
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(404).send('File not found');
    }
  });
});

/**
 * Downloads a file from the Assets folder.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.use('/api/Assets', (req, res) => {
  const path = require('path');
  const filePath = path.join('./Assets', req.url);
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(404).send('File not found');
    }
  });
});

app.use('/api/dashboard', userDashboardRoutes, (req, res) => {
  console.log('*** Dashboard');
});

app.use('/api/userfeeds', publicFeedsRoute, (req, res) => {
  console.log('*** Public Feeds Route');
});


app.use('/api/social', socialBuilderRoute, (req, res) => {
  console.log('*** social network Activity');
});


/**
 * Default route handler.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.get('/', (req, res) => {});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = app;
