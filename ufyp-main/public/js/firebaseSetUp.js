// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADFiIFL9oylTVVhu0dJ2d9wqC5PndOQ4s",
  authDomain: "ufyp-a18cf.firebaseapp.com",
  projectId: "ufyp-a18cf",
  storageBucket: "ufyp-a18cf.appspot.com",
  messagingSenderId: "354716187513",
  appId: "1:354716187513:web:026a61e2667db9eef14da8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Init services
const firestore = getFirestore(app);
const auth = getAuth(app);
export {firestore,auth,signInWithEmailAndPassword,signOut};

// export const serviceAccount = require("../adminKey/serviceAccountKey.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

