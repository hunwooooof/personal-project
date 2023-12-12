import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { NextUIProvider } from '@nextui-org/react';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useStore } from './store/store';

function App() {
  const { isLogin, userRef, checkLogIn, getUserProfile } = useStore();

  useEffect(() => {
    checkLogIn();
    if (isLogin) {
      getUserProfile(userRef);
    }
  }, [isLogin]);

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
