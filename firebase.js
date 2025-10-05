// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgFApXFuOHhHu6rDbv431KBU0E9oK_mGo",
  authDomain: "mystore-457c4.firebaseapp.com",
  projectId: "mystore-457c4",
  storageBucket: "mystore-457c4.firebasestorage.app",
  messagingSenderId: "530801626731",
  appId: "1:530801626731:web:fd83344aa6c5063b0aab2e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a Firestore instance
export const db = getFirestore(app);