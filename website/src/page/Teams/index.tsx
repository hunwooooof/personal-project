import AOS from 'aos';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../utils/store';
import family from './family.jpeg';
import roadrunnerU12URL from './roadrunners-U12.jpg';
import rrookiesU10URL from './roadrunners-rookies.jpg';
import roadrunnerU10URL from './roadrunnersU10.jpg';

function Teams() {
  const { t } = useTranslation();
  const { setCurrentNav } = useStore();

  useEffect(() => {
    setCurrentNav('teams');
  }, []);

  useEffect(() => {
    AOS.init();
  }, []);

  const roadrunners = [
    {
      img: rrookiesU10URL,
      title: 'U10 RR ROOKIES',
      description: t('teams.roadrunners.u10rookies'),
      aosDelay: '0',
    },
    {
      img: roadrunnerU10URL,
      title: 'U10 ROADRUNNERS',
      description: t('teams.roadrunners.u10'),
      aosDelay: '300',
    },
    {
      img: roadrunnerU12URL,
      title: 'U12 ROADRUNNERS',
      description: t('teams.roadrunners.u12'),
      aosDelay: '600',
    },
  ];
  const tigers = [
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/sol-basketball.appspot.com/o/website%2Ftiger-u10.png?alt=media&token=91f8a007-f854-4a5f-8453-b3a4d141439c',
      title: 'U10 TIGERS',
      description: t('teams.tigers.u10'),
      aosDelay: '0',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/sol-basketball.appspot.com/o/website%2Ftiger-u12.png?alt=media&token=6071d364-62c8-435c-8fca-78b45b462043',
      title: 'U12 TIGERS',
      description: t('teams.tigers.u12'),
      aosDelay: '300',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/sol-basketball.appspot.com/o/website%2Ftiger-u13.png?alt=media&token=8d34ec09-5b25-4109-8b5d-e8647b7d2fda',
      title: 'U13 TIGERS',
      description: t('teams.tigers.u13'),
      aosDelay: '600',
    },
  ];
  return (
    <div className='pt-16 sm:pt-20'>
      <div
        className='w-full h-[40vw] bg-fixed bg-contain bg-[center_top_2rem] flex items-end pb-10 px-20 justify-center brightness-125 mb-20'
        style={{ backgroundImage: `url(${family})` }}
      />
      <h2 className='text-5xl text-center mb-8 font-bold bg-white p-3'>Our Teams</h2>
      <div className='bg-white'>
        <div className='max-w-7xl w-10/12 mx-auto pb-20'>
          <div className='mb-24'>
            <h2 className='text-4xl mb-12 font-semibold'>Roadrunners Club Teams</h2>
            <div className='flex flex-col justify-center items-start md:flex-row gap-10 border-b pb-20'>
              {roadrunners.map((team, i) => {
                return (
                  <div
                    key={i}
                    data-aos='fade-up'
                    data-aos-delay={team.aosDelay}
                    className='w-96 bg-white p-2 shadow-md shadow-white/25'>
                    <img src={team.img} alt={team.title} className='object-cover' />
                    <div className='p-4'>
                      <h3 className='leading-10 text-xl font-semibold'>{team.title}</h3>
                      <div>{team.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h2 className='text-4xl mb-12 font-semibold'>Tigers Club Teams</h2>
            <div className='flex flex-col justify-center items-start md:flex-row gap-10'>
              {tigers.map((team, i) => {
                return (
                  <div
                    key={i}
                    data-aos='fade-up'
                    data-aos-delay={team.aosDelay}
                    className='w-96 bg-white p-2 shadow-md shadow-white/25'>
                    <img src={team.img} alt={team.title} className='object-cover' />
                    <div className='p-4'>
                      <h3 className='leading-10 text-xl font-semibold'>{team.title}</h3>
                      <div>{team.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Teams;
