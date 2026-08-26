import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBqADeNRskCLl08A9f-PUqKNn8gRXNAoJk",
  authDomain: "apx-00.firebaseapp.com",
  databaseURL: "https://apx-00-default-rtdb.firebaseio.com",
  projectId: "apx-00",
  storageBucket: "apx-00.firebasestorage.app",
  messagingSenderId: "218040577378",
  appId: "1:218040577378:web:3847c4b8d070a881b4103b",
  measurementId: "G-JSFLJ8EG6E",
});
export const dataBase = getDatabase(firebaseApp);
