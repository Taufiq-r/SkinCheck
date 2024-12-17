import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Signup Function
async function signup(username, password) {
    try {
        const usersRef = collection(db, "users");
        await addDoc(usersRef, { username, password });
        alert("Signup berhasil!");
    } catch (error) {
        console.error("Error saat signup:", error);
    }
}

// Login Function
async function login(username, password) {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username), where("password", "==", password));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            alert("Login berhasil!");
            window.location.href = "index.html";
        } else {
            alert("Username atau Password salah!");
        }
    } catch (error) {
        console.error("Error saat login:", error);
    }
}

// Event Listener untuk Form Login
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    login(username, password);
});

// Event Listener untuk Form Signup
document.getElementById("signupForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    signup(username, password);
});
