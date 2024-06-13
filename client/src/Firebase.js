// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// console.log(import.meta.env.VITE_API_KEY)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "bytestories-333ff.firebaseapp.com",
  projectId: "bytestories-333ff",
  storageBucket: "bytestories-333ff.appspot.com",
  messagingSenderId: "9562895141",
  appId: "1:9562895141:web:41f0b91918bfe5749be0cc",
  measurementId: "G-7W1KVZ0BDM"
  
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);