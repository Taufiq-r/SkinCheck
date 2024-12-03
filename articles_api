const express = require("express");
const admin = require("firebase-admin");

const app = express();
const PORT = 8080;

// Inisialisasi Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

// Endpoint untuk mendapatkan data penyakit kulit berdasarkan ID
app.get("/default/articles", async (req, res) => {
  const diseaseId = req.query.id;

  if (!diseaseId) {
    return res.status(400).json({ error: "Parameter 'id' diperlukan." });
  }

  try {
    const diseaseRef = db.collection("articles").doc(diseaseId);
    const doc = await diseaseRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Data penyakit tidak ditemukan." });
    }

    res.status(200).json({ data: doc.data() });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
