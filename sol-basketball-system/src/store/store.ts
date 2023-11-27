import { DocumentData, DocumentReference, collection } from 'firebase/firestore';
import { create } from 'zustand';
import {
  UserCredential,
  auth,
  createUserWithEmailAndPassword,
  db,
  doc,
  getDoc,
  getDocs,
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
  kids?: DocumentReference<DocumentData, DocumentData>[];
  ordersRef?: DocumentReference<DocumentData, DocumentData>[];
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
  scheduledDates: string[];
  getScheduledDates: (year: number, quarter: number) => void;
  saturdaySchedules: object[];
  getSaturdaySchedules: (year: number, quarter: number) => void;
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
      .then((userCredential: UserCredential) => {
        const { user } = userCredential;
        console.log(typeof user);

        set(() => ({ isLogin: true }));
        if (auth.currentUser)
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
      .then((userCredential: UserCredential) => {
        const { user } = userCredential;
        set(() => ({ user: user as UserType }));
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
        set(() => ({ isLogin: true }));
        const { user } = result;
        return user;
      })
      .then((user) => {
        console.log(user);
        set(() => ({ user: user as UserType }));
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
        set(() => ({ userRef: doc(db, 'users', user.uid) }));
      })
      .catch((error) => {
        console.error(error);
      });
  },
  googleLogin: () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const { user } = result;
        return user;
      })
      .then((user) => {
        getDoc(doc(db, 'users', user.uid)).then((userSnap) => {
          const userDoc = userSnap.data();
          if (userDoc) {
            set(() => ({ userRef: doc(db, 'users', user.uid) }));
            set(() => ({ isLogin: true }));
          } else {
            const initialProfile = {
              photoURL: user.photoURL,
              email: user.email,
              kids: [],
              displayName: user.displayName,
              phoneNumber: user.phoneNumber,
              registrationDate: user.metadata.creationTime,
              role: 'user',
            };
            set(() => ({ user: initialProfile as UserType }));
            set(() => ({ isLogin: true }));
            setDoc(doc(db, 'users', user.uid), initialProfile);
            set(() => ({ userRef: doc(db, 'users', user.uid) }));
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
  },
  isLogin: false,
  checkLogIn: () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        set(() => ({ user: user as UserType }));
        set(() => ({ isLogin: true }));
        set(() => ({ userRef: doc(db, 'users', user.uid) }));
      }
    });
  },
  setLogOut: () => {
    signOut(auth)
      .then(() => {
        console.log('Sign-out successful');
        set(() => ({ isLogin: false }));
        set(() => ({ user: {} }));
        set(() => ({ userRef: undefined }));
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
        const kids: KidType[] = [];
        if (profile)
          for (const kidRef of profile.kids) {
            const kidSnap = await getDoc(kidRef);
            if (kidSnap.exists()) {
              const kid = kidSnap.data();
              kids.push(kid as KidType);
            }
          }
        set(() => ({ kids: kids }));
        return profile;
      }
    }
  },
  getKidsProfile: async (kidsRef) => {
    const kids: KidType[] = [];
    for (const kidRef of kidsRef) {
      const kidSnap = await getDoc(kidRef);
      if (kidSnap.exists()) {
        const kid = kidSnap.data();
        kids.push(kid as KidType);
      }
    }
    set(() => ({ kids: kids }));
  },
  scheduledDates: [],
  getScheduledDates: async (year, quarter) => {
    const schedule = (await getDoc(doc(db, 'schedule', `${year}Q${quarter}`))).data();
    if (schedule) {
      set(() => ({ scheduledDates: schedule.all }));
    }
  },
  saturdaySchedules: [],
  getSaturdaySchedules: async (year, quarter) => {
    const saturdaySchedulesSnapshot = await getDocs(collection(db, 'schedule', `${year}Q${quarter}`, 'saturday'));
    const saturdaySchedules: object[] = [];
    saturdaySchedulesSnapshot.forEach((doc) => {
      saturdaySchedules.push(doc.data());
    });
    set(() => ({ saturdaySchedules: saturdaySchedules as object[] }));
  },
}));
