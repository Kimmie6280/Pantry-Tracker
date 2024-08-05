// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqgtX0FmHf_W_y8gKbXgAgZtHlSZthFyM",
  authDomain: "inventory-management-b7102.firebaseapp.com",
  projectId: "inventory-management-b7102",
  storageBucket: "inventory-management-b7102.appspot.com",
  messagingSenderId: "446446175471",
  appId: "1:446446175471:web:635a39e53f17797bebc71a",
  measurementId: "G-29K4V5NPVF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore }