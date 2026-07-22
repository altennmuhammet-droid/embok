import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDZu8XlDTEf03Pk2h6OMWzQaAppIUITYvk",
  authDomain: "embok-app.firebaseapp.com",
  databaseURL: "https://embok-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "embok-app",
  storageBucket: "embok-app.firebasestorage.app",
  messagingSenderId: "448185557103",
  appId: "1:448185557103:web:5070b574a134c436d76d9a"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
