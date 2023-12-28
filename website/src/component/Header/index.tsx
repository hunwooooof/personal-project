import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useStore } from '../../utils/store';
import languageURL from './language.png';
import logoURL from './sol-logo.png';

interface PropsType {
  lang: string;
  setLang: (lang: string) => void;
}

function Header({ lang, setLang }: PropsType) {
  const { t } = useTranslation();
  const { currentNav, setCurrentNav } = useStore();
  const [isLanguageBtnShow, setLanguageBtnShow] = useState<boolean>(false);
  const [isSideBarShow, setSideBarShow] = useState<boolean>(false);
  const languageClass =
    '-right-10 lg:right-0 border rounded-xl absolute w-40 h-9 flex justify-center items-center bg-white mt-2 z-30 cursor-pointer shadow hover:bg-gray-100 duration-150 animate-flip-down animate-duration-500';

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const mobileScrollToTop = useCallback(() => {
    scrollToTop();
    setSideBarShow(false);
  }, []);

  return (
    <div className='fixed flex items-center w-full h-16 lg:h-20 bg-white border-b px-4 z-10'>
      <Link to='/' className='mr-auto' onClick={scrollToTop}>
        <img src={logoURL} alt='sol basketball logo' className='h-16 cursor-pointer' />
      </Link>
      <div className='gap-12 mr-12 hidden lg:flex'>
        <Link
          to='/training'
          className={`nav-class ${currentNav === 'training' ? 'text-teal-700' : 'text-black'}`}
          onClick={() => {
            setCurrentNav('training');
            scrollToTop();
          }}>
          {t('nav.training')}
        </Link>
        <Link
          to='/teams'
          className={`nav-class ${currentNav === 'teams' ? 'text-teal-700' : 'text-black'}`}
          onClick={() => {
            setCurrentNav('teams');
            scrollToTop();
          }}>
          {t('nav.teams')}
        </Link>
        <Link
          to='/coaches'
          className={`nav-class ${currentNav === 'coaches' ? 'lg:text-teal-700' : 'text-black'}`}
          onClick={() => {
            setCurrentNav('coaches');
            scrollToTop();
          }}>
          {t('nav.coaches')}
        </Link>
      </div>
      <div className='relative font-bold' onClick={() => setLanguageBtnShow(!isLanguageBtnShow)}>
        <div className='w-9 cursor-pointer lg:border rounded-xl flex justify-center gap-2 items-center lg:w-40 h-9 hover:bg-gray-100 duration-150'>
          <img src={languageURL} alt='language icon' className='w-6' />
          <span className='hidden lg:inline'>{lang === 'en' ? 'English (US)' : '中文（繁體）'}</span>
        </div>
        {isLanguageBtnShow && (
          <div>
            <div onClick={() => setLanguageBtnShow(false)} className='fixed top-0 left-0 z-20 w-screen h-screen' />
            <div>
              {lang === 'en' && (
                <div onClick={() => setLang('zh-TW')} className={languageClass}>
                  中文（繁體）
                </div>
              )}
              {lang === 'zh-TW' && (
                <div onClick={() => setLang('en')} className={languageClass}>
                  English (US)
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div
        className='ml-2 w-9 h-9 cursor-pointer flex lg:hidden justify-center items-center rounded-xl hover:bg-gray-100 duration-150'
        onClick={() => setSideBarShow(true)}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-7 h-7'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
        </svg>
      </div>
      {isSideBarShow && (
        <div className='fixed top-0 left-0 lg:hidden'>
          <div
            className='bg-black opacity-70 w-screen h-screen z-20 animate-flip-down'
            onClick={() => setSideBarShow(false)}
          />
          <div className='fixed right-0 top-0 pt-20 pl-6 w-7/12 h-screen flex flex-col gap-6 bg-white z-30 animate-fade-left'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='fixed top-6 right-6 text-teal-900 w-6 h-6 cursor-pointer hover:animate-jump'
              onClick={() => setSideBarShow(false)}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
            </svg>
            <Link
              to='/training'
              className={`nav-class ${currentNav === 'training' ? 'text-teal-800' : 'text-black'}`}
              onClick={mobileScrollToTop}>
              {t('nav.training')}
            </Link>
            <Link
              to='/teams'
              className={`nav-class ${currentNav === 'team' ? 'text-teal-800' : 'text-black'}`}
              onClick={mobileScrollToTop}>
              {t('nav.teams')}
            </Link>
            <Link
              to='/coaches'
              className={`nav-class ${currentNav === 'coaches' ? 'lg:text-teal-800' : 'text-black'}`}
              onClick={mobileScrollToTop}>
              {t('nav.coaches')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
