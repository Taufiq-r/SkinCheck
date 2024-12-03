const express = require("express");
const { admin } = require("./config/firebase"); // Ambil admin langsung dari firebase.js

const router = express.Router();

// Endpoint untuk mendapatkan data artikel berdasarkan ID
router.get("/articles", async (req, res) => {
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
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

module.exports = router;
