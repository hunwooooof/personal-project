import { useEffect, useState } from 'react';
import { db, doc, getDoc } from '../../utils/firebase';

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
    getDoc(doc(db, 'credits', currentKidId)).then((creditSnap) => {
      const credit = creditSnap.data();
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
    <div>
      <div className='mt-6  px-3 py-2 text-xl border-b border-gray-200'>Credits</div>
      <div className='flex justify-center gap-11 py-8'>
        <div className='flex flex-col w-52 justify-center items-center'>
          <div className='text-5xl mb-3'>{credit.all}</div>
          <div className='text-gray-600'>Session Credits Purchased</div>
        </div>
        <div className='flex flex-col w-52 justify-center items-center'>
          <div className='text-5xl mb-3'>{credit.used}</div>
          <div className='text-gray-600'>Credits Used</div>
        </div>
        <div className='flex flex-col w-52 justify-center items-center'>
          <div className='text-5xl mb-3'>{credit.left}</div>
          <div className='text-gray-600'>Credits Remaining</div>
        </div>
      </div>
    </div>
  );
}

export default Credits;
