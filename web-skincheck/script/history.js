import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore();

async function loadHistory() {
    const historyList = document.getElementById("historyList");
    const predictionsRef = collection(db, "predictions");

    try {
        const querySnapshot = await getDocs(predictionsRef);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            historyList.innerHTML += `
                <div class="history-item">
                    <h3>${data.prediction}</h3>
                    <p>${data.description}</p>
                    <p>${data.timestamp.toDate().toLocaleString()}</p>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error saat mengambil data history:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadHistory);
