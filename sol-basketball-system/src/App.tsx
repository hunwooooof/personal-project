import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useEffect } from 'react';
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
    <>
      <Sidebar />
      <Outlet />
    </>
  );
}

export default App;
