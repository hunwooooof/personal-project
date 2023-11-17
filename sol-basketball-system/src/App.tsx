import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useEffect } from 'react';
import { useStore } from './store/store';

function App() {
  const { checkLoginStatus } = useStore();
  const localJwtToken = localStorage.getItem('jwtToken') || null;

  useEffect(() => {
    if (localJwtToken) checkLoginStatus(localJwtToken);
  }, []);

  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
}

export default App;
