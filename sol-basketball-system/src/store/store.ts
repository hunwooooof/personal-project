import { DocumentData, DocumentReference } from 'firebase/firestore';
import { create } from 'zustand';
import {
  GoogleAuthProvider,
  auth,
  createUserWithEmailAndPassword,
  db,
  doc,
  getDoc,
  onAuthStateChanged,
  provider,
  setDoc,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from '../utils/firebase';

interface UserType {
  photoURL?: string;
  email?: string;
  kids?: [];
  displayName?: string;
  phoneNumber?: string;
  registrationDate?: string;
  role?: string;
}

interface KidType {
  docId: string;
  birthday: string;
  chineseName: string;
  firstName: string;
  id: string;
  lastName: string;
  school: string;
  photoURL?: string;
}

interface AccountType {
  name?: string;
  email: string;
  password: string;
}

interface StoreState {
  user: UserType;
  setUser: (data: object) => void;
  userRef: undefined | DocumentReference<DocumentData, DocumentData>;
  kids: KidType[] | [];
  kidsRef: undefined | DocumentReference<DocumentData, DocumentData>[];
  isLogin: boolean;
  nativeSignup: (account: AccountType) => void;
  nativeLogin: (account: AccountType) => void;
  googleSignup: () => void;
  googleLogin: () => void;
  checkLogIn: () => void;
  setLogOut: () => void;
  getUserProfile: (userRef: undefined | DocumentReference<DocumentData, DocumentData>) => object;
  getKidsProfile: (kidsRef: DocumentReference<DocumentData, DocumentData>[]) => void;
}

export const useStore = create<StoreState>((set) => ({
  user: {},
  setUser: (data: object) => set(() => ({ user: data })),
  userRef: undefined,
  kids: [],
  kidsRef: undefined,
  nativeSignup: (account: AccountType) => {
    const photo =
      'https://firebasestorage.googleapis.com/v0/b/sol-basketball.appspot.com/o/sol-logo.jpg?alt=media&token=5f42ab2f-0c16-48f4-86dd-33c7db8d7496';
    const { name, email, password } = account;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: { user: any }) => {
        const { user } = userCredential;
        console.log(user);
        set(() => ({ isLogin: true }));
        updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: photo,
        })
          .then(() => {
            console.log('Profile updated!');
          })
          .catch((error) => {
            console.error(error);
          });
        localStorage.setItem('jwtToken', user.accessToken);
        return user;
      })
      .then((user) => {
        const initialProfile = {
          photoURL: photo,
          email: user.email,
          kids: [],
          displayName: name,
          phoneNumber: user.phoneNumber,
          registrationDate: user.metadata.creationTime,
          role: 'user',
        };
        setDoc(doc(db, 'users', user.uid), initialProfile);
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
        set(() => ({ user: user }));
        set(() => ({ isLogin: true }));
        set(() => ({ userRef: doc(db, 'users', user.uid) }));
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
        set(() => ({ user: user }));
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
        // set(() => ({ token: user.accessToken }));
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
        set(() => ({ isLogin: true }));
        const { user } = result;
        return user;
      })
      .then((user) => {
        // set(() => ({ user: user }));
        // set(() => ({ token: user.accessToken }));
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
  checkLogIn: () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        set(() => ({ isLogin: true }));
        set(() => ({ userRef: doc(db, 'users', user.uid) }));
      } else {
        // User is signed out
      }
    });
  },
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
  getUserProfile: async (userRef) => {
    if (userRef) {
      const profileSnap = await getDoc(userRef);
      if (profileSnap) {
        const profile = profileSnap.data();
        set(() => ({ user: profile }));
        const kids = [];
        for (const kidRef of profile.kids) {
          const kidSnap = await getDoc(kidRef);
          if (kidSnap.exists()) {
            const kid = kidSnap.data();
            kids.push(kid);
          }
        }
        set(() => ({ kids: kids }));
        // set(() => ({ kidsRef: profile.kids }));
        return profile;
      }
    }
  },
  getKidsProfile: async (kidsRef) => {
    const kids = [];
    for (const kidRef of kidsRef) {
      const kidSnap = await getDoc(kidRef);
      if (kidSnap.exists()) {
        const kid = kidSnap.data();
        kids.push(kid);
      }
    }
    set(() => ({ kids: kids }));
  },
}));
