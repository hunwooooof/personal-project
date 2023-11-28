import { DocumentData, DocumentReference } from 'firebase/firestore';
import { create } from 'zustand';
import { UserCredential, firebaseAuth } from '../utils/firebaseAuth';
import { db, doc, firestore } from '../utils/firestore';

interface UserType {
  photoURL?: string;
  email?: string;
  kids?: DocumentReference<DocumentData, DocumentData>[];
  ordersRef?: DocumentReference<DocumentData, DocumentData>[];
  displayName?: string | undefined;
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
  userRef: undefined | DocumentReference<DocumentData, DocumentData>;
  kids: KidType[] | [];
  isLogin: boolean;
  nativeSignup: (account: AccountType) => void;
  nativeLogin: (account: AccountType) => void;
  googleLogin: () => void;
  checkLogIn: () => void;
  setLogOut: () => void;
  getUserProfile: (userRef: undefined | DocumentReference<DocumentData, DocumentData>) => object;
  // getKidsProfile: (kidsRef: DocumentReference<DocumentData, DocumentData>[]) => void;
  scheduledDates: string[];
  getScheduledDates: (year: number, quarter: number) => void;
  saturdaySchedules: object[];
  getSaturdaySchedules: (year: number, quarter: number) => void;
}

const solBasketballLogo =
  'https://firebasestorage.googleapis.com/v0/b/sol-basketball.appspot.com/o/sol-logo.jpg?alt=media&token=5f42ab2f-0c16-48f4-86dd-33c7db8d7496';

const initialProfile = (user: UserCredential['user'], name?: string | undefined) => {
  return {
    photoURL: user.photoURL || solBasketballLogo,
    email: user.email,
    kids: [],
    displayName: name || user.displayName || undefined,
    phoneNumber: user.phoneNumber,
    registrationDate: user.metadata.creationTime,
    role: 'user',
  };
};

export const useStore = create<StoreState>((set) => ({
  user: {},
  userRef: undefined,
  kids: [],
  nativeSignup: (account: AccountType) => {
    const { name, email, password } = account;
    firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        firebaseAuth.updateProfile(name as string, solBasketballLogo);
        firestore.setDoc('users', user.uid, initialProfile(user, name));
        set(() => ({ userRef: doc(db, 'users', user.uid) }));
        set(() => ({ isLogin: true }));
      })
      .catch((error: { code: number; message: string }) => {
        console.error(error.code, error.message);
      });
  },
  nativeLogin: (account: AccountType) => {
    const { email, password } = account;
    firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        set(() => ({ user: user as UserType }));
        set(() => ({ isLogin: true }));
        set(() => ({ userRef: doc(db, 'users', user.uid) }));
      })
      .catch((error) => console.error(error.code, error.message));
  },
  googleLogin: () => {
    firebaseAuth
      .signInWithPopup()
      .then((user) => {
        set(() => ({ userRef: doc(db, 'users', user.uid) }));
        firestore
          .getDoc('users', user.uid)
          .then((userDoc) => {
            if (userDoc) {
              set(() => ({ user: userDoc }));
            } else {
              firestore.setDoc('users', user.uid, initialProfile(user));
              set(() => ({ user: initialProfile(user) as UserType }));
            }
          })
          .then(() => set(() => ({ isLogin: true })));
      })
      .catch((error) => console.error(error));
  },
  isLogin: false,
  checkLogIn: () => {
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        set(() => ({ user: user as UserType }));
        set(() => ({ isLogin: true }));
        set(() => ({ userRef: doc(db, 'users', user.uid) }));
      }
    });
  },
  setLogOut: () => {
    firebaseAuth.signOut(() => {
      set(() => ({ isLogin: false }));
      set(() => ({ user: {} }));
      set(() => ({ userRef: undefined }));
    });
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
  // getKidsProfile: async (kidsRef) => {
  //   const kids: KidType[] = [];
  //   for (const kidRef of kidsRef) {
  //     const kid = await firestore.getDocByRef(kidRef);
  //     if (kid) kids.push(kid as KidType);
  //   }
  //   set(() => ({ kids: kids }));
  // },
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
}));
