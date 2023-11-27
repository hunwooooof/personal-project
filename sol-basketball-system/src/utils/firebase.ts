import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

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

const firestoreApi = {
  updateDocWithObject: async (
    collection1: string,
    document1: string,
    field: string,
    content: string,
    collection2?: string,
    document2?: string,
  ) => {
    if (!collection2 || !document2)
      await updateDoc(doc(db, collection1, document1), {
        [field]: content,
      });
    if (collection2 && document2)
      await updateDoc(doc(db, collection1, document1, collection2, document2), {
        [field]: content,
      });
  },
  updateDocArrayUnion: async (
    collection1: string,
    document1: string,
    field: string,
    content: string | object,
    collection2?: string,
    document2?: string,
  ) => {
    if (!collection2 || !document2)
      await updateDoc(doc(db, collection1, document1), {
        [field]: arrayUnion(content),
      });
    if (collection2 && document2)
      await updateDoc(doc(db, collection1, document1, collection2, document2), {
        [field]: arrayUnion(content),
      });
  },
  updateDocArrayRemove: async (
    collection1: string,
    document1: string,
    field: string,
    content: string | object,
    collection2?: string,
    document2?: string,
  ) => {
    if (!collection2 || !document2)
      await updateDoc(doc(db, collection1, document1), {
        [field]: arrayRemove(content),
      });
    if (collection2 && document2)
      await updateDoc(doc(db, collection1, document1, collection2, document2), {
        [field]: arrayRemove(content),
      });
  },
  updateDocIncrement: async (
    collection1: string,
    document1: string,
    field: string,
    content: number,
    collection2?: string,
    document2?: string,
  ) => {
    if (!collection2 || !document2)
      await updateDoc(doc(db, collection1, document1), {
        [field]: increment(content),
      });
    if (collection2 && document2)
      await updateDoc(doc(db, collection1, document1, collection2, document2), {
        [field]: increment(content),
      });
  },
};

export {
  GoogleAuthProvider,
  addDoc,
  arrayRemove,
  arrayUnion,
  auth,
  collection,
  createUserWithEmailAndPassword,
  db,
  deleteDoc,
  deleteObject,
  doc,
  firestoreApi,
  getDoc,
  getDocs,
  getDownloadURL,
  increment,
  onAuthStateChanged,
  provider,
  ref,
  serverTimestamp,
  setDoc,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  storage,
  updateDoc,
  updateProfile,
  uploadBytes,
};
export type { UserCredential };
