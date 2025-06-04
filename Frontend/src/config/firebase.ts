import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  // TODO: Replace with your Firebase config
  apiKey: "AIzaSyA3xQoe37N5Q_D-NyBCFH9FhH-9Svk2XBs",
  authDomain: "note-taking-app-f901e.firebaseapp.com",
  projectId: "note-taking-app-f901e",
  storageBucket: "note-taking-app-f901e.firebasestorage.app",
  messagingSenderId: "546884839557",
  appId: "1:546884839557:web:c072ab424f69d8bec921ec",
  measurementId: "G-1PN4CVXE1T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { app, auth, googleProvider, analytics }; 