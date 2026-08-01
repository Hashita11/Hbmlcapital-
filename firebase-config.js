import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAZ3Rm_gyY8RgUJUI_AqxeCFpYJIAaWGsk",
  authDomain: "hbml-capital.firebaseapp.com",
  projectId: "hbml-capital",
  storageBucket: "hbml-capital.firebasestorage.app",
  messagingSenderId: "893969951538",
  appId: "1:893969951538:web:ba028463a6adcfb417c52b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
