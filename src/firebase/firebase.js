// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAObUDbbaHLU4hH5C-WfEaimNTnlEUd2FU",
  authDomain: "disease-diagnostics.firebaseapp.com",
  databaseURL: "https://disease-diagnostics-default-rtdb.firebaseio.com",
  projectId: "disease-diagnostics",
  storageBucket: "disease-diagnostics.appspot.com",
  messagingSenderId: "252970665431",
  appId: "1:252970665431:web:84b0a776b059ff91d53792",
  measurementId: "G-FY91RYPYRD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
