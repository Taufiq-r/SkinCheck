// Konfigurasi Firebase
const firebaseConfig = {
  // Tambahkan konfigurasi Firebase Anda di sini
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Fungsi untuk melakukan pendaftaran
function signup() {
  // Implementasi pendaftaran ...
  window.location.href = "index.html";
}

// Fungsi untuk melakukan login
function login() {
  // Implementasi login ...
  window.location.href = "index.html";
}

// Event listener untuk form pendaftaran
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
      event.preventDefault();
      signup();
  });
}

// Event listener untuk form login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      login();
  });
}

// Fungsi untuk menyimpan data ke Firestore
async function saveToFirestore(timestamp, image, disease, description) {
  try {
      await db.collection("history").add({
          timestamp,
          image,
          disease,
          description,
      });
      console.log("Data berhasil disimpan ke Firestore.");
  } catch (error) {
      console.error("Gagal menyimpan data ke Firestore:", error);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const fileInput = document.getElementById('fileInput');
  const imagePreview = document.getElementById('imagePreview');

  // Event listener untuk ketika file dipilih
  fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files[0]) {
          const reader = new FileReader();
          reader.onload = function (e) {
              imagePreview.src = e.target.result;
          }
          reader.readAsDataURL(fileInput.files[0]);
      }
  });

  const captureButton = document.getElementById('captureButton');
  const predictButton = document.getElementById('predictButton');

  // Event listener untuk tombol Capture
  captureButton.addEventListener('click', function () {
      alert("Capture button clicked!");
  });

  // Event listener untuk tombol Predict
  predictButton.addEventListener('click', function () {
      alert("Predict button clicked!");
  });
});

// Fungsi untuk mengambil data riwayat dari Firestore
async function getHistory() {
  const historyList = document.getElementById("historyList");
  if (!historyList) {
      console.error("Elemen #historyList tidak ditemukan.");
      return;
  }

  try {
      const querySnapshot = await db.collection("history").orderBy("timestamp", "desc").get();

      querySnapshot.forEach((doc) => {
          const data = doc.data();
          const historyItem = document.createElement("div");
          historyItem.classList.add("history-item");

          historyItem.innerHTML = `
              <img class="history-image" src="${data.image}" alt="Hasil Prediksi">
              <div class="history-text">
                  <h3>${data.disease}</h3>
                  <p>${data.description}</p>
              </div>
          `;

          historyList.appendChild(historyItem);
      });
  } catch (error) {
      console.error("Gagal mengambil data riwayat dari Firestore:", error);
  }
}

// Panggil fungsi getHistory untuk menampilkan riwayat
getHistory();
