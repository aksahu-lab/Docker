const express = require('express');
const app = express();


const loginroutes = require('./module/useronboard/login/userlogin');
const regroutes = require('./module/useronboard/regristration/registeration');
const profileroutes = require('./module/userprofile/userprofile');
const usrdashboardroutes = require('./module/userdashboard/userdashboard');


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
