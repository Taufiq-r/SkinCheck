const admin = require('firebase-admin');

const { getFirebaseCredentials } = require('./secretManager');
// Fungsi untuk inisialisasi Firebase Admin SDK
// Inisialisasi Firebase Admin SDK
async function initializeFirebase() {
  try {
    const serviceAccount = await getFirebaseCredentials();
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase initialized successfully.');
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

module.exports = { admin, initializeFirebase };