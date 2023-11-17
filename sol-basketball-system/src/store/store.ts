import { create } from 'zustand';
import {
  auth,
  createUserWithEmailAndPassword,
  db,
  signInWithCustomToken,
  signOut,
  signInWithEmailAndPassword,
  collection,
  addDoc,
  setDoc,
  doc,
} from '../utils/firebase';

interface AccountType {
  name?: string;
  email: string;
  password: string;
}

interface StoreState {
  user: object;
  token: string | null;
  // setToken: (token: string) => void;
  signup: (account: AccountType) => void;
  isLogin: boolean;
  // setLogIn: () => void;
  setLogOut: () => void;
  checkLoginStatus: (token: string) => void;
  nativeLogin: (account: AccountType) => void;
}

export const useStore = create<StoreState>((set) => ({
  user: {},
  token: '',
  // setToken: (token: string) => set(() => ({ token: token })),
  signup: (account: AccountType) => {
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
          photoURL: '',
          email: user.email,
          kids: [],
          displayName: user.displayName,
          phoneNumber: '',
          registrationDate: user.metadata.creationTime,
        };
        setFiresStoreDoc(user.uid, initialProfile);
      })
      .catch((error: { code: number; message: string }) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
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
  nativeLogin: (account: AccountType) => {
    const { email, password } = account;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: { user: any }) => {
        const { user } = userCredential;
        set(() => ({ isLogin: true }));
        set(() => ({ token: user.accessToken }));
        localStorage.setItem('jwtToken', user.accessToken);
        return user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  },
}));
