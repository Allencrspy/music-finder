import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPXgZzUL6DbAW-XLoNkPBxbXRQljvXhz4",
  authDomain: "music-finder-bbb3f.firebaseapp.com",
  projectId: "music-finder-bbb3f",
  storageBucket: "music-finder-bbb3f.firebasestorage.app",
  messagingSenderId: "6868180510",
  appId: "1:6868180510:web:ff8101cddab9a54d34180f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
