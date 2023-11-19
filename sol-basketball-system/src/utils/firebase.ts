import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, collection, addDoc, setDoc, doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

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
const storage = getStorage(app);

export {
  auth,
  createUserWithEmailAndPassword,
  db,
  signInWithCustomToken,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  provider,
  collection,
  addDoc,
  setDoc,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
};
