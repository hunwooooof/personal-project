import AOS from 'aos';
import { useEffect } from 'react';

interface PropsType {
  coach: {
    name: string;
    title: string;
    photoURL: string;
    biography: string;
    motivation: string;
  };
}

function CoachCard({ coach }: PropsType) {
  const titleClass = 'flex justify-between items-center mt-6 mb-3';

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className='bg-white drop-shadow-lg' data-aos='zoom-in'>
      <div className='max-w-7xl w-10/12 mx-auto py-20 flex flex-col sm:flex-row justify-center'>
        <div className='flex flex-col items-center md:w-4/12'>
          <img src={coach.photoURL} alt={coach.name} className='w-[280px] h-[400px] object-cover my-5' />
          <div className='font-bold text-2xl'>{coach.name}</div>
          <div className='font-semibold font-xl'>{coach.title}</div>
        </div>
        <div className='md:w-7/12'>
          <div className='mx-8 mb-5 border-b-2 pb-5'>
            <div className={titleClass}>
              <div className='text-2xl'>Biography</div>
            </div>

            <div className='text-lg animate-flip-down indent-8 leading-8 text-slate-800/70'>{coach.biography}</div>
          </div>
          <div className='mx-8 mb-5'>
            <div className={titleClass}>
              <div className='text-2xl'>Motivation</div>
            </div>

            <div className='text-lg animate-flip-down indent-8 leading-8 text-slate-800/70'>{coach.motivation}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoachCard;
