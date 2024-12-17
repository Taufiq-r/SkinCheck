import { getFirestore, collection, addDoc } from "firebase/firestore";

const db = getFirestore();

document.getElementById("predictButton").addEventListener("click", async () => {
    const file = document.getElementById("fileInput").files[0];

    if (!file) {
        alert("Silakan pilih file gambar terlebih dahulu.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        // Kirim file ke backend model (Cloud Run API)
        const response = await fetch("https://skincheck-263817187065.us-central1.run.app", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        console.log("Hasil prediksi:", result);

        // Simpan hasil ke Firestore
        await addDoc(collection(db, "predictions"), {
            imageName: file.name,
            prediction: result.diseaseName,
            description: result.description,
            timestamp: new Date(),
        });

        alert("Prediksi berhasil!");
        window.location.href = "result.html";
        localStorage.setItem("diseaseName", result.diseaseName);
        localStorage.setItem("description", result.description);
    } catch (error) {
        console.error("Error saat prediksi:", error);
    }
});
