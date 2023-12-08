import { useRef, useState } from 'react';
import { PlusCircle } from '../../components/Icon';
import { useStore } from '../../store/store';
import { firebaseStorage } from '../../utils/firebaseStorage';
import { db, doc, firestore } from '../../utils/firestore';
import Card from './Card';

interface KidType {
  docId: string;
  firstName: string;
  lastName: string;
  chineseName: string;
  birthday: string;
  id: string;
  school: string;
  photoURL: string;
}

function Kids() {
  const { userRef, kids, getUserProfile } = useStore();
  const [isAddingKid, setAddingKid] = useState(false);
  const inputKidFileRef = useRef(null);
  const inputFieldClass = 'rounded-sm px-2 w-full bg-slate-700';
  const defaultPhotoURL =
    'https://firebasestorage.googleapis.com/v0/b/sol-basketball.appspot.com/o/default-avatar-profile.png?alt=media&token=2ca8bd76-a025-4b94-a2f6-d5d39210289c';
  const emptyNewKid = {
    firstName: '',
    lastName: '',
    chineseName: '',
    birthday: '',
    id: '',
    school: '',
    photoURL: defaultPhotoURL,
  };
  const [newKid, setNewKid] = useState({ ...emptyNewKid });

  const [newProfileImg, setNewProfileImg] = useState<File>();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const image = e.target.files[0];
      const unitTime = Date.now();
      const storageReferenceRoot = `temporary-folder/${unitTime}${image.name}`;
      firebaseStorage.uploadAndGetDownloadURL(storageReferenceRoot, image).then((url) => {
        setNewKid({ ...newKid, photoURL: url });
      });
      setNewProfileImg(image);
    } else {
      setNewKid({ ...newKid, photoURL: defaultPhotoURL });
    }
  };

  const handleChangeNewKidProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    setNewKid({ ...newKid, [id]: e.target.value.trim() });
  };

  const handleAddNewKid = () => {
    const { birthday, id } = newKid;
    const docId = `${birthday}${id}`;
    const unitTime = Date.now();
    if (newProfileImg && userRef) {
      const storageReferenceRoot = `users-photo/${unitTime}${newProfileImg.name}`;
      firebaseStorage.uploadAndGetDownloadURL(storageReferenceRoot, newProfileImg).then((url) => {
        const newKidWithDocId = { ...newKid, docId, photoURL: url };
        firestore.setDoc('students', docId, newKidWithDocId);
        firestore.setDoc('attendance', docId, {
          name: `${newKidWithDocId.firstName}-${newKidWithDocId.lastName}`,
          showUpDate: [],
          docId,
        });
        firestore
          .updateDocArrayUnionByRef(userRef, 'kids', doc(db, 'students', docId))
          .then(() => getUserProfile(userRef));
      });
      setNewProfileImg(undefined);
    } else if (userRef) {
      const newKidWithDocId = { ...newKid, docId };
      firestore.setDoc('students', docId, newKidWithDocId);
      firestore.setDoc('attendance', docId, {
        name: `${newKidWithDocId.firstName}-${newKidWithDocId.lastName}`,
        showUpDate: [],
        docId,
      });
      firestore
        .updateDocArrayUnionByRef(userRef, 'kids', doc(db, 'students', docId))
        .then(() => getUserProfile(userRef));
    }
    setNewKid(emptyNewKid);
  };

  return (
    <div className='flex gap-8 items-center overflow-x-auto py-4'>
      {kids.length === 0 && !isAddingKid && (
        <div className='h-80 flex items-center text-gray-400'>Click to add student information!</div>
      )}
      {kids.length > 0 &&
        kids.map((kid) => {
          return <Card kid={kid as KidType} key={kid.docId} />;
        })}
      {!isAddingKid && <span>{PlusCircle('w-16 h-16 cursor-pointer', () => setAddingKid(true))}</span>}
      {isAddingKid && (
        <div className='flex flex-col gap-3 items-center w-56 h-96 shrink-0 px-5 py-3 border border-gray-600 rounded-sm'>
          <div className='relative w-full flex flex-col items-center'>
            <img src={newKid.photoURL} className='w-16 h-16 object-cover rounded-full mb-1' />
            <input
              type='file'
              id='fileInput'
              accept='image/*'
              ref={inputKidFileRef}
              className='hidden'
              onChange={handleImageChange}
            />
            <label
              htmlFor='fileInput'
              className='absolute right-12 bottom-0 p-1 text-white cursor-pointer text-sm hover:scale-125 duration-150'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-3 h-3'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
                />
              </svg>
            </label>
          </div>
          <input
            type='text'
            name='firstName'
            id='firstName'
            placeholder='First Name *'
            onChange={handleChangeNewKidProfile}
            className={inputFieldClass}
          />
          <input
            type='text'
            name='lastName'
            id='lastName'
            placeholder='Last Name *'
            onChange={handleChangeNewKidProfile}
            className={inputFieldClass}
          />
          <input
            type='text'
            name='chineseName'
            id='chineseName'
            placeholder='Chinese Name *'
            onChange={handleChangeNewKidProfile}
            className={inputFieldClass}
          />
          <div>
            <label htmlFor='birthday' className='text-gray-400 text-sm self-start'>
              Birthday
            </label>
            <input
              type='date'
              name='birthday'
              id='birthday'
              onChange={handleChangeNewKidProfile}
              className={inputFieldClass}
            />
          </div>
          <input
            type='text'
            name='id'
            id='id'
            placeholder='ID (A123456789) *'
            onChange={handleChangeNewKidProfile}
            className={inputFieldClass}
          />
          <input
            type='text'
            name='school'
            id='school'
            placeholder='School *'
            onChange={handleChangeNewKidProfile}
            className={inputFieldClass}
          />
          <div className='flex gap-2 items-center mt-1 text-white'>
            <button
              className='px-1 rounded-full bg-green-600 text-md w-20 text-center hover:bg-slate-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
              disabled={Object.values(newKid).some((item) => item.length === 0)}
              onClick={() => {
                setAddingKid(false);
                handleAddNewKid();
              }}>
              Save
            </button>
            <button
              className='px-1 rounded-full bg-red-500 text-md w-20 text-center hover:bg-slate-700'
              onClick={() => {
                setAddingKid(false);
                setNewKid({ ...emptyNewKid });
              }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Kids;
