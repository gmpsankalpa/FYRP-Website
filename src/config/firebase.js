// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// Replace with your actual Firebase project credentials
export const firebaseConfig = {
    apiKey: "AIzaSyCmhTPSedwDK6BbxlEJQ6Bkiloe5QQYLJQ",
    authDomain: "fyp-app-36589.firebaseapp.com",
    projectId: "fyp-app-36589",
    storageBucket: "fyp-app-36589.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "1:149453270995:android:f07c6114b59d4b7adc4926",
    measurementId: "YOUR_MEASUREMENT_ID"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;
