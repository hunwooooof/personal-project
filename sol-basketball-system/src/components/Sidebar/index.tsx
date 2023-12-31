import { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import logoUrl from '../../assets/sol-logo.png';
import { useStore } from '../../store/store';
import NavButton from './NavButton';

function Sidebar() {
  const navigate = useNavigate();
  const { currentNav, setCurrentNav, isLogin, user, setLogOut, setLoading } = useStore();

  const navBarInfos = [
    {
      href: '/',
      id: 'schedules',
      title: 'Schedules',
      handleClick: () => setCurrentNav('schedules'),
      icon: () => (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z'
        />
      ),
    },
    {
      href: '/videos',
      id: 'videos',
      title: 'Videos',
      handleClick: () => {
        setLoading(true);
        setCurrentNav('videos');
      },
      icon: () => (
        <path
          strokeLinecap='round'
          d='M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z'
        />
      ),
    },
    {
      href: '/profile',
      id: 'profile',
      title: 'Profile',
      handleClick: () => {
        if (currentNav !== 'profile') setLoading(true);
        setCurrentNav('profile');
      },
      icon: () => (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
        />
      ),
    },
  ];

  const userNavBarInfos = [
    {
      href: '/purchase',
      id: 'purchase',
      title: 'Purchase',
      handleClick: () => setCurrentNav('purchase'),
      icon: () => (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
        />
      ),
    },
    {
      href: '/order',
      id: 'order',
      title: 'Order',
      handleClick: () => {
        setLoading(true);
        setCurrentNav('order');
      },
      icon: () => (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
        />
      ),
    },
    {
      href: '/message',
      id: 'message',
      title: 'Message',
      handleClick: () => setCurrentNav('message'),
      icon: () => (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z'
        />
      ),
    },
  ];

  const adminNavBarInfos = [
    {
      href: '/admin/schedule',
      id: 'admin-schedules',
      title: 'Manage Schedules',
      handleClick: () => setCurrentNav('admin-schedules'),
      icon: () => (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75'
        />
      ),
    },
    {
      href: '/admin/students',
      id: 'admin-students',
      title: 'Students',
      handleClick: () => setCurrentNav('admin-students'),
      icon: () => (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5'
        />
      ),
    },
    {
      href: '/admin/attendance',
      id: 'admin-attendance',
      title: 'Attendance',
      handleClick: () => setCurrentNav('admin-attendance'),
      icon: () => (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002'
        />
      ),
    },
    {
      href: '/admin/order',
      id: 'admin-order',
      title: 'Orders',
      handleClick: () => setCurrentNav('admin-order'),
      icon: () => (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
        />
      ),
    },
    {
      href: '/messages/inbox',
      id: 'messages',
      title: 'Messages',
      handleClick: () => setCurrentNav('messages'),
      icon: () => (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z'
        />
      ),
    },
  ];

  const isUser = isLogin && user && user.role === 'user';
  const isAdmin = isLogin && user && user.role === 'admin';

  const renderLoginIcon = () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      className='w-6 h-6 lg:hidden fill-none stroke-[1.5] stroke-current'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75'
      />
    </svg>
  );

  const renderLogoutIcon = () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      className='w-6 h-6 lg:hidden fill-none stroke-[1.5] stroke-current'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9'
      />
    </svg>
  );

  return (
    <div className='lg:w-60 h-screen fixed border-r border-gray-600 top-0 bg-slate-900 px-1'>
      <Link to='/' className='block my-3' onClick={() => setCurrentNav('schedules')}>
        <img src={logoUrl} alt='sol-basketball-logo' className='w-16 lg:w-24 p-1 lg:p-4' />
      </Link>
      <div className='flex flex-col font-bold items-center lg:items-stretch'>
        {navBarInfos.map((info) => (
          <NavButton info={info} currentNav={currentNav} />
        ))}
        {isUser && userNavBarInfos.map((info) => <NavButton key={info.id} info={info} currentNav={currentNav} />)}
        {isAdmin && adminNavBarInfos.map((info) => <NavButton key={info.id} info={info} currentNav={currentNav} />)}
        {!isLogin && (
          <Link
            to='/login'
            onClick={() => setCurrentNav('')}
            className='bg-slate-900 mt-auto text-gray-500 text-center border border-gray-600 lg:w-24 rounded-2xl fixed lg:left-5 bottom-5 px-2 lg:px-0 py-1 shadow-md hover:text-white'>
            {renderLoginIcon()}
            <span className='hidden lg:inline'>Log In</span>
          </Link>
        )}
        {isLogin && (
          <button
            onClick={() => {
              setLoading(true);
              setLogOut();
              setTimeout(() => {
                navigate('/login');
                setCurrentNav('');
                setLoading(false);
              }, 170);
            }}
            className='bg-slate-900 mt-auto text-gray-500 border border-gray-600 lg:w-24 rounded-2xl fixed lg:left-5 bottom-5 px-2 lg:px-0 py-1 shadow-md hover:text-white'>
            <span className='hidden lg:inline'>Log out</span>
            {renderLogoutIcon()}
          </button>
        )}
      </div>
      <Toaster position='top-right' />
    </div>
  );
}

export default Sidebar;
