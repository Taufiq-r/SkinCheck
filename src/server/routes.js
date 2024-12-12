const admin = require('firebase-admin');
const { getFirebaseCredentials } = require('../config/secretManager');
const { predictImage } = require('../services/predict'); // Import predictImage

async function initializeFirebase() {
  try {
    const serviceAccount = await getFirebaseCredentials();
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      admin.app();
    }
    console.log("Firebase Admin SDK Initialized");
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    throw new Error("Firebase initialization failed");
  }
}

const routes = [
  {
    method: 'GET',
    path: '/api/articles/data',
    handler: async (request, h) => {
      const diseaseId = request.query.id;
      if (!diseaseId) {
        return h.response({ error: "Parameter 'id' required." }).code(400);
      }

      try {
        const db = admin.firestore();
        const diseaseRef = db.collection("articles").doc(diseaseId);
        const doc = await diseaseRef.get();

        if (!doc.exists) {
          return h.response({ error: "Article data not found." }).code(404);
        }

        return h.response({ data: doc.data() }).code(200);
      } catch (error) {
        console.error("Error:", error);
        return h.response({ error: "Server error." }).code(500);
      }
    },
  },
  {
    method: 'POST',
    path: '/api/predict',
    options: {
      payload: {
        maxBytes: 10485760, // Limit file size to 10MB
        parse: true,
        output: 'data', // Get the file data as a buffer
      },
    },
    handler: async (request, h) => {
      const file = request.payload.file;
      if (!file) {
        return h.response({ error: 'No file uploaded' }).code(400);
      }

      try {
        const result = await predictImage(file);
        return h.response(result).code(200);
      } catch (error) {
        console.error('Prediction error:', error);
        return h.response({ error: 'Error processing image' }).code(500);
      }
    },
  },
  {
    method: 'GET',
    path: '/home',
    handler: (request, h) => {
      const homeData = {
        message: 'Welcome to SkinCheck!',
        description: 'This is your home screen in the SkinCheck app.',
        tips: [
          'Check your skin regularly.',
          'Consult a dermatologist for proper care.',
          'Keep your skin hydrated.',
        ],
        status: 'active',
      };
      return h.response(homeData).code(200);
    },
  },
  {
    method: 'GET',
    path: '/api/articles',
    handler: async (request, h) => {
      const articleUrl = 'https://www.healthline.com/skin-care';
      try {
        const article = await scrapeSkinCareArticle(articleUrl); // Assuming this function exists
        return h.response({ article }).code(200);
      } catch (error) {
        return h.response({ error: 'Error scraping article' }).code(500);
      }
    },
  },
  {
    method: 'GET',
    path: '/api/healthcheck',
    handler: (request, h) => {
      return h.response({ status: 'up' }).code(200);
    },
  },
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.response('Hello, SkinCheck!').code(200);
    },
  },
];

module.exports = routes;
