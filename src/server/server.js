const express = require('express');
const { initializeFirebase } = require('../../config/firebase');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 8080;


initializeFirebase();


app.use('/', routes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});