import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBt0bKVk3kXOLGWLF0ddDRmIVmJueqOLlg",
  authDomain: "bingo-en-vivo-96609.firebaseapp.com",
  projectId: "bingo-en-vivo-96609",
  storageBucket: "bingo-en-vivo-96609.firebasestorage.app",
  messagingSenderId: "628350597288",
  appId: "1:628350597288:web:8f2e703f45d65d5b0dea9d",
  measurementId: "G-6NLHP3QKD3",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);