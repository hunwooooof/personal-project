import { Button, Input } from '@nextui-org/react';
import { useRef, useState } from 'react';
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
    if (!Object.values(newKid).some((item) => item.length === 0)) {
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
      setAddingKid(false);
    } else {
      alert('Something miss!');
    }
  };

  return (
    <div className='flex gap-8 items-center overflow-x-auto pt-4 pb-10'>
      {kids.length > 0 &&
        kids.map((kid) => {
          return <Card kid={kid as KidType} key={kid.docId} />;
        })}
      {!isAddingKid && (
        <div className='kidCard border-4 border-gray-700 border-dashed'>
          <div
            className='my-auto font-bold text-gray-700 cursor-pointer hover:scale-125 hover:text-white duration-150'
            onClick={() => setAddingKid(true)}>
            Add a kid
          </div>
        </div>
      )}
      {isAddingKid && (
        <div className='kidCard bg-white border-none'>
          <img
            src={newKid.photoURL}
            className={
              'w-24 h-24 object-cover rounded-full my-2 absolute -top-14 border-solid border-2 border-white opacity-100'
            }
          />
          <input
            type='file'
            id='nedKidPhoto'
            accept='image/*'
            ref={inputKidFileRef}
            onChange={handleImageChange}
            className='hidden'
          />
          <label
            htmlFor='nedKidPhoto'
            className='absolute -top-14 w-24 h-24 my-2 left-[72px] border-2 border-white rounded-full flex opacity-0 hover:opacity-100 hover:bg-gray-600/70 cursor-pointer items-center justify-center duration-150'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
              />
            </svg>
          </label>
          <div className='flex items-center gap-1 mt-14 px-4'>
            <Input
              isRequired
              size='sm'
              label='First name'
              type='text'
              id='firstName'
              classNames={{
                inputWrapper: ['h-9', 'py-0', 'px-2'],
              }}
              value={newKid.firstName}
              onChange={handleChangeNewKidProfile}
            />
            <Input
              isRequired
              size='sm'
              label='Last name'
              type='text'
              id='lastName'
              classNames={{
                inputWrapper: ['h-9', 'py-0', 'px-2'],
              }}
              value={newKid.lastName}
              onChange={handleChangeNewKidProfile}
            />
          </div>
          <Input
            isRequired
            size='sm'
            label='Chinese name'
            type='text'
            id='chineseName'
            className='my-2'
            classNames={{
              inputWrapper: ['h-9', 'py-0', 'mx-4', 'w-auto'],
            }}
            value={newKid.chineseName}
            onChange={handleChangeNewKidProfile}
          />
          <div className={`flex flex-col w-full items-center text-sm ${isAddingKid && 'px-4'}`}>
            <div className='w-full flex items-center mb-2 text-black justify-between'>
              <span className='inline-block w-4/12 mr-2 text-gray-500'>ID</span>
              <Input
                isRequired
                size='sm'
                type='text'
                id='id'
                placeholder='A123456789'
                className='inline-block w-7/12'
                classNames={{
                  inputWrapper: ['h-6', 'py-0', 'px-2'],
                }}
                value={newKid.id}
                onChange={handleChangeNewKidProfile}
              />
            </div>
            <div className='w-full flex items-center mb-2 text-black justify-between'>
              <span className='inline-block w-4/12 mr-2 text-gray-500'>School</span>
              <Input
                isRequired
                size='sm'
                type='text'
                id='school'
                className='inline-block w-7/12'
                classNames={{
                  inputWrapper: ['h-6', 'py-0', 'px-2'],
                }}
                value={newKid.school}
                onChange={handleChangeNewKidProfile}
              />
            </div>
            <div className='w-full flex items-center mb-2 text-black justify-between'>
              <span className='inline-block w-4/12 mr-2 text-gray-500'>Birthday</span>
              <Input
                isRequired
                size='sm'
                type='date'
                id='birthday'
                className='inline-block w-7/12'
                classNames={{
                  inputWrapper: ['h-6', 'py-0', 'px-2'],
                }}
                value={newKid.birthday}
                onChange={handleChangeNewKidProfile}
              />
            </div>
          </div>
          <div className='px-4 w-full flex mt-2 justify-between items-center'>
            <Button
              isIconOnly
              color='default'
              aria-label='cancel'
              className='rounded-full min-w-unit-8 w-unit-8 h-unit-8'
              onClick={() => {
                setAddingKid(false);
                setNewKid({ ...emptyNewKid });
              }}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </Button>
            <Button
              isIconOnly
              color='success'
              aria-label='save'
              className='rounded-full min-w-unit-8 w-unit-8 h-unit-8'
              onClick={handleAddNewKid}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-5 h-5'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
              </svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Kids;
