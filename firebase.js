import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js"; // ⬅️

const firebaseConfig = {
  apiKey: "AIzaSyCZogItZ4fie_KYt4yDEoXA-QOABTOtgx8",
  authDomain: "vision-4081b.firebaseapp.com",
  projectId: "vision-4081b",
  storageBucket: "vision-4081b.firebasestorage.app",
  messagingSenderId: "1004750418938",
  appId: "1:1004750418938:web:faa3a33acd74d43ac46a43",
  measurementId: "G-F3MPD7GF8R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);