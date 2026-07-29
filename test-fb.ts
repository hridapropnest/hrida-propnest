import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgc8fqxwPVewdrnxKVaQOSF4FW9xsxM-k",
  authDomain: "hrida-propnest-94af6.firebaseapp.com",
  projectId: "hrida-propnest-94af6",
  storageBucket: "hrida-propnest-94af6.firebasestorage.app",
  messagingSenderId: "487337081459",
  appId: "1:487337081459:web:82408e75f0b0dda80b0806",
  measurementId: "G-MW30150DDS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function runTest() {
  const testId = "test-doc-" + Date.now();
  try {
    console.log("1. Writing test document:", testId);
    await setDoc(doc(db, "properties", testId), { test: true });
    console.log("Write SUCCESS");
  } catch (e: any) {
    console.error("Write FAILED:", e.message);
    return;
  }

  try {
    console.log("2. Deleting test document:", testId);
    await deleteDoc(doc(db, "properties", testId));
    console.log("Delete SUCCESS");
  } catch (e: any) {
    console.error("Delete FAILED:", e.message);
  }
}

runTest();
