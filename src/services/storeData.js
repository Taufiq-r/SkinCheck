const admin = require('firebase-admin');

async function storeData(id, data) {
  try {
    const db = admin.firestore();
    await db.collection('predictions').doc(id).set(data);
  } catch (error) {
    console.error("Error storing data:", error);
    throw new Error("Failed to store prediction data");
  }
}

module.exports = storeData;
