const express = require('express');
const { addUser, checkUser, addPrediction, getPredictions } = require('./firestore');
const path = require('path');

const app = express();
app.use(express.json()); // Middleware untuk JSON

// Rute untuk root
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Endpoint Sign Up
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  await addUser(username, password);
  res.send({ message: 'User signed up successfully.' });
});

// Endpoint Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const isValidUser = await checkUser(username, password);
  if (isValidUser) {
    res.send({ message: 'Login successful.' });
  } else {
    res.status(401).send({ message: 'Invalid credentials.' });
  }
});

// Endpoint untuk Menambahkan Prediksi
app.post('/predict', async (req, res) => {
  const { imageName, prediction, description } = req.body;
  await addPrediction(imageName, prediction, description);
  res.send({ message: 'Prediction saved successfully.' });
});

// Endpoint untuk Menampilkan Semua Prediksi
app.get('/history', async (req, res) => {
  const predictions = await getPredictions();
  res.send(predictions);
});

// Jalankan server di port yang sesuai
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
