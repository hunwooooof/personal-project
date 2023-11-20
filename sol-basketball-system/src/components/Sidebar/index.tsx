import { Link } from 'react-router-dom';
import logoUrl from '../../assets/sol-logo.png';
import { useStore } from '../../store/store';

function Sidebar() {
  const { isLogin, user, kids, setLogOut, getUserProfile } = useStore();

  return (
    <div className='w-60 h-full fixed bg-customDeepBlue top-0 pl-3'>
      <Link to='/' className='block my-3'>
        <img src={logoUrl} alt='sol-basketball-logo' className='w-24' />
      </Link>
      <div className='flex text-white flex-col text-2xl gap-2 pl-2'>
        <Link to='/'>Schedules</Link>
        <Link to='/games'>Games</Link>
        {isLogin && user.role === 'user' && (
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
            <Link to='/purchase'>Purchase</Link>
          </>
        )}
        {isLogin && user.role === 'admin' && (
          <>
            <Link to='/attendance'>Attendance</Link>
            <Link to='/order'>Order</Link>
            <Link to='/admin/profile'>Admin Profile</Link>
          </>
        )}
        {isLogin && (
          <button onClick={setLogOut} className='text-pink-200 text-start'>
            Log out
          </button>
        )}
        {!isLogin && <Link to='/login'>Log In</Link>}
      </div>
    </div>
  );
}

export default Sidebar;
