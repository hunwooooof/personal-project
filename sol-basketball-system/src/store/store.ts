import { create } from 'zustand';
import { auth, createUserWithEmailAndPassword } from '../utils/firebase';

interface accountType {
  name: string;
  email: string;
  password: string;
}

interface storeState {
  user: object;
  token: string;
  signup: (account: accountType) => void;
}

export const useStore = create<storeState>((set) => ({
  user: {},
  token: '',
  setToken: (token: string) => set(() => ({ token: token })),
  signup: (account: accountType) => {
    const { email, password } = account;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: { user: object }) => {
        const { user } = userCredential;
        console.log(user);
      })
      .catch((error: { code: number; message: string }) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  },
}));
