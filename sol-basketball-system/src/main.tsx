import { GoogleOAuthProvider } from '@react-oauth/google';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import Attendance from './pages/Attendance/index.tsx';
import Login from './pages/Login/index.tsx';
import Order from './pages/Order/index.tsx';
import Profile from './pages/Profile/index.tsx';
import Purchase from './pages/Purchase/index.tsx';
import Schedule from './pages/Schedule/index.tsx';
import Session from './pages/Session/index.tsx';
import Signup from './pages/Signup/index.tsx';
import AdminOrder from './pages/admin/Order/index.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId='401302748123-6csqfdahphv7pnrk3kt0a0rie81lg72a.apps.googleusercontent.com'>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Schedule />} />
          <Route path='signup' element={<Signup />} />
          <Route path='login' element={<Login />} />
          <Route path='profile' element={<Profile />} />
          <Route path='session' element={<Session />} />
          <Route path='order' element={<Order />} />
          <Route path='purchase' element={<Purchase />} />
          <Route path='attendance' element={<Attendance />} />
          <Route path='admin/order' element={<AdminOrder />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </GoogleOAuthProvider>,
);
