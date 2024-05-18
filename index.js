//
//  Index.js -> App Entry Point
//
//  Created by Gyan on 23/06/2023.
//

const express = require("express");
require("./src/database/mongoose");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

const studioRouter = require("./src/routers/studio");
const groupRouter = require("./src/routers/group");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.options("*");

app.use("/api/studio", studioRouter);
app.use("/api/group", groupRouter);

// Serve the Swagger UI at the /api-docs endpoint
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Redirects the request to the appropriate router for user-related actions.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
// app.use('/api/user', onboardRoutes.redirectToActualRouter);

/**
 * Redirects the request to the appropriate router for user-related actions.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
// app.use('/api/studio', studioOnboardRoutes.redirectToActualRouter, cors());

/**
 * Redirects the request to the appropriate router for user-related actions.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
// app.use('/api/vendor', studioInfoRoutes, (req, res) => {
//   console.log('*** social network Activity');
// });

/**
 * Downloads a file from the Media folder.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
// app.use('/api/Media', (req, res) => {
//   const path = require('path');
//   const filePath = path.join('./Media', req.url);
//   res.download(filePath, (err) => {
//     if (err) {
//       console.error('Error downloading file:', err);
//       res.status(404).send('File not found');
//     }
//   });
// });

/**
 * Downloads a file from the Assets folder.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
// app.use('/api/Assets', (req, res) => {
//   const path = require('path');
//   const filePath = path.join('./Assets', req.url);
//   res.download(filePath, (err) => {
//     if (err) {
//       console.error('Error downloading file:', err);
//       res.status(404).send('File not found');
//     }
//   });
// });

// app.use('/api/dashboard', userDashboardRoutes, (req, res) => {
//   console.log('*** Dashboard');
// });

// app.use('/api/userfeeds', publicFeedsRoute, (req, res) => {
//   console.log('*** Public Feeds Route');
// });

// app.use('/api/social', socialBuilderRoute, (req, res) => {
//   console.log('*** social network Activity');
// });

/**
 * For uploaded image files
 */
app.use("/images", express.static(__dirname));

/**
 * Default route handler.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.get("/", (req, res) => { });

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// module.exports = app;
module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,
    })
  );
};
