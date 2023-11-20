import { useEffect, useState } from 'react';
import { useStore } from '../../store/store';
import { useNavigate } from 'react-router-dom';

function Session() {
  const navigate = useNavigate();
  const { user, userRef, kidsRef, kids, setUser, isLogin, getUserProfile, getKidsProfile } = useStore();
  const [currentKidIndex, setCurrentKidIndex] = useState(0);

  useEffect(() => {
    if (!isLogin || kids.length === 0) navigate('/');
  }, [isLogin]);

  const calculate_age = (birthday: string) => {
    const dateOfBirth = new Date(birthday);
    const diff = Date.now() - dateOfBirth.getTime();
    const age = new Date(diff);
    return Math.abs(age.getUTCFullYear() - 1970);
  };

  return (
    <div className='custom-main-container mt-28'>
      <div className='w-10/12 mx-auto'>
        <div className='flex gap-10 text-xl border-b border-gray-200'>
          {kids.map((kid, index) => {
            return (
              <div
                key={kid.docId}
                onClick={() => setCurrentKidIndex(index)}
                className={`rounded-md px-3 py-2 cursor-pointer hover:bg-[#CCFBF1] ${
                  index === currentKidIndex ? 'border-b-4 border-[#14B8A6] rounded-b-none' : ''
                }`}>
                {kid.firstName}
              </div>
            );
          })}
        </div>
        <div className='mt-6 flex gap-16 items-center pl-16 py-3'>
          <img src={kids[currentKidIndex].photoURL} className='w-20 h-20 object-cover bg-white rounded-full' />
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
        <div className='mt-6  px-3 py-2 text-xl border-b border-gray-200'>Credits</div>
        <div className='mt-6  px-3 py-2 text-xl border-b border-gray-200'>Attendance</div>
      </div>
    </div>
  );
}

export default Session;
