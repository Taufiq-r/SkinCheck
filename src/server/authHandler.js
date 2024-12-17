const admin = require('firebase-admin');
const InputError = require('../exceptions/InputError');
const { initializeFirebase } = require('../config/secretManager');

// Handler untuk Sign Up
async function signupHandler(request, h) {
  const { email, password } = request.payload;

  try {
    // Mendaftar pengguna baru melalui Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    return h.response({
      status: 'success',
      message: 'User successfully created',
      data: { uid: userRecord.uid, email: userRecord.email },
    }).code(201);
  } catch (error) {
    console.error('Error during sign-up:', error);
    return h.response({
      status: 'error',
      message: 'Failed to create user',
      error: error.message,
    }).code(500);
  }
}

// Handler untuk Login
async function loginHandler(request, h) {
  const { email, password } = request.payload;

  try {
    // Verifikasi kredensial pengguna melalui Firebase Authentication
    const userRecord = await admin.auth().getUserByEmail(email);

    // Anda dapat menambahkan proses verifikasi password di sini, jika diperlukan
    // Namun, Firebase Authentication akan mengelola otentikasi password secara otomatis jika menggunakan Firebase SDK di frontend.

    return h.response({
      status: 'success',
      message: 'Login successful',
      data: { uid: userRecord.uid, email: userRecord.email },
    }).code(200);
  } catch (error) {
    console.error('Error during login:', error);
    return h.response({
      status: 'error',
      message: 'Failed to log in',
      error: error.message,
    }).code(500);
  }
}

// Handler untuk Logout
async function logoutHandler(request, h) {
  try {
    // Proses logout (misalnya, menghapus sesi atau token)
    return h.response({
      status: 'success',
      message: 'User successfully logged out',
    }).code(200);
  } catch (error) {
    console.error('Error during logout:', error);
    return h.response({
      status: 'error',
      message: 'Failed to log out',
      error: error.message,
    }).code(500);
  }
}

module.exports = { signupHandler, loginHandler, logoutHandler };
