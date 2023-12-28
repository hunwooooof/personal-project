import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import quote1URL from '../../assets/quotes-1.png';
import quote2URL from '../../assets/quotes-2.png';
import { useStore } from '../../utils/store';
import SkillsTraining from './SkillsTraining';
import Teams from './TeamsSection';
import familyPicURL from './family.jpg';

function Home() {
  const { t } = useTranslation();
  const { setCurrentNav } = useStore();

  useEffect(() => {
    setCurrentNav('');
  }, []);

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className='relative pt-16 lg:pt-20'>
      <div
        className='h-[500px] bg-fixed bg-cover bg-center text-white mb-20'
        style={{ backgroundImage: `url(${familyPicURL})` }}
      />
      <div className='absolute top-16 lg:top-20 p-24 sm:p-44 text-center w-full h-[500px] text-white mb-20 bg-black/30'>
        <h1
          data-aos='zoom-in-up'
          data-aos-duration='1000'
          className='text-5xl sm:text-7xl font-bold mb-10 drop-shadow-md'>
          Sol Basketball
        </h1>
        <div
          data-aos='zoom-in-up'
          data-aos-delay='300'
          data-aos-duration='1000'
          className='text-3xl leading-10 tracking-wide drop-shadow-md'>
          Share the love of the game with everyone under the sun!
        </div>
      </div>
      <div className='max-w-7xl w-10/12 mx-auto'>
        <div className='flex flex-col sm:flex-row sm:relative justify-end sm:h-[500px] mb-16 sm:mb-96 gap-10 sm:gap-0'>
          <div className='sm:absolute sm:left-0 sm:w-9/12 flex flex-col lg:mt-80 gap-4 bg-white/40'>
            <img src={quote1URL} alt='quote' className='w-8 lg:w-16 ml-8' />
            <div className='indent-14 lg:px-24 md:text-xl text-center sm:text-left leading-7 sm:leading-10 tracking-wide font-semibold text-gray-700'>
              {t('about-us.quote')}
            </div>
            <img src={quote2URL} alt='quote' className='w-8 lg:w-16 ml-auto mr-8' />
          </div>
          <div className='sm:w-8/12 sm:p-10 flex'>
            <div className='w-full h-60 sm:h-auto'>
              <iframe
                src='https://streamable.com/e/6jtifo?quality=highest&autoplay=1&nocontrols=1'
                style={{ width: '100%', height: '100%' }}
                allow='autoplay'
              />
            </div>
          </div>
        </div>
        <SkillsTraining />
      </div>
      <Teams />
    </div>
  );
}

export default Home;
