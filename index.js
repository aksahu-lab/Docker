const express = require('express');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const YAML = require('yamljs');

const profileroutes = require('./module/userprofile/userprofile');
const usrdashboardroutes = require('./module/userdashboard/userdashboard');


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
  console.log("+++++++++++++++++   " + filePath);

  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(404).send('File not found');
    }
  });

  // res.sendFile(filePath, (err) => {
  //   if (err) {
  //     console.error('Error sending file:', err);
  //     res.status(404).send('File not found');
  //   }
  // });

});

app.use('/api/profile', profileroutes, (req, res) => {
  console.log('*** profileroutes');
});

app.use('/api/dashboard', usrdashboardroutes, (req, res) => {
  console.log('*** profileroutes');
});

app.get('/', (req, res) => { });

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = app;
