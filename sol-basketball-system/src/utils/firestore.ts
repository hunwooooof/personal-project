import { initializeApp } from 'firebase/app';
import {
  DocumentData,
  DocumentReference,
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
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

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
const db = getFirestore(app);

const firestore = {
  setDoc: async (collection1: string, document1: string, content: object, collection2?: string, document2?: string) => {
    if (!collection2 || !document2) {
      await setDoc(doc(db, collection1, document1), content);
    }
    if (collection2 && document2) {
      await setDoc(doc(db, collection1, document1, collection2, document2), content);
    }
  },
  getDoc: async (collection1: string, document1: string, collection2?: string, document2?: string) => {
    if (!collection2 || !document2) {
      const docSnap = await getDoc(doc(db, collection1, document1));
      return docSnap.data();
    }
    if (collection2 && document2) {
      const docSnap = await getDoc(doc(db, collection1, document1, collection2, document2));
      return docSnap.data();
    }
  },
  getDocByRef: async (ref: DocumentReference<DocumentData, DocumentData>) => {
    const docSnap = await getDoc(ref);
    return docSnap.data();
  },
  getDocs: async (collection1: string, document1?: string, collection2?: string) => {
    if (!document1 || !collection2) {
      const collectionSnap = await getDocs(collection(db, collection1));
      const docArray: object[] = [];
      collectionSnap.forEach((docSnap) => {
        docArray.push(docSnap.data());
      });
      return docArray;
    }
    if (document1 && collection2) {
      const collectionSnap = await getDocs(collection(db, collection1, document1, collection2));
      const docArray: object[] = [];
      collectionSnap.forEach((docSnap) => {
        docArray.push(docSnap.data());
      });
      return docArray;
    }
  },
  updateDoc: async (
    collection1: string,
    document1: string,
    content: object,
    collection2?: string,
    document2?: string,
  ) => {
    if (!collection2 || !document2) await updateDoc(doc(db, collection1, document1), content);
    if (collection2 && document2) await updateDoc(doc(db, collection1, document1, collection2, document2), content);
  },
  updateDocByRef: async (ref: DocumentReference<DocumentData, DocumentData>, content: object) => {
    await updateDoc(ref, content);
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
  updateDocArrayUnionByRef: async (
    ref: DocumentReference<DocumentData, DocumentData>,
    field: string,
    content: string | object,
  ) => {
    await updateDoc(ref, { [field]: arrayUnion(content) });
  },
  updateDocArrayRemoveByRef: async (
    ref: DocumentReference<DocumentData, DocumentData>,
    field: string,
    content: string | object,
  ) => {
    await updateDoc(ref, { [field]: arrayRemove(content) });
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
  deleteDoc: async (collection1: string, document1: string, collection2?: string, document2?: string) => {
    if (!collection2 || !document2) {
      await deleteDoc(doc(db, collection1, document1));
    }
    if (collection2 && document2) {
      await deleteDoc(doc(db, collection1, document1, collection2, document2));
    }
  },
};

export { addDoc, collection, db, doc, firestore, increment, onSnapshot, serverTimestamp };
