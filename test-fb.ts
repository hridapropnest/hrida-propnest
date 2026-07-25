import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc } from "firebase/firestore";

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

async function test() {
  try {
    const snap = await getDocs(collection(db, "properties"));
    console.log("Read success, docs:", snap.size);
    const testId = "test-" + Date.now();
    await setDoc(doc(db, "properties", testId), { test: true });
    console.log("Write success for", testId);
  } catch (e) {
    console.error("Firebase Error:", e.message);
  }
}
test();
