import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  NextOrObserver,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';

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
const provider = new GoogleAuthProvider();

const firebaseAuth = {
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    return user;
  },
  signInWithEmailAndPassword: async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    return user;
  },
  signInWithPopup: async () => {
    const result = await signInWithPopup(auth, provider);
    const { user } = result;
    return user;
  },
  signOut: async (callback: () => void) => {
    try {
      await signOut(auth);
      console.log('Sign-out successful');
      callback();
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  },
  onAuthStateChanged: async (nextOrObserver: NextOrObserver<User>) => {
    onAuthStateChanged(auth, nextOrObserver);
  },
  updateProfile: (displayName: string, photoURL: string) => {
    updateProfile(auth.currentUser as User, {
      displayName: displayName,
      photoURL: photoURL,
    })
      .then(() => console.log('Profile updated!'))
      .catch((error) => console.error(error));
  },
};

export { firebaseAuth };
export type { UserCredential };
