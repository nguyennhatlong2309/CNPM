// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD40x5-3JvEqh6t5d0B7cbgAeZTABKKu8A",
  authDomain: "doan-cnpm-478500.firebaseapp.com",
  projectId: "doan-cnpm-478500",
  storageBucket: "doan-cnpm-478500.firebasestorage.app",
  messagingSenderId: "634927846390",
  appId: "1:634927846390:web:10862d439cbf02e014edd7",
  measurementId: "G-T1MLXW16DT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
