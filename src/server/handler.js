require('dotenv').config();
const crypto = require('crypto');
const predictClassification = require('../services/predictClassificationService');
const storeData = require('../services/storeData');
const getAllData = require('../services/getAllData');
const { initializeFirebase } = require('../config/secretManager');

(async () => {
  const db = await initializeFirebase();
  module.exports.db = db; // Ekspor Firestore untuk digunakan di service lain
})();

// Handler untuk POST /predict (prediksi gambar)
async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  try {
    const { result, predictedClassName, maxProb, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id,
      result,
      predictedClassName,
      maxProb,
      suggestion,
      createdAt,
    };

    await storeData(id, data);

    return h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data,
    }).code(201);
  } catch (error) {
    console.error('Error processing prediction:', error);
    return h.response({
      status: 'error',
      message: 'Failed to process prediction',
      error: error.message,
    }).code(500);
  }
}

// Handler untuk GET /histories (riwayat prediksi)
async function postPredictHistoriesHandler(request, h) {
  try {
    const allData = await getAllData();

    const formattedData = allData.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        history: {
          result: data.result,
          predictedClassName: data.predictedClassName,
          maxProb: data.maxProb,
          createdAt: data.createdAt,
          suggestion: data.suggestion,
        },
      };
    });

    return h.response({
      status: 'success',
      data: formattedData,
    }).code(200);
  } catch (error) {
    console.error('Error fetching prediction histories:', error);
    return h.response({
      status: 'error',
      message: 'Failed to fetch prediction histories',
      error: error.message,
    }).code(500);
  }
}

module.exports = {
  postPredictHandler,
  postPredictHistoriesHandler,
};