//
//  Index.js -> App Entry Point
//
//  Created by Gyan on 23/06/2023.
//

const express = require('express');
require('./src/database/mongoose');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const YAML = require('yamljs');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies


const userDashboardRoutes = require('./module/userdashboard/userdashboard');
const publicFeedsRoute = require('./module/userdashboard/publicfeed');
const onboardRoutes = require('./module/useronboard/clientOnBoard');
const socialBuilderRoute = require('./module/SocialBuilder/socialBuilder');

const studioOnboardRoutes = require('./module/Studio/StudioRouter');
const studioInfoRoutes = require('./module/Vendor/Studio/studioinfo');

const studioRouter = require('./src/routers/studio')

// Load and parse the Swagger specification file
const swaggerSpec = YAML.load('./swagger.yaml');

app.use(express.json()); // Parse JSON request bodies
app.use(express.raw({ type: '*/*' })); // Parse all other request bodies as raw

// app.use(cors({}));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.options('*');

app.use('/api/studio', studioRouter);

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
app.use('/api/studio', studioOnboardRoutes.redirectToActualRouter, cors());

/**
 * Redirects the request to the appropriate router for user-related actions.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.use('/api/vendor', studioInfoRoutes, (req, res) => {
  console.log('*** social network Activity');
});

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

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// module.exports = app;
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
};