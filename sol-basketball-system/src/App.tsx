import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { NextUIProvider } from '@nextui-org/react';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useStore } from './store/store';
import { collection, db, onSnapshot } from './utils/firestore';

function App() {
  const { isLogin, userRef, checkLogIn, getUserProfile, setNotification } = useStore();

  useEffect(() => {
    checkLogIn();
    if (isLogin) {
      getUserProfile(userRef);
    }
  }, [isLogin]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'messages'), (docSnaps) => {
      const docArray: boolean[] = [];
      docSnaps.forEach((docSnap) => {
        docArray.push(docSnap.data().unread);
      });
      if (docArray.includes(true)) {
        setNotification(true);
      } else {
        setNotification(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <NextUIProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Sidebar />
        <Outlet />
      </LocalizationProvider>
    </NextUIProvider>
  );
}

export default App;
