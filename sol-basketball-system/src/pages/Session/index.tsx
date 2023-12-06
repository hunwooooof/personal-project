import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import Attendance from './Attendance';
import Credits from './Credits';

function Session() {
  const navigate = useNavigate();
  const { setCurrentNav, kids, isLogin } = useStore();
  const [currentKidIndex, setCurrentKidIndex] = useState(0);

  useEffect(() => {
    if (!isLogin || kids.length === 0) {
      navigate('/');
      setCurrentNav('schedules');
    }
  }, [isLogin]);

  const calculate_age = (birthday: string) => {
    const dateOfBirth = new Date(birthday);
    const diff = Date.now() - dateOfBirth.getTime();
    const age = new Date(diff);
    return Math.abs(age.getUTCFullYear() - 1970);
  };

  return (
    <div className='custom-main-container py-14'>
      <div className='w-10/12 mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <div className='custom-page-title'>Session</div>
          <div className='flex text-lg font-bold items-center border border-gray-600'>
            {kids.map((kid, index) => {
              return (
                <div
                  key={kid.docId}
                  onClick={() => setCurrentKidIndex(index)}
                  className={`text-center rounded-sm py-1 px-4 cursor-pointer hover:bg-gray-100 ${
                    index === currentKidIndex ? 'bg-slate-600 hover:bg-slate-600' : 'hover:bg-slate-700'
                  }`}>
                  {kid.firstName}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {kids[currentKidIndex] && (
        <>
          <div className='border-b border-gray-600 pb-8'>
            <div className='w-10/12 mx-auto mt-6 flex gap-16 items-center pl-16 py-3'>
              <img src={kids[currentKidIndex]?.photoURL} className='w-20 h-20 object-cover bg-white rounded-full' />
              <div className='w-36'>
                <div className='text-gray-400 font-bold mb-2'>Name</div>
                <div className='text-lg'>
                  {kids[currentKidIndex].firstName} {kids[currentKidIndex].lastName}
                </div>
              </div>
              <div className='w-16'>
                <div className='text-gray-400 font-bold mb-2'>Age</div>
                <div className='text-lg'>{calculate_age(kids[currentKidIndex].birthday)}</div>
              </div>
              <div className='w-28'>
                <div className='text-gray-400 font-bold mb-2'>School</div>
                <div className='text-lg'>{kids[currentKidIndex].school}</div>
              </div>
              <div className='w-28'>
                <div className='text-gray-400 font-bold mb-2'>ID</div>
                <div className='text-lg'>{kids[currentKidIndex].id}</div>
              </div>
            </div>
          </div>
          <Credits currentKidId={kids[currentKidIndex].docId} />
          <Attendance currentKidId={kids[currentKidIndex].docId} />
        </>
      )}
    </div>
  );
}

export default Session;
