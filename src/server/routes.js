// routes/routes.js

const express = require('express');
const multer = require('multer');
const { scrapeSkinCareArticle } = require('../scraper/scraper');
const articlesRouter = require('../articles_api');
const { predictImage } = require('../services/predict'); // Mengimpor predictImage dari services/predict.js

const router = express.Router();

// Konfigurasi multer untuk menangani upload file gambar
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint untuk menerima gambar dan melakukan prediksi
router.post('/api/predict', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Menggunakan fungsi prediksi dari `services/predict.js`
    const result = await predictImage(req.file.buffer);

    // Mengirimkan hasil prediksi
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error processing image' });
  }
});

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

// Endpoint untuk data artikel Firebase
router.use('/articles', articlesRouter); // Integrasikan endpoint `articles_api.js`

// Endpoint healthcheck untuk simulasi
router.get('/api/healthcheck', (req, res) => {
  res.status(200).send({ status: 'up' });
});

// Endpoint root
router.get('/', (req, res) => {
  res.send('Hello, SkinCheck!');
});

module.exports = router;
