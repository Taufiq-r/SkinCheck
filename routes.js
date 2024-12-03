const express = require('express');
const { scrapeSkinCareArticle } = require('./scraper/scraper');  
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

// Endpoint untuk mengambil artikel kesehatan kulit
router.get('/api/articles', async (req, res) => {
  const articleUrl = 'https://www.healthline.com/skin-care'; 
  try {
    const article = await scrapeSkinCareArticle(articleUrl);
    res.status(200).send({ article });
  } catch (error) {
    res.status(500).send({ error: 'Error scraping article' });
  }
});

// Endpoint healthcheck untuk simulasi
router.get('/api/healthcheck', (req, res) => {
  res.status(200).send({ status: 'up' });
});

// Endpoint root
router.get('/', (req, res) => {
  res.send('Hello, SkinCheck!');
});

module.exports = router;
