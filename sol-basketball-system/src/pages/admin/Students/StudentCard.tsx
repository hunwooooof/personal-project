import { Link } from 'react-router-dom';
import { calculateAge } from '../../../utils/helpers';
import { KidType } from '../../../utils/types';
import InfoItem from './InfoItem';

interface PropsType {
  student: KidType;
}
function StudentCard({ student }: PropsType) {
  const renderLinkArrowIcon = () => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' className='w-5 h-5 stroke-black stroke-[1.5] fill-none'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
      />
    </svg>
  );
  return (
    <div key={student.id} className='kidCard bg-white'>
      <img
        src={student.photoURL}
        className='w-24 h-24 object-cover rounded-full my-2 absolute -top-14 border-2 border-white'
      />
      <div className='text-xl text-black mt-14 font-bold truncate max-w-[80%] hover:bg-zinc-100 hover:max-w-[200%] hover:z-20 hover:px-1 hover:shadow-md rounded-lg'>
        {student.firstName} {student.lastName}
      </div>
      <div className='text-black mb-4 font-semibold'>{student.chineseName}</div>
      <div className='flex flex-col w-full items-center text-sm px-8 mt-4 gap-2'>
        <InfoItem label='ID' value={student.id} />
        <InfoItem label='School' value={student.school} />
        <InfoItem label='Birthday' value={student.birthday} />
        <InfoItem label='Age' value={calculateAge(student.birthday)} />
        <Link to={`/session/${student.id}`} className='self-end -mr-4 hover:scale-110 duration-150'>
          {renderLinkArrowIcon()}
        </Link>
      </div>
    </div>
  );
}

export default StudentCard;
