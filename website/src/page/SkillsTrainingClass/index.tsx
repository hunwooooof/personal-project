import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useStore } from '../../utils/store';
import trainingURL from './training.jpg';

function SkillsTrainingClass() {
  const { t } = useTranslation();
  const { setCurrentNav } = useStore();

  useEffect(() => {
    setCurrentNav('training');
  }, []);

  const fridayClass = [
    { title: 'Time', description: '19:00-21:00' },
    { title: 'Class Dates', description: '1/5 1/12 1/19 1/26' },
  ];

  return (
    <div className='pt-16 sm:pt-20 min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)]'>
      <div
        className='w-full h-[40vw] bg-fixed bg-contain bg-[center_top_2rem] flex items-end pb-10 px-20 justify-center brightness-125'
        style={{ backgroundImage: `url(${trainingURL})` }}
      />
      <div className='max-w-7xl w-10/12 mx-auto py-20'>
        <h2 className='text-3xl sm:text-5xl text-center mb-8 font-bold bg-white p-3'>Training Classes</h2>
        <div className='indent-8 px-2 leading-6 sm:leading-9 tracking-wide mb-10 sm:mb-20 text-base sm:text-xl text-gray-500'>
          {t('skills-training-class.description')}
        </div>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center mb-4'>
          <h3 className='text-2xl sm:text-3xl font-semibold tracking-wide'>
            {t('skills-training-class.friday-training')}
          </h3>
          <Link
            to='https://system-1.web.app/'
            target='_blank'
            className='text-white px-4 py-2 rounded-full bg-teal-900 hover:bg-teal-700'>
            {t('skills-training-class.action')}
          </Link>
        </div>
        <div className='flex flex-col'>
          {fridayClass.map((item, i) => {
            return (
              <div className='flex flex-col sm:flex-row sm:gap-2 mb-4 sm:mb-2 items-start sm:items-center' key={i}>
                <div className='w-28 text-gray-400 flex items-center justify-between'>
                  {item.title}
                  <span className='hidden sm:inline'>|</span>
                </div>
                <div className='font-semibold text-gray-700'>{item.description}</div>
              </div>
            );
          })}
          <div className='flex flex-col sm:flex-row sm:gap-2 mb-4 sm:mb-2 items-start sm:items-center'>
            <div className='w-28 text-gray-400 flex items-center justify-between'>
              Location<span className='hidden sm:inline'>|</span>
            </div>
            <div className='font-semibold text-gray-700'>
              {t('skills-training-class.location')}
              <a
                href='https://maps.app.goo.gl/vZAvp4EWogx6mra88'
                target='_blank'
                className='ml-2 text-gray-500 text-sm underline'>
                {t('skills-training-class.address')}
              </a>
            </div>
          </div>
        </div>
        <div className='mt-2 font-semibold text-gray-700'>{t('skills-training-class.drop-in')} $800</div>
      </div>
    </div>
  );
}

export default SkillsTrainingClass;
