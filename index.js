const express = require('express');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const YAML = require('yamljs');

const loginroutes = require('./module/useronboard/login/userlogin');
const regroutes = require('./module/useronboard/regristration/registeration');
const profileroutes = require('./module/userprofile/userprofile');
const usrdashboardroutes = require('./module/userdashboard/userdashboard');



// Load and parse the Swagger specification file
const swaggerSpec = YAML.load('./swagger.yaml');

// // Set up Swagger-jsdoc
// const options = {
//   swaggerDefinition: swaggerSpec,
//   apis: [], // Add the paths to your API files if you're using JSDoc comments
// };
// const swaggerDocs = swaggerJsdoc(options);

// Serve the Swagger UI at /api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Continue defining your routes and handlers...

app.use('/api/user', loginroutes, (req, res) => {
  console.log('*** userlogin');
});

app.use('/api/registration/', regroutes, (req, res) => {
  console.log('*** regristration');
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
