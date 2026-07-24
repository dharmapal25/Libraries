// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC38p6LvmyJkMF-PhooyAD_DcidIwY2kAI",
    authDomain: "fir-project-d9b16.firebaseapp.com",
    projectId: "fir-project-d9b16",
    storageBucket: "fir-project-d9b16.firebasestorage.app",
    messagingSenderId: "302609753350",
    appId: "1:302609753350:web:e176aef993729e28c2ea87",

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

