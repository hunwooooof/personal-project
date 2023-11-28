import { Link } from 'react-router-dom';
import logoUrl from '../../assets/sol-logo.png';
import { useStore } from '../../store/store';

function Sidebar() {
  const { currentNav, setCurrentNav, isLogin, user, kids, setLogOut } = useStore();
  const activeNavClass = 'border-r-4 text-xl text-slate-800 border-slate-800';
  const normalNavClass = 'text-slate-300 text-xl hover:text-slate-500';

  const handleClickNav = (e) => {
    setCurrentNav(e.target.id);
    console.log(e.target.id);
  };

  return (
    <div className='w-60 h-full fixed border-r top-0 pl-3'>
      <Link to='/' className='block my-3'>
        <img src={logoUrl} alt='sol-basketball-logo' className='w-24' />
      </Link>
      <div className='flex flex-col gap-2 pl-2 font-bold'>
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
            <div>Member</div>
            <Link to='/profile' className='pl-3 text-lg'>
              Profile
            </Link>
            {kids.length > 0 && (
              <Link to='/session' className='pl-3 text-lg'>
                Session
              </Link>
            )}
            <Link to='/order' className='pl-3 text-lg'>
              Order
            </Link>
            <Link to='/purchase'>Purchase</Link>
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
              to='/admin/students'
              id='admin-students'
              onClick={handleClickNav}
              className={currentNav === 'admin-students' ? activeNavClass : normalNavClass}>
              Students
            </Link>
          </>
        )}
        {!isLogin && <Link to='/login'>Log In</Link>}
        {isLogin && (
          <button
            onClick={setLogOut}
            className='mt-auto bg-slate-100 w-24 rounded-2xl fixed bottom-5 py-1 shadow-md hover:shadow-inner'>
            Log out
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
