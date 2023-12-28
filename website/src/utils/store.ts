import { create } from 'zustand';

type Store = {
  currentNav: string;
  setCurrentNav: (nav: string) => void;
};

const useStore = create<Store>()((set) => ({
  currentNav: '',
  setCurrentNav: (nav) => set(() => ({ currentNav: nav })),
}));

export { useStore };
