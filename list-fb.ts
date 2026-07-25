import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
  const snap = await getDocs(collection(db, "properties"));
  console.log("Total docs:", snap.size);
  snap.forEach(d => console.log(d.id, "=>", d.data().name, d.data().purpose));
}
test();
