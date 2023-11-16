import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
}

export default App;
