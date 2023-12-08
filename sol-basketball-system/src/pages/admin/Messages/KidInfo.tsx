interface KidType {
  docId: string;
  birthday: string;
  chineseName: string;
  firstName: string;
  id: string;
  lastName: string;
  school: string;
  photoURL?: string;
}

interface PropsType {
  kid: KidType;
}

function KidInfo({ kid }: PropsType) {
  return (
    <div className='hover:bg-slate-600 px-3 py-2 flex items-center gap-4'>
      <img src={kid.photoURL} alt={kid.firstName} className='w-10 h-10 rounded-full bg-white' />
      <div>
        {kid.firstName} {kid.lastName}
      </div>
    </div>
  );
}

export default KidInfo;
