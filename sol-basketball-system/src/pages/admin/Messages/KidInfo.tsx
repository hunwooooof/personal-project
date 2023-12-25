import { KidType } from '../../../utils/types';

interface PropsType {
  kid: KidType;
}

function KidInfo({ kid }: PropsType) {
  return (
    <div className='px-3 py-2 flex items-center gap-4'>
      <img src={kid.photoURL} alt={kid.firstName} className='w-10 h-10 rounded-full bg-white' />
      <div>
        {kid.firstName} {kid.lastName}
      </div>
    </div>
  );
}

export default KidInfo;
