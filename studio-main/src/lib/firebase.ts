import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  projectId: "doodlesnap-g1yib",
  appId: "1:228007560342:web:126f64a8788bb5c8a56eb7",
  storageBucket: "doodlesnap-g1yib.firebasestorage.app",
  apiKey: "AIzaSyDvYd3s-vkY7Ba4-SgiVWkyRF86hgiD8Ss",
  authDomain: "doodlesnap-g1yib.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "228007560342",
};

let app: FirebaseApp;
let auth: Auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);

// Configure auth settings for better reliability
if (typeof window !== 'undefined') {
  auth.useDeviceLanguage();
}

export { app, auth };
