import { Link } from 'react-router-dom';
import logoUrl from '../../assets/sol-logo.png';
import { useStore } from '../../store/store';

function Sidebar() {
  const { currentNav, setCurrentNav, isLogin, user, kids, setLogOut } = useStore();
  const activeNavClass = 'border-r-4 text-xl text-slate-800 border-slate-800';
  const normalNavClass = 'text-slate-300 text-xl hover:text-slate-500';

  const handleClickNav = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setCurrentNav((e.target as Element).id);
  };

  return (
    <div className='w-60 h-full fixed border-r top-0 pl-3'>
      <Link to='/' className='block my-3'>
        <img src={logoUrl} alt='sol-basketball-logo' className='w-20 py-4' />
      </Link>
      <div className='flex flex-col gap-3 pl-2 font-bold'>
        <Link
          to='/'
          id='schedules'
          onClick={handleClickNav}
          className={currentNav === 'schedules' ? activeNavClass : normalNavClass}>
          Schedules
        </Link>
        <Link
          to='/videos'
          id='videos'
          onClick={handleClickNav}
          className={currentNav === 'videos' ? activeNavClass : normalNavClass}>
          Game Videos
        </Link>
        {isLogin && user && user.role === 'user' && (
          <>
            <Link
              to='/profile'
              id='profile'
              onClick={handleClickNav}
              className={currentNav === 'profile' ? activeNavClass : normalNavClass}>
              Profile
            </Link>
            {kids.length > 0 && (
              <Link
                to='/session'
                id='session'
                onClick={handleClickNav}
                className={currentNav === 'session' ? activeNavClass : normalNavClass}>
                Session
              </Link>
            )}
            <Link
              to='/purchase'
              id='purchase'
              onClick={handleClickNav}
              className={currentNav === 'purchase' ? activeNavClass : normalNavClass}>
              Purchase
            </Link>
            <Link
              to='/order'
              id='order'
              onClick={handleClickNav}
              className={currentNav === 'order' ? activeNavClass : normalNavClass}>
              Order
            </Link>
            <Link
              to='/message'
              id='message'
              onClick={handleClickNav}
              className={currentNav === 'message' ? activeNavClass : normalNavClass}>
              Message
            </Link>
          </>
        )}
        {isLogin && user && user.role === 'admin' && (
          <>
            <Link
              to='/admin/schedule'
              id='admin-schedules'
              onClick={handleClickNav}
              className={currentNav === 'admin-schedules' ? activeNavClass : normalNavClass}>
              Manage Schedules
            </Link>
            <Link
              to='/admin/students'
              id='admin-students'
              onClick={handleClickNav}
              className={currentNav === 'admin-students' ? activeNavClass : normalNavClass}>
              Students
            </Link>
            <Link
              to='/admin/attendance'
              id='admin-attendance'
              onClick={handleClickNav}
              className={currentNav === 'admin-attendance' ? activeNavClass : normalNavClass}>
              Attendance
            </Link>
            <Link
              to='/admin/order'
              id='admin-order'
              onClick={handleClickNav}
              className={currentNav === 'admin-order' ? activeNavClass : normalNavClass}>
              Orders
            </Link>
            <Link
              to='/messages/inbox'
              id='messages'
              onClick={handleClickNav}
              className={currentNav === 'messages' ? activeNavClass : normalNavClass}>
              Messages
            </Link>
          </>
        )}
        {!isLogin && (
          <Link
            to='/login'
            className='mt-auto text-slate-100 text-center bg-slate-700 w-24 rounded-2xl fixed bottom-5 py-1 shadow-md hover:shadow-none'>
            Log In
          </Link>
        )}
        {isLogin && (
          <button
            onClick={setLogOut}
            className='mt-auto text-slate-100 bg-slate-700 w-24 rounded-2xl fixed bottom-5 py-1 shadow-md hover:shadow-none'>
            Log out
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
