import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { getFirestore, collection, addDoc, setDoc, doc, updateDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBw9iJkTFrgb3C3dVGcAUDRnzs8Afa7Ydc',
  authDomain: 'sol-basketball.firebaseapp.com',
  projectId: 'sol-basketball',
  storageBucket: 'sol-basketball.appspot.com',
  messagingSenderId: '401302748123',
  appId: '1:401302748123:web:49124de66b9fc817d8c5fe',
  measurementId: 'G-5270LP7KDH',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export {
  auth,
  createUserWithEmailAndPassword,
  db,
  signInWithCustomToken,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  provider,
  collection,
  addDoc,
  setDoc,
  doc,
  updateDoc,
  getDoc,
};
