import AOS from 'aos';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import roadrunnersURL from './roadrunners.jpg';

function Teams() {
  const { t } = useTranslation();
  const teams = [
    {
      img: roadrunnersURL,
      title: 'Roadrunners Club Teams',
      description: t('home.teams.roadrunners'),
      aos: 'zoom-in',
      aosDelay: '0',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/sol-basketball.appspot.com/o/website%2Ftiger-u10.png?alt=media&token=91f8a007-f854-4a5f-8453-b3a4d141439c',
      title: 'Tigers Club Teams',
      description: t('home.teams.tigers'),
      aos: 'zoom-in',
      aosDelay: '300',
    },
  ];

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className='w-full bg-indigo-50 pt-16 pb-36'>
      <div className='max-w-7xl w-10/12 mx-auto'>
        <h2 className='text-center text-5xl font-bold mb-14'>Teams</h2>
        <div className='flex flex-col md:flex-row items-center justify-center gap-20'>
          {teams.map((team, i) => {
            return (
              <div className='hover:scale-105 duration-200 flex flex-col lg:w-5/12'>
                <Link
                  to='/teams'
                  key={i}
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth',
                    });
                  }}
                  className='bg-white shadow-lg rounded-md'
                  data-aos={team.aos}
                  data-aos-delay={team.aosDelay}
                  data-aos-duration='500'>
                  <img src={team.img} alt={team.title} className='w-full h-60 md:h-80 object-cover rounded-t-md' />
                  <div className='px-8 py-6'>
                    <h3 className='text-2xl font-semibold mb-4 tracking-wide text-teal-800 md:min-h-[50px]'>
                      {team.title}
                    </h3>
                    <div className='text-md text-gray-800 md:min-h-[130px]'>{team.description}</div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Teams;
