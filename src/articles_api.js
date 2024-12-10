const express = require("express");
const admin = require("firebase-admin");

const router = express.Router();

// Pastikan Firestore hanya diinisialisasi jika admin sudah terinisialisasi
if (!admin.apps.length) {
  admin.initializeApp();
} else {
  admin.app(); // Menggunakan aplikasi yang sudah ada jika sudah diinisialisasi
}

const db = admin.firestore();
console.log("Firebase Admin SDK Initialized:", db);

// Endpoint untuk mendapatkan data artikel berdasarkan ID
router.get("/data", async (req, res) => {
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

module.exports = router;
