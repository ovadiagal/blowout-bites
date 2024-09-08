// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmJjVE27N0o7FQZI0HUiQYzjLTGQyGY7w",
  authDomain: "blowout-bites-d3630.firebaseapp.com",
  projectId: "blowout-bites-d3630",
  storageBucket: "blowout-bites-d3630.appspot.com",
  messagingSenderId: "1013343615865",
  appId: "1:1013343615865:web:5c840e0a0e940a27cc4da8",
  measurementId: "G-RY36SX5E83",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
