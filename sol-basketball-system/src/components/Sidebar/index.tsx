import { Link } from 'react-router-dom';
import logoUrl from '../../assets/sol-logo.png';

function Sidebar() {
  return (
    <div className='w-60 h-full fixed bg-customDeepBlue top-0'>
      <Link to='/'>
        <img src={logoUrl} alt='sol-basketball-logo' className='w-24' />
      </Link>
      <div className='flex text-white flex-col text-3xl'>
        <Link to='/'>Schedules</Link>
        <Link to='/games'>Games</Link>
        <Link to='/member'>Member</Link>
        <Link to='/signup'>Sign up</Link>
        <Link to='/purchase'>Purchase</Link>
      </div>
    </div>
  );
}

export default Sidebar;
