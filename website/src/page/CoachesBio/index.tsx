import { useTranslation } from 'react-i18next';
import CoachCard from './CoachCard';
import brentonURL from './brenton.png';

import { useEffect } from 'react';
import { useStore } from '../../utils/store';
import backgroundURL from './coaches-bg.png';
import coachesURL from './coaches.jpg';
import kamURL from './kam.png';
import mattURL from './matt.png';
import mavisURL from './mavis.jpg';
import ronnieURL from './ronnie.jpg';

function CoachesBio() {
  const { t } = useTranslation();
  const { setCurrentNav } = useStore();

  useEffect(() => {
    setCurrentNav('coaches');
  }, []);

  const coaches = [
    {
      name: 'Matthew Hibbs',
      title: t('coaches-bio.matt.title'),
      photoURL: mattURL,
      biography: t('coaches-bio.matt.biography'),
      motivation: t('coaches-bio.matt.motivation'),
    },
    {
      name: 'Ronnie Hsieh',
      title: t('coaches-bio.ronnie.title'),
      photoURL: ronnieURL,
      biography: t('coaches-bio.ronnie.biography'),
      motivation: t('coaches-bio.ronnie.motivation'),
    },
    {
      name: 'Brenton McBride ',
      title: 'Coach',
      photoURL: brentonURL,
      biography: t('coaches-bio.brenton.biography'),
      motivation: t('coaches-bio.brenton.motivation'),
    },
    {
      name: 'Mavis Lee',
      title: t('coaches-bio.mavis.title'),
      photoURL: mavisURL,
      biography: t('coaches-bio.mavis.biography'),
      motivation: t('coaches-bio.mavis.motivation'),
    },
    {
      name: 'Kam',
      title: t('coaches-bio.kam.title'),
      photoURL: kamURL,
      biography: t('coaches-bio.kam.biography'),
      motivation: t('coaches-bio.kam.motivation'),
    },
  ];

  return (
    <div className='pt-16 lg:pt-20'>
      <div
        className='w-full h-[40vw] bg-fixed bg-contain bg-[center_top_2rem] flex items-end pb-10 px-20 justify-center mb-20'
        style={{ backgroundImage: `url(${coachesURL})` }}
      />
      <h2 className='text-5xl text-center mb-8 font-bold bg-white p-3'>Coaches</h2>
      <div className='flex flex-col gap-28 bg-fixed bg-cover' style={{ backgroundImage: `url(${backgroundURL})` }}>
        {coaches.map((coach) => {
          return <CoachCard key={coach.name} coach={coach} />;
        })}
      </div>
    </div>
  );
}

export default CoachesBio;
