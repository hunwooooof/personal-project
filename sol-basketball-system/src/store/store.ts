import { DocumentData, DocumentReference } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import { UserCredential, firebaseAuth } from '../utils/firebaseAuth';
import { db, doc, firestore } from '../utils/firestore';
import { KidType, UserType } from '../utils/types';

interface AccountType {
  name?: string;
  email: string;
  password: string;
}

interface StoreState {
  isLoading: boolean;
  setLoading: (boolean: boolean) => void;
  currentNav: string;
  setCurrentNav: (nav: string) => void;
  user: UserType;
  userRef: undefined | DocumentReference<DocumentData, DocumentData>;
  userID: undefined | string;
  kids: KidType[] | [];
  isLogin: boolean | 'undefined';
  nativeSignup: (account: AccountType) => void;
  nativeLogin: (account: AccountType) => void;
  googleLogin: () => void;
  checkLogIn: () => void;
  setLogOut: () => void;
  getUserProfile: (userRef: undefined | DocumentReference<DocumentData, DocumentData>) => object;
  scheduledDates: string[];
  getScheduledDates: (year: number, quarter: number) => void;
  saturdaySchedules: object[];
  getSaturdaySchedules: (year: number, quarter: number) => void;
  hasNotification: boolean;
  setNotification: (boolean: boolean) => void;
}

const defaultPhotoURL =
  'https://firebasestorage.googleapis.com/v0/b/sol-basketball.appspot.com/o/default-avatar-profile.png?alt=media&token=2ca8bd76-a025-4b94-a2f6-d5d39210289c';

const initialProfile = (user: UserCredential['user'], name?: string | undefined) => {
  return {
    photoURL: user.photoURL || defaultPhotoURL,
    email: user.email,
    kids: [],
    displayName: name || user.displayName || undefined,
    phoneNumber: user.phoneNumber,
    registrationDate: user.metadata.creationTime,
    role: 'user',
  };
};

export const useStore = create<StoreState>((set) => ({
  isLoading: true,
  setLoading: (boolean: boolean) => set(() => ({ isLoading: boolean })),
  currentNav: '',
  setCurrentNav: (nav: string) => set(() => ({ currentNav: nav })),
  user: {},
  userRef: undefined,
  userID: undefined,
  kids: [],
  nativeSignup: (account: AccountType) => {
    const { email, password } = account;
    const name = account.name?.trim();
    firebaseAuth
      .createUserWithEmailAndPassword(email.trim(), password.trim())
      .then((user) => {
        firebaseAuth.updateProfile(name as string, defaultPhotoURL);
        firestore.setDoc('users', user.uid, initialProfile(user, name));
        set(() => ({ userRef: doc(db, 'users', user.uid) }));
        set(() => ({ userID: user.uid }));
        set(() => ({ isLogin: true }));
        set(() => ({ currentNav: 'schedules' }));
      })
      .catch((error) => {
        if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
          toast.error('The email address is already registered. Please use a different email.');
        } else {
          toast.error('Account registration failed. Please check your information and try again.');
        }
      })
      .finally(() => set(() => ({ isLoading: false })));
  },
  nativeLogin: (account: AccountType) => {
    const { email, password } = account;
    firebaseAuth
      .signInWithEmailAndPassword(email.trim(), password.trim())
      .then((user) => {
        set(() => ({ user: user as UserType }));
        set(() => ({ isLogin: true }));
        set(() => ({ userRef: doc(db, 'users', user.uid) }));
        set(() => ({ userID: user.uid }));
        set(() => ({ currentNav: 'schedules' }));
        toast.success(`Hi ${user.displayName}, welcome back!`, { icon: '😸' });
      })
      .catch(() => {
        toast.error('Wrong email or password');
      })
      .finally(() => set(() => ({ isLoading: false })));
  },
  googleLogin: () => {
    firebaseAuth
      .signInWithPopup()
      .then((user) => {
        set(() => ({ userRef: doc(db, 'users', user.uid) }));
        set(() => ({ userID: user.uid }));
        firestore
          .getDoc('users', user.uid)
          .then((userDoc) => {
            if (userDoc) {
              set(() => ({ user: userDoc }));
            } else {
              firestore.setDoc('users', user.uid, initialProfile(user));
              set(() => ({ user: initialProfile(user) as UserType }));
              set(() => ({ currentNav: 'schedules' }));
            }
          })
          .then(() => {
            set(() => ({ isLogin: true }));
            toast.success('Account registered successfully!');
          });
      })
      .catch((error) => console.error(error));
  },
  isLogin: 'undefined',
  checkLogIn: () => {
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        set(() => ({ user: user as UserType }));
        set(() => ({ isLogin: true }));
        set(() => ({ userRef: doc(db, 'users', user.uid) }));
        set(() => ({ userID: user.uid }));
        set(() => ({ isLoading: false }));
      } else {
        set(() => ({ isLogin: false }));
        set(() => ({ isLoading: false }));
      }
    });
  },
  setLogOut: async () => {
    firebaseAuth
      .signOut(() => {
        set(() => ({ isLogin: false }));
        set(() => ({ user: {} }));
        set(() => ({ userRef: undefined }));
        set(() => ({ userID: undefined }));
      })
      .then(() => toast.success('See you. Have a great day!', { icon: '👋🏻' }));
  },
  getUserProfile: async (userRef) => {
    const profile = await firestore.getDocByRef(userRef as DocumentReference<DocumentData, DocumentData>);
    if (profile) {
      set(() => ({ user: profile }));
      const kids: KidType[] = [];
      for (const kidRef of profile.kids) {
        const kid = await firestore.getDocByRef(kidRef);
        if (kid) kids.push(kid as KidType);
      }
      set(() => ({ kids: kids }));
      return profile;
    }
  },
  scheduledDates: [],
  getScheduledDates: async (year, quarter) => {
    const schedule = await firestore.getDoc('schedule', `${year}Q${quarter}`);
    if (schedule) set(() => ({ scheduledDates: schedule.all }));
  },
  saturdaySchedules: [],
  getSaturdaySchedules: async (year, quarter) => {
    const saturdaySchedules = await firestore.getDocs('schedule', `${year}Q${quarter}`, 'saturday');
    set(() => ({ saturdaySchedules: saturdaySchedules as object[] }));
  },
  hasNotification: false,
  setNotification: (boolean: boolean) => set(() => ({ hasNotification: boolean })),
}));
