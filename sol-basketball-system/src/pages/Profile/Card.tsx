import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { useRef, useState } from 'react';
import { useStore } from '../../store/store';
import { firebaseStorage } from '../../utils/firebaseStorage';
import { db, doc, firestore } from '../../utils/firestore';

interface PropsType {
  kid: {
    docId: string;
    firstName: string;
    lastName: string;
    chineseName: string;
    birthday: string;
    id: string;
    school: string;
    photoURL: string;
  };
}

function Card({ kid }: PropsType) {
  const { userRef, getUserProfile } = useStore();
  const [isEdit, setEdit] = useState(false);
  const inputFileRef = useRef(null);
  const inputFieldClass = 'rounded-sm px-2 w-full bg-slate-700';

  const defaultKid = {
    firstName: kid.firstName,
    lastName: kid.lastName,
    chineseName: kid.chineseName,
    birthday: kid.birthday,
    id: kid.id,
    school: kid.school,
    photoURL: kid.photoURL,
  };

  const [newKid, setNewKid] = useState(defaultKid);
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
      setNewKid({ ...newKid, photoURL: kid.photoURL });
    }
  };

  const handleChangeKidProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    setNewKid({ ...newKid, [id]: e.target.value });
  };

  const handleSaveKid = () => {
    const { docId } = kid;
    const unitTime = Date.now();
    if (newProfileImg && userRef) {
      const storageReferenceRoot = `users-photo/${unitTime}${newProfileImg.name}`;
      firebaseStorage
        .uploadAndGetDownloadURL(storageReferenceRoot, newProfileImg)
        .then((url) => firestore.updateDoc('students', docId, { ...newKid, photoURL: url }))
        .then(() => getUserProfile(userRef));
      setNewProfileImg(undefined);
    } else if (userRef) {
      firestore.updateDoc('students', docId, newKid).then(() => getUserProfile(userRef));
    }
  };

  const [isListShow, setListShow] = useState(false);

  const calculate_age = (birthday: string) => {
    const dateOfBirth = new Date(birthday);
    const diff = Date.now() - dateOfBirth.getTime();
    const age = new Date(diff);
    return Math.abs(age.getUTCFullYear() - 1970);
  };

  return (
    <div className='mt-8'>
      <div className='flex flex-col shrink-0 bg-white rounded-3xl items-center w-56 h-[270px] relative' key={kid.id}>
        <div className='absolute right-2 top-2'>
          <Dropdown
            classNames={{
              trigger: ['min-w-unit-0', 'bg-white', 'rounded-full', 'px-unit-0', 'w-9', 'h-8'],
            }}>
            <DropdownTrigger>
              <Button>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  onClick={() => setListShow(!isListShow)}
                  className='w-7 h-7 text-gray-600 cursor-pointer hover:scale-125 duration-150 hover:text-gray-400'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z'
                  />
                </svg>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label='Static Actions'>
              <DropdownItem key='edit' color='default' onClick={() => setEdit(true)}>
                Edit file
              </DropdownItem>
              <DropdownItem
                key='delete'
                className='text-danger'
                color='danger'
                onClick={() => {
                  const userConfirmed = confirm('Are you sure you want to delete?');
                  if (userConfirmed && userRef) {
                    firestore.deleteDoc('students', kid.docId);
                    firestore.updateDocArrayRemoveByRef(userRef, 'kids', doc(db, 'students', kid.docId));
                    getUserProfile(userRef);
                  }
                }}>
                Delete file
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <img
          src={kid.photoURL}
          className='w-24 h-24 object-cover rounded-full my-2 absolute -top-14 border-2 border-white'
        />
        <div className='text-xl text-black mt-14 font-bold'>
          {kid.firstName} {kid.lastName}
        </div>
        <div className=' text-black mb-4 font-semibold'>{kid.chineseName}</div>
        <div className='pl-8 w-full py-1 text-sm'>
          <div className='w-full mb-2 text-g text-black'>
            <span className='inline-block w-5/12 text-gray-500'>ID</span>
            {kid.id}
          </div>
          <div className='w-full mb-2 text-g text-black'>
            <span className='inline-block w-5/12 text-gray-500'>School</span>
            {kid.school}
          </div>
          <div className='w-full mb-2 text-g text-black'>
            <span className='inline-block w-5/12 text-gray-500'>Birthday</span>
            {kid.birthday}
          </div>
          <div className='w-full text-g text-black'>
            <span className='inline-block w-5/12 text-gray-500'>Age</span>
            {calculate_age(kid.birthday)}
          </div>
        </div>
      </div>
      {isEdit && (
        <div className='flex flex-col gap-3 items-center w-56 h-96 shrink-0 border border-gray-600 px-5 py-3 rounded-sm'>
          <div className='relative w-full flex flex-col items-center'>
            <img src={newKid.photoURL} className='w-16 h-16 object-cover rounded-full mb-1' />
            <input
              type='file'
              id='fileInput'
              accept='image/*'
              ref={inputFileRef}
              className='hidden'
              onChange={handleImageChange}
            />
            <label
              htmlFor='fileInput'
              className='absolute right-12 bottom-0 p-1 text-white rounded-md cursor-pointer text-sm hover:scale-125 duration-150'>
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
            className={inputFieldClass}
            value={newKid.firstName}
            onChange={handleChangeKidProfile}
          />
          <input
            type='text'
            name='lastName'
            id='lastName'
            placeholder='Last Name *'
            className={inputFieldClass}
            value={newKid.lastName}
            onChange={handleChangeKidProfile}
          />
          <input
            type='text'
            name='chineseName'
            id='chineseName'
            placeholder='Chinese Name *'
            className={inputFieldClass}
            value={newKid.chineseName}
            onChange={handleChangeKidProfile}
          />
          <div>
            <label htmlFor='birthday' className='text-gray-400 text-sm self-start'>
              Birthday
            </label>
            <input
              type='date'
              name='birthday'
              id='birthday'
              className={inputFieldClass}
              value={newKid.birthday}
              onChange={handleChangeKidProfile}
            />
          </div>
          <input
            type='text'
            name='id'
            id='id'
            placeholder='ID (A123456789) *'
            className={inputFieldClass}
            value={newKid.id}
            onChange={handleChangeKidProfile}
          />
          <input
            type='text'
            name='school'
            id='school'
            placeholder='School *'
            className={inputFieldClass}
            value={newKid.school}
            onChange={handleChangeKidProfile}
          />
          <div className='flex gap-2 items-center mt-1 text-white'>
            <button
              className='px-1 rounded-full bg-green-600 hover:bg-slate-700  text-md w-20 text-center'
              onClick={() => {
                setEdit(false);
                handleSaveKid();
              }}>
              Save
            </button>
            <button
              className='px-1 rounded-full bg-red-500 hover:bg-slate-700 text-md w-20 text-center'
              onClick={() => {
                setEdit(false);
              }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
