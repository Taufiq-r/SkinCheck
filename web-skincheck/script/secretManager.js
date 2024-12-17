const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Inisialisasi Secret Manager Client
const secretClient = new SecretManagerServiceClient();
let firebaseInitialized = false; // Flag untuk mengecek status inisialisasi Firebase

// Fungsi untuk mendapatkan kredensial Firebase dari Secret Manager
async function getFirebaseCredentials() {
  try {
    const secretName = 'projects/skin-check-capstone/secrets/skincheck-credentials/versions/latest';
    const [version] = await secretClient.accessSecretVersion({ name: secretName });
    const payload = version.payload.data.toString('utf8');

    // Simpan kredensial sementara ke file sistem (jika diperlukan oleh Firebase Admin SDK)
    const tempFilePath = path.join('/tmp', 'skincheck-credentials.json');
    fs.writeFileSync(tempFilePath, payload);
    return tempFilePath; // Kembalikan path ke file kredensial
  } catch (error) {
    console.error('Error fetching Firebase credentials from Secret Manager:', error);
    throw error;
  }
}

// Fungsi untuk menginisialisasi Firebase Admin SDK
async function initializeFirebase() {
  if (firebaseInitialized) {
    console.log('Firebase sudah diinisialisasi.');
    return admin.firestore(); // Jika sudah diinisialisasi, kembalikan instance Firestore
  }

  try {
    const serviceAccountPath = await getFirebaseCredentials();

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath), // Gunakan kredensial dari Secret Manager
      });
      firebaseInitialized = true; // Tandai Firebase sudah diinisialisasi
      console.log('Firebase Admin SDK berhasil diinisialisasi.');
    }

    return admin.firestore(); // Kembalikan instance Firestore
  } catch (error) {
    console.error('Gagal menginisialisasi Firebase:', error);
    throw error;
  }
}

module.exports = { initializeFirebase };
