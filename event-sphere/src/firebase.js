import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBiJV9zStRzd87ehWifEMuXsxaXjqOv_-0",
  authDomain: "eventsphere-f15be.firebaseapp.com",
  projectId: "eventsphere-f15be",
  storageBucket: "eventsphere-f15be.firebasestorage.app",
  messagingSenderId: "225239701824",
  appId: "1:225239701824:web:0646f7b3b73ddb8d15c2a5",
  measurementId: "G-18G1VW76Z7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);