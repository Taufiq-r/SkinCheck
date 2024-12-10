function startPrediction() {
  const fileInput = document.getElementById('imageUpload');
  const resultDiv = document.getElementById('result');

  if (!fileInput.files[0]) {
      alert("Harap unggah gambar terlebih dahulu.");
      return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("image", file);

  // Tampilkan loading
  resultDiv.style.display = "block";
  resultDiv.innerHTML = "Memproses gambar...";

  // Kirim ke server
  fetch('http://localhost:5000/predict', {
      method: 'POST',
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      if (data.error) {
          resultDiv.innerHTML = "Error: " + data.error;
      } else {
          resultDiv.innerHTML = `
              <strong>Hasil Prediksi:</strong>
              <p>${data.prediction}</p>
              <img src="${data.image_url}" alt="Uploaded Image">
          `;
      }
  })
  .catch(err => {
      resultDiv.innerHTML = "Terjadi kesalahan saat memproses gambar.";
      console.error(err);
  });
}