import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgc8fqxwPVewdrnxKVaQOSF4FW9xsxM-k",
  authDomain: "hrida-propnest-94af6.firebaseapp.com",
  projectId: "hrida-propnest-94af6",
  storageBucket: "hrida-propnest-94af6.firebasestorage.app",
  messagingSenderId: "487337081459",
  appId: "1:487337081459:web:82408e75f0b0dda80b0806",
  measurementId: "G-MW30150DDS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
