import { useEffect, useState } from 'react';
import { firestore } from '../../utils/firestore';

interface PropsType {
  currentKidId: string;
}

interface CreditsType {
  all: number;
  used: number;
  left: number;
}

function Credits({ currentKidId }: PropsType) {
  const [credit, setCredit] = useState<CreditsType>({
    all: 0,
    used: 0,
    left: 0,
  });

  useEffect(() => {
    firestore.getDoc('credits', currentKidId).then((credit) => {
      if (credit) {
        setCredit({
          all: credit.all,
          used: credit.used,
          left: credit.all - credit.used,
        });
      } else {
        setCredit({
          all: 0,
          used: 0,
          left: 0,
        });
      }
    });
  }, [currentKidId]);

  return (
    <div className='border-b border-gray-600'>
      <div className='w-10/12 mx-auto custom-page-title mt-8'>Credits</div>
      <div className='w-10/12 mx-auto flex justify-center gap-11 py-6 mb-6'>
        <div className='flex flex-col w-52 justify-center items-center'>
          <div className='text-5xl mb-3'>{credit.all}</div>
          <div className='text-gray-500'>Session Credits Purchased</div>
        </div>
        <div className='flex flex-col w-52 justify-center items-center'>
          <div className='text-5xl mb-3'>{credit.used}</div>
          <div className='text-gray-500'>Credits Used</div>
        </div>
        <div className='flex flex-col w-52 justify-center items-center'>
          <div className='text-5xl mb-3'>{credit.left}</div>
          <div className='text-gray-500'>Credits Remaining</div>
        </div>
      </div>
    </div>
  );
}

export default Credits;
