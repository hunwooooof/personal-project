import AOS from 'aos';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function SkillsTraining() {
  const { t } = useTranslation();
  const [videoIndex, setVideoIndex] = useState('0');
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className='w-full mb-40'>
      <h2 className='text-center text-5xl font-bold mb-16'>Training</h2>
      <div className='flex flex-col md:flex-row justify-center items-center gap-16'>
        <div data-aos='fade-right' data-aos-duration='800' className='flex flex-col justify-between gap-8 w-7/12'>
          <h3 className='text-3xl font-bold'>{t('home.training.skills-training.title')}</h3>
          <p className='text-2xl font-semibold text-gray-500'>{t('home.training.skills-training.description')}</p>
          <Link
            to='/training'
            className='text-xl text-center w-24 py-2 mt-6 rounded-full bg-gray-200 font-bold hover:bg-indigo-200 hover:scale-105 duration-150'>
            More
          </Link>
        </div>
        <div data-aos='fade-left' data-aos-duration='800' className='flex flex-col gap-4 items-center'>
          <div className='w-[270px] md:w-[360px]'>
            {videoIndex === '0' && (
              <iframe
                src='https://streamable.com/e/g7n30r?autoplay=1'
                allow='autoplay'
                className='w-[270px] md:w-[360px] h-[480px] md:h-[640px]'
              />
            )}
            {videoIndex === '1' && (
              <iframe
                src='https://streamable.com/e/61oviz?autoplay=1'
                allow='autoplay'
                className='w-[270px] md:w-[360px] h-[480px] md:h-[640px]'
              />
            )}
          </div>
          <div className='flex gap-2'>
            <div
              className={`bg-gray-200 w-3 h-3 rounded-full cursor-pointer ${videoIndex === '0' ? 'bg-gray-800' : ''}`}
              onClick={() => setVideoIndex('0')}
            />
            <div
              className={`bg-gray-200 w-3 h-3 rounded-full cursor-pointer ${videoIndex === '1' ? 'bg-gray-800' : ''}`}
              onClick={() => setVideoIndex('1')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillsTraining;
