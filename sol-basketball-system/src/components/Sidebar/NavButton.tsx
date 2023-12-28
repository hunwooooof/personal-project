import { Tooltip } from '@nextui-org/react';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/store';

interface PropsType {
  info: { href: string; id: string; handleClick: () => void; icon: () => ReactNode; title: string };
  currentNav: string;
}

function NavButton({ info, currentNav }: PropsType) {
  const { hasNotification } = useStore();
  const activeNavClass = 'relative flex items-center gap-2 text-lg text-white px-2 lg:px-0 lg:pl-3 py-2';
  const normalNavClass =
    'relative flex items-center gap-2 text-lg text-slate-500 rounded-xl hover:bg-slate-800 px-2 lg:px-0 lg:pl-3 py-2';

  const isNotificationShow = hasNotification && info.id === 'messages';

  return (
    <Tooltip content={info.title} placement='right' className='lg:hidden'>
      <Link
        to={info.href}
        id={info.id}
        onClick={info.handleClick}
        className={currentNav === info.id ? activeNavClass : normalNavClass}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          className='w-7 h-7 fill-none stroke-1 stroke-current'>
          {info.icon()}
        </svg>
        <span className='hidden lg:inline'>{info.title}</span>
        {isNotificationShow && <div className='absolute top-2 left-2 w-2 h-2 rounded-full bg-red-500' />}
      </Link>
    </Tooltip>
  );
}

export default NavButton;
