const express = require('express');
const articlesRouter = require('./articles_api');
  
const router = express.Router();

// Endpoint home
router.get('/home', (req, res) => {
  const homeData = {
    message: 'Welcome to SkinCheck!',
    description: 'This is your home screen in the SkinCheck app.',
    tips: [
      'Check your skin regularly.',
      'Consult a dermatologist for proper care.',
      'Keep your skin hydrated.'
    ],
    status: 'active'
  };
  res.status(200).send(homeData);
});


// Endpoint untuk data artikel Firebase
router.use('/api', articlesRouter); // Integrasikan endpoint `articles_api.js`

// Endpoint healthcheck untuk simulasi
router.get('/api/healthcheck', (req, res) => {
  res.status(200).send({ status: 'up' });
});

// Endpoint root
router.get('/', (req, res) => {
  res.send('Hello, SkinCheck!');
});

module.exports = router;
