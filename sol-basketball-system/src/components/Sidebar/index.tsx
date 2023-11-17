import { Link } from 'react-router-dom';
import logoUrl from '../../assets/sol-logo.png';
import { useStore } from '../../store/store';

function Sidebar() {
  const { isLogin, setLogOut } = useStore();
  return (
    <div className='w-60 h-full fixed bg-customDeepBlue top-0'>
      <Link to='/'>
        <img src={logoUrl} alt='sol-basketball-logo' className='w-24' />
      </Link>
      <div className='flex text-white flex-col text-3xl'>
        <Link to='/'>Schedules</Link>
        <Link to='/games'>Games</Link>
        <Link to='/member'>Member</Link>
        {isLogin && <Link to='/profile'>Profile</Link>}
        {isLogin ? <button onClick={setLogOut}>Log out</button> : <Link to='/login'>Log In</Link>}
        <Link to='/purchase'>Purchase</Link>
      </div>
    </div>
  );
}

export default Sidebar;
