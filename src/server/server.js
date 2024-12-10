// routes/server.js

const express = require('express');
const { initializeFirebase } = require('../config/firebase'); // Mengimpor firebase dari folder config
const routes = require('./routes'); // Mengimpor routes dari file routes.js

const app = express();
const port = process.env.PORT || 8080;

// Menginisialisasi Firebase
initializeFirebase();

// Middleware untuk parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menggunakan routes yang sudah didefinisikan di routes.js
app.use('/', routes);

// Menjalankan server pada port yang sudah didefinisikan
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
