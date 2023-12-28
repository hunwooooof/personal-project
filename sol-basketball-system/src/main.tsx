import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App.tsx';

import './index.css';
import GameVideos from './pages/GameVideos/index.tsx';
import Login from './pages/Login/index.tsx';
import Message from './pages/Message/index.tsx';
import Order from './pages/Order/index.tsx';
import Profile from './pages/Profile/index.tsx';
import Purchase from './pages/Purchase/index.tsx';
import Schedule from './pages/Schedule/index.tsx';
import Session from './pages/Session/index.tsx';
import Signup from './pages/Signup/index.tsx';
import Attendance from './pages/admin/Attendance/index.tsx';
import Messages from './pages/admin/Messages/index.tsx';
import AdminOrder from './pages/admin/Order/index.tsx';
import AdminSchedule from './pages/admin/Schedule/index.tsx';
import Student from './pages/admin/Students/index.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<Schedule />} />
        <Route path='signup' element={<Signup />} />
        <Route path='login' element={<Login />} />
        <Route path='profile' element={<Profile />} />
        <Route path='session/:id' element={<Session />} />
        <Route path='order' element={<Order />} />
        <Route path='purchase' element={<Purchase />} />
        <Route path='videos' element={<GameVideos />} />
        <Route path='admin/attendance' element={<Attendance />} />
        <Route path='admin/order' element={<AdminOrder />} />
        <Route path='admin/schedule' element={<AdminSchedule />} />
        <Route path='admin/students' element={<Student />} />
        <Route path='messages/:id' element={<Messages />} />
        <Route path='message/' element={<Message />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
