const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');
const { getFirebaseCredentials } = require('./config/secretManager');
const { scrapeSkinCareArticle } = require('../scraper/scraper');
const { predictImage } = require('../services/predict'); // Mengimpor predictImage dari services/predict.js

const router = express.Router();

// Konfigurasi multer untuk menangani upload file gambar
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Inisialisasi Firebase setelah mendapatkan kredensial dari Secret Manager
async function initializeFirebase() {
  try {
    const serviceAccount = await getFirebaseCredentials();

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      admin.app(); // Menggunakan aplikasi yang sudah ada jika sudah diinisialisasi
    }

    console.log("Firebase Admin SDK Initialized");
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    throw new Error("Firebase initialization failed");
  }
}

// Menginisialisasi Firebase dan kemudian mendefinisikan db
async function startServer() {
  try {
    await initializeFirebase(); // Tunggu hingga Firebase diinisialisasi

    const db = admin.firestore(); // Inisialisasi db setelah Firebase siap

    // Endpoint untuk mendapatkan data artikel berdasarkan ID
    router.get("/api/articles/data", async (req, res) => {
      const diseaseId = req.query.id;

      if (!diseaseId) {
        return res.status(400).json({ error: "Parameter 'id' diperlukan." });
      }

      try {
        const diseaseRef = db.collection("articles").doc(diseaseId);
        const doc = await diseaseRef.get();

        if (!doc.exists) {
          return res.status(404).json({ error: "Data artikel tidak ditemukan." });
        }

        res.status(200).json({ data: doc.data() });
      } catch (error) {
        console.error("Error detail:", error.message, error.stack);
        res.status(500).json({ error: "Terjadi kesalahan server." });
      }
    });

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

    // Endpoint healthcheck untuk simulasi
    router.get('/api/healthcheck', (req, res) => {
      res.status(200).send({ status: 'up' });
    });

    // Endpoint root
    router.get('/', (req, res) => {
      res.send('Hello, SkinCheck!');
    });

  } catch (error) {
    console.error("Server initialization failed:", error);
    process.exit(1); // Menghentikan aplikasi jika Firebase gagal diinisialisasi
  }
}

startServer(); // Menjalankan server setelah Firebase siap

module.exports = router;
