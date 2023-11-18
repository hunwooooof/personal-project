import { create } from 'zustand';
import {
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
} from '../utils/firebase';
import { DocumentData, DocumentReference } from 'firebase/firestore';

interface UserType {
  photoURL?: string;
  email?: string;
  kids?: [];
  displayName?: string;
  phoneNumber?: string;
  registrationDate?: string;
  role?: string;
}

interface AccountType {
  name?: string;
  email: string;
  password: string;
}

interface StoreState {
  user: UserType;
  userRef: any;
  setUserProfile: (data: object) => void;
  token: string | null;
  isLogin: boolean;
  // setToken: (token: string) => void;
  nativeSignup: (account: AccountType) => void;
  nativeLogin: (account: AccountType) => void;
  googleSignup: () => void;
  googleLogin: () => void;
  // setLogIn: () => void;
  setLogOut: () => void;
  checkLoginStatus: (token: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  user: {},
  userRef: DocumentReference<DocumentData, DocumentData>,
  setUserProfile: (data: object) => set(() => ({ user: data })),
  token: '',
  // setToken: (token: string) => set(() => ({ token: token })),
  nativeSignup: (account: AccountType) => {
    const { email, password } = account;
    async function setFiresStoreDoc(uid: any, profile: object) {
      await setDoc(doc(db, 'users', uid), profile);
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: { user: any }) => {
        const { user } = userCredential;
        console.log(user);
        set(() => ({ isLogin: true }));
        set(() => ({ token: user.accessToken }));
        localStorage.setItem('jwtToken', user.accessToken);
        return user;
      })
      .then((user) => {
        console.log(user);
        const initialProfile = {
          photoURL: user.photoURL,
          email: user.email,
          kids: [],
          displayName: user.displayName,
          phoneNumber: user.phoneNumber,
          registrationDate: user.metadata.creationTime,
          role: 'user',
        };
        setFiresStoreDoc(user.uid, initialProfile);
        set(() => ({ userRef: doc(db, 'users', user.uid) }));
      })
      .catch((error: { code: number; message: string }) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  },
  nativeLogin: (account: AccountType) => {
    const { email, password } = account;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: { user: any }) => {
        const { user } = userCredential;
        set(() => ({ isLogin: true }));
        set(() => ({ token: user.accessToken }));
        set(() => ({ userRef: doc(db, 'users', user.uid) }));
        localStorage.setItem('jwtToken', user.accessToken);
        return user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  },
  googleSignup: () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        set(() => ({ isLogin: true }));
        const { user } = result;
        return user;
      })
      .then((user) => {
        console.log(user);
        const initialProfile = {
          photoURL: user.photoURL,
          email: user.email,
          kids: [],
          displayName: user.displayName,
          phoneNumber: user.phoneNumber,
          registrationDate: user.metadata.creationTime,
          role: 'user',
        };
        setDoc(doc(db, 'users', user.uid), initialProfile);
        set(() => ({ token: user.accessToken }));
        set(() => ({ userRef: doc(db, 'users', user.uid) }));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  },
  googleLogin: () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        set(() => ({ isLogin: true }));
        const { user } = result;
        return user;
      })
      .then((user) => {
        set(() => ({ token: user.accessToken }));
        set(() => ({ userRef: doc(db, 'users', user.uid) }));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  },
  isLogin: false,
  // setLogIn: () => set(() => ({ isLogin: true })),
  setLogOut: () => {
    signOut(auth)
      .then(() => {
        console.log('Sign-out successful');
        set(() => ({ isLogin: false }));
        localStorage.removeItem('jwtToken');
      })
      .catch((error) => {
        console.log(error);
      });
  },
  checkLoginStatus: (token) => {
    signInWithCustomToken(auth, token)
      .then((userCredential: { user: any }) => {
        const { user } = userCredential;
        console.log(user);
        set(() => ({ isLogin: true }));
        set(() => ({ token: user.accessToken }));
        localStorage.setItem('jwtToken', user.accessToken);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
        localStorage.removeItem('jwtToken');
      });
  },
}));
