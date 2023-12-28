import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import instagramURL from '../../assets/instagram.png';
import lineURL from '../../assets/line.png';
import { useStore } from '../../utils/store';
import coverURL from './cover.jpg';
import solLogoURL from './sol-logo.png';

function Footer() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const { currentNav, setCurrentNav } = useStore();

  const handleScroll = () => {
    const heightToHideBtn = 900;
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    if (winScroll < heightToHideBtn) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div>
      <div className='relative' data-aos='fade-up' data-aos-duration='700'>
        <img src={coverURL} alt='sol basketball family' className='w-full h-[30vh] sm:h-[500px] object-cover' />
        <div className='absolute w-full h-full top-0 bg-black opacity-60' />
        <div className='absolute top-0 pl-[calc(50vw-220px)] sm:pl-36 pt-8 sm:pt-[10%] text-center sm:text-left'>
          <img src={solLogoURL} alt='sol logo' className='sm:hidden w-16 mx-auto' />
          <h2 className='text-3xl sm:text-6xl text-white font-bold'>Sol Basketball</h2>
          <div className='text-sm px-8 sm:px-0 sm:text-2xl text-white font-semibold mt-2 mb-4 sm:mb-12'>
            Share the love of the game with everyone under the sun!
          </div>
          <Link
            to='https://system-1.web.app/login'
            target='_blank'
            className='rounded-full bg-white px-3 sm:px-8 py-2 sm:py-4 text-sm sm:text-xl font-semibold hover:shadow-lg hover:shadow-gray-200/50 duration-150'>
            JOIN US
          </Link>
        </div>
      </div>
      <div className='h-44 lg:h-20 flex flex-col lg:flex-row justify-center lg:justify-between gap-6 lg:gap-0 items-center bg-slate-900 md:px-16'>
        <div
          className={`${
            isVisible ? 'flex' : 'hidden'
          } fixed items-center justify-center right-6 bottom-6 lg:bottom-14 z-50 bg-teal-800 w-10 sm:w-12 h-10 sm:h-12 rounded-full cursor-pointer hover:bg-teal-600 transition-all`}
          onClick={scrollToTop}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6 text-white'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75' />
          </svg>
        </div>
        <div className='flex items-center text-md lg:text-base select-none'>
          <div className='flex items-center'>
            <div className='text-slate-300 mr-6'>{t('footer.follow')}</div>
            <a href='https://www.instagram.com/solbasketball/' target='_blank'>
              <img src={instagramURL} alt='instagram' className='w-8 opacity-80 mr-4 hover:opacity-100 duration-150' />
            </a>
            <a href='https://lin.ee/MHk8Nlz' target='_blank'>
              <img src={lineURL} alt='line' className='w-8 opacity-80 hover:opacity-100 duration-150' />
            </a>
          </div>
        </div>
        <div className='flex flex-col lg:flex-row gap-2 lg:gap-0 justify-between items-start sm:items-center font-light text-xs lg:text-base'>
          <div className='text-slate-400 lg:text-slate-300 mr-4'>© 2023 Sol Basketball. All Rights Reserved.</div>
          <div className='flex'>
            <Link
              to='/terms'
              onClick={() => {
                setCurrentNav('terms');
                scrollToTop();
              }}
              className={`${
                currentNav === 'terms' ? 'text-slate-200' : 'text-slate-500'
              } text-slate-500 md:pl-5 pr-5 hover:text-slate-200 duration-150`}>
              {t('footer.terms')}
            </Link>
            <Link
              to='/privacy'
              onClick={() => {
                setCurrentNav('privacy');
                scrollToTop();
              }}
              className={`${
                currentNav === 'privacy' ? 'text-slate-200' : 'text-slate-500'
              } md:pl-5 pr-5 sm:border-l border-slate-500 hover:text-slate-200 duration-150`}>
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
