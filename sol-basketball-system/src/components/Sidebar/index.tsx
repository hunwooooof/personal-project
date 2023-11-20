import { Link } from 'react-router-dom';
import logoUrl from '../../assets/sol-logo.png';
import { useStore } from '../../store/store';

function Sidebar() {
  const { isLogin, setLogOut } = useStore();
  return (
    <div className='w-60 h-full fixed bg-customDeepBlue top-0 pl-3'>
      <Link to='/' className='block my-3'>
        <img src={logoUrl} alt='sol-basketball-logo' className='w-24' />
      </Link>
      <div className='flex text-white flex-col text-2xl gap-2 pl-2'>
        <Link to='/'>Schedules</Link>
        <Link to='/games'>Games</Link>
        <Link to='/profile'>Member</Link>
        {isLogin && (
          <Link to='/profile' className='pl-3 text-lg'>
            Profile
          </Link>
        )}
        {isLogin && (
          <Link to='/session' className='pl-3 text-lg'>
            Session
          </Link>
        )}
        {isLogin ? (
          <button onClick={setLogOut} className='pl-3 text-lg text-start'>
            Log out
          </button>
        ) : (
          <Link to='/login'>Log In</Link>
        )}
        <Link to='/purchase'>Purchase</Link>
      </div>
    </div>
  );
}

export default Sidebar;
