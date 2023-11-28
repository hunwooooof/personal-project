import { initializeApp } from 'firebase/app';
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
const storage = getStorage(app);

const firebaseStorage = {
  uploadAndGetDownloadURL: async (storageReferenceRoot: string, img: File) => {
    await uploadBytes(ref(storage, storageReferenceRoot), img);
    const url = await getDownloadURL(ref(storage, storageReferenceRoot));
    return url;
  },
};

export { deleteObject, firebaseStorage, getDownloadURL, ref, storage, uploadBytes };
