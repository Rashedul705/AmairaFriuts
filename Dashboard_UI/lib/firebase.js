import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD0z5iuTsEfx_GCpY0_rU0FFW1IwHUC_E8",
  authDomain: "amaira-fruits.firebaseapp.com",
  projectId: "amaira-fruits",
  storageBucket: "amaira-fruits.firebasestorage.app",
  messagingSenderId: "867968665087",
  appId: "1:867968665087:web:06dbe950f59f87a5f793ca",
  measurementId: "G-KX6974LP17"
};

// Prevent duplicate initialization during hot reloads
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

let analytics = null;
if (typeof window !== "undefined") {
  // analytics only runs on client side (browser)
  analytics = getAnalytics(app);
}

export { auth, analytics };
