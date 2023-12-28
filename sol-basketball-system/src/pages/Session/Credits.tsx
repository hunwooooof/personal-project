import { useEffect, useState } from 'react';
import PageTitle from '../../components/PageTitle';
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
  const SESSION_CREDITS_PURCHASED = 'Session Credits Purchased';
  const CREDITS_USED = 'Credits Used';
  const CREDITS_REMAINING = 'Credits Remaining';
  const [credit, setCredit] = useState<CreditsType>({
    all: 0,
    used: 0,
    left: 0,
  });

  const creditCategories = [
    { value: credit.all, label: SESSION_CREDITS_PURCHASED },
    { value: credit.used, label: CREDITS_USED },
    { value: credit.left, label: CREDITS_REMAINING },
  ];

  useEffect(() => {
    firestore
      .getDoc('credits', currentKidId)
      .then((credit) => {
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
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentKidId]);

  return (
    <div className='border-b border-gray-600'>
      <div className='border-t border-gray-600 pt-4 lg:pt-8'>
        <PageTitle title='Credits' />
      </div>

      <div className='flex justify-center gap-11 py-6 mb-6'>
        {creditCategories.map((creditCategory) => (
          <div key={creditCategory.label} className='flex flex-col w-52 justify-center items-center'>
            <div className='text-5xl mb-3'>{creditCategory.value}</div>
            <div className='text-gray-500'>{creditCategory.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Credits;
