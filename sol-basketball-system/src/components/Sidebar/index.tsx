import { Link } from 'react-router-dom';
import logoUrl from '../../assets/sol-logo.png';
import { useStore } from '../../store/store';

function Sidebar() {
  const { currentNav, setCurrentNav, isLogin, user, kids, setLogOut } = useStore();
  const activeNavClass = 'flex items-center gap-2 text-lg text-white px-2 md:px-0 md:pl-3 py-2';
  const normalNavClass =
    'flex items-center gap-2 text-lg text-slate-500 rounded-xl hover:bg-slate-800 px-2 md:px-0 md:pl-3 py-2';

  const handleClickNav = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setCurrentNav((e.target as Element).id);
  };

  return (
    <div className='md:w-60 h-full fixed border-r border-gray-600 top-0 bg-slate-900 px-1'>
      <Link to='/' className='block my-3' onClick={() => setCurrentNav('schedules')}>
        <img src={logoUrl} alt='sol-basketball-logo' className='w-16 md:w-24 p-1 md:p-4' />
      </Link>
      <div className='flex flex-col font-bold items-center md:items-stretch'>
        <Link
          to='/'
          id='schedules'
          onClick={() => setCurrentNav('schedules')}
          className={currentNav === 'schedules' ? activeNavClass : normalNavClass}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-7 h-7'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5'
            />
          </svg>
          <span className='hidden md:inline'>Schedules</span>
        </Link>
        <Link
          to='/videos'
          id='videos'
          onClick={() => setCurrentNav('videos')}
          className={currentNav === 'videos' ? activeNavClass : normalNavClass}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-7 h-7'>
            <path
              strokeLinecap='round'
              d='M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z'
            />
          </svg>
          <span className='hidden md:inline'>Game Videos</span>
        </Link>
        {isLogin && user && user.role === 'user' && (
          <>
            <Link
              to='/profile'
              id='profile'
              onClick={() => setCurrentNav('profile')}
              className={currentNav === 'profile' ? activeNavClass : normalNavClass}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-7 h-7'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
                />
              </svg>
              <span className='hidden md:inline'>Profile</span>
            </Link>
            {kids.length > 0 && (
              <Link
                to='/session'
                id='session'
                onClick={() => setCurrentNav('session')}
                className={currentNav === 'session' ? activeNavClass : normalNavClass}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-7 h-7'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3'
                  />
                </svg>
                <span className='hidden md:inline'>Session</span>
              </Link>
            )}
            <Link
              to='/purchase'
              id='purchase'
              onClick={() => setCurrentNav('purchase')}
              className={currentNav === 'purchase' ? activeNavClass : normalNavClass}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-7 h-7'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
                />
              </svg>
              <span className='hidden md:inline'>Purchase</span>
            </Link>
            <Link
              to='/order'
              id='order'
              onClick={() => setCurrentNav('order')}
              className={currentNav === 'order' ? activeNavClass : normalNavClass}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-7 h-7'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
                />
              </svg>
              <span className='hidden md:inline'>Order</span>
            </Link>
            <Link
              to='/message'
              id='message'
              onClick={() => setCurrentNav('message')}
              className={currentNav === 'message' ? activeNavClass : normalNavClass}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-7 h-7'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z'
                />
              </svg>
              <span className='hidden md:inline'>Message</span>
            </Link>
          </>
        )}
        {isLogin && user && user.role === 'admin' && (
          <>
            <Link
              to='/admin/schedule'
              id='admin-schedules'
              onClick={() => setCurrentNav('admin-schedules')}
              className={currentNav === 'admin-schedules' ? activeNavClass : normalNavClass}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-7 h-7'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75'
                />
              </svg>
              <span className='hidden md:inline'>Manage Schedules</span>
            </Link>
            <Link
              to='/admin/students'
              id='admin-students'
              onClick={() => setCurrentNav('admin-students')}
              className={currentNav === 'admin-students' ? activeNavClass : normalNavClass}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-7 h-7'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
                />
              </svg>
              <span className='hidden md:inline'>Students</span>
            </Link>
            <Link
              to='/admin/attendance'
              id='admin-attendance'
              onClick={() => setCurrentNav('admin-attendance')}
              className={currentNav === 'admin-attendance' ? activeNavClass : normalNavClass}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-7 h-7'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002'
                />
              </svg>
              <span className='hidden md:inline'>Attendance</span>
            </Link>
            <Link
              to='/admin/order'
              id='admin-order'
              onClick={() => setCurrentNav('admin-order')}
              className={currentNav === 'admin-order' ? activeNavClass : normalNavClass}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-7 h-7'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
                />
              </svg>
              <span className='hidden md:inline'>Orders</span>
            </Link>
            <Link
              to='/messages/inbox'
              id='messages'
              onClick={() => setCurrentNav('messages')}
              className={currentNav === 'messages' ? activeNavClass : normalNavClass}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-7 h-7'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z'
                />
              </svg>
              <span className='hidden md:inline'>Messages</span>
            </Link>
          </>
        )}
        {!isLogin && (
          <Link
            to='/login'
            className='mt-auto text-slate-100 text-center bg-slate-700 w-24 rounded-2xl fixed left-5 bottom-5 py-1 shadow-md hover:shadow-none'>
            Log In
          </Link>
        )}
        {isLogin && (
          <button
            onClick={setLogOut}
            className='mt-auto text-slate-100 bg-slate-700 w-24 rounded-2xl fixed left-5 bottom-5 py-1 shadow-md hover:shadow-none'>
            Log out
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
