// Fungsi untuk scroll ke bagian upload
function scrollToUpload() {
    document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' });
}

// Fungsi untuk menghubungkan frontend ke backend
document.getElementById('predictButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('imageUpload');
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');
    
    // Reset hasil sebelumnya
    resultDiv.innerHTML = '';
    
    // Periksa apakah ada file yang diunggah
    if (!fileInput.files[0]) {
        resultDiv.innerHTML = '<p style="color: red;">Silakan unggah gambar terlebih dahulu!</p>';
        return;
    }

    // Tampilkan indikator loading
    loadingDiv.style.display = 'block';

    // Siapkan data untuk dikirim ke backend
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        // Kirim request ke backend
        const response = await fetch('https://skincheck-263817187065.us-central1.run.app/api/predict', {
            method: 'POST',
            body: formData,
        });

        // Periksa apakah respons berhasil
        if (!response.ok) {
            throw new Error('Gagal mendapatkan hasil prediksi.');
        }

        // Parsing hasil prediksi
        const result = await response.json();
        resultDiv.innerHTML = `
            <h3>Hasil Prediksi:</h3>
            <p><strong>Prediksi:</strong>${result.predictedClassName}</p>
            <p><strong>Probabilitas:</strong> ${result.probability}</p>
         `;
    } catch (error) {
        resultDiv.innerHTML = `<p style="color: red;">Terjadi kesalahan: ${error.message}</p>`;
    } finally {
        // Sembunyikan indikator loading
        loadingDiv.style.display = 'none';
    }
});
