import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from '@nextui-org/react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const { userRef, getUserProfile, setLoading } = useStore();
  const [isEdit, setEdit] = useState(false);
  const inputFileRef = useRef(null);
  const { docId, id } = kid;

  const defaultKid = {
    firstName: kid.firstName,
    lastName: kid.lastName,
    chineseName: kid.chineseName,
    birthday: kid.birthday,
    id,
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
    const unitTime = Date.now();
    if (newProfileImg && userRef) {
      const storageReferenceRoot = `users-photo/${unitTime}${newProfileImg.name}`;
      firebaseStorage
        .uploadAndGetDownloadURL(storageReferenceRoot, newProfileImg)
        .then((url) => firestore.updateDoc('students', docId, { ...newKid, photoURL: url }))
        .then(() => getUserProfile(userRef))
        .then(() => {
          setLoading(false);
          setEdit(false);
        });
      setNewProfileImg(undefined);
    } else if (userRef) {
      firestore
        .updateDoc('students', docId, newKid)
        .then(() => getUserProfile(userRef))
        .then(() => {
          setLoading(false);
          setEdit(false);
        });
    }
    firestore.setDoc('attendance', docId, {
      name: `${newKid.firstName}-${newKid.lastName}`,
      showUpDate: [],
      docId,
    });
  };

  const [isListShow, setListShow] = useState(false);

  const calculate_age = (birthday: string) => {
    const dateOfBirth = new Date(birthday);
    const diff = Date.now() - dateOfBirth.getTime();
    const age = new Date(diff);
    return Math.abs(age.getUTCFullYear() - 1970);
  };

  return (
    <div className='kidCard bg-white'>
      <div className='absolute right-1 top-2'>
        {!isEdit && (
          <Dropdown
            className='z-10'
            classNames={{
              trigger: ['min-w-unit-0', 'bg-white', 'rounded-full', 'px-unit-0', 'w-8', 'h-8', 'hover:bg-gray-100'],
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
                  className='w-6 h-6 text-gray-300 cursor-pointer hover:scale-125 duration-150 hover:text-gray-400'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z'
                  />
                </svg>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label='Static Actions'>
              <DropdownItem
                key='edit'
                color='default'
                onClick={() => {
                  setNewKid({
                    firstName: kid.firstName,
                    lastName: kid.lastName,
                    chineseName: kid.chineseName,
                    birthday: kid.birthday,
                    id,
                    school: kid.school,
                    photoURL: kid.photoURL,
                  });
                  setEdit(true);
                }}>
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
        )}
      </div>
      <img
        src={isEdit ? newKid.photoURL : kid.photoURL}
        className='w-24 h-24 object-cover rounded-full my-2 absolute -top-14 border-2 border-white'
      />
      {isEdit && (
        <div>
          <input
            type='file'
            id='fileInput'
            accept='image/*'
            ref={inputFileRef}
            onChange={handleImageChange}
            className='hidden'
          />
          <label
            htmlFor='fileInput'
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
        </div>
      )}
      {!isEdit && (
        <div className='text-xl text-black mt-14 font-bold'>
          {kid.firstName} {kid.lastName}
        </div>
      )}
      {isEdit && (
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
            onChange={handleChangeKidProfile}
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
            onChange={handleChangeKidProfile}
          />
        </div>
      )}
      {!isEdit && <div className=' text-black mb-4 font-semibold'>{kid.chineseName}</div>}
      {isEdit && (
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
          onChange={handleChangeKidProfile}
        />
      )}
      <div className={`flex flex-col w-full items-center text-sm ${isEdit ? 'px-4' : 'px-8 mt-4 gap-2'}`}>
        <div
          className={`w-full flex items-center mb-2 text-black ${isEdit ? 'justify-between' : 'justify-start gap-2'}`}>
          <span className='inline-block w-4/12 mr-2 text-gray-500'>ID</span>
          {!isEdit && kid.id}
          {isEdit && (
            <Input
              isRequired
              size='sm'
              type='text'
              id='id'
              className='inline-block w-7/12'
              classNames={{
                inputWrapper: ['h-6', 'py-0', 'px-2'],
              }}
              value={newKid.id}
              onChange={handleChangeKidProfile}
            />
          )}
        </div>
        <div
          className={`w-full flex items-center mb-2 text-black ${isEdit ? 'justify-between' : 'justify-start gap-2'}`}>
          <span className='inline-block w-4/12 mr-2 text-gray-500'>School</span>
          {!isEdit && kid.school}
          {isEdit && (
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
              onChange={handleChangeKidProfile}
            />
          )}
        </div>
        <div
          className={`w-full flex items-center mb-2 text-black ${isEdit ? 'justify-between' : 'justify-start gap-2'}`}>
          <span className='inline-block w-4/12 mr-2 text-gray-500'>Birthday</span>
          {!isEdit && kid.birthday}
          {isEdit && (
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
              onChange={handleChangeKidProfile}
            />
          )}
        </div>
        {!isEdit && (
          <div className='w-full flex items-center mb-2 text-black justify-start gap-2'>
            <span className='inline-block w-4/12 mr-2 text-gray-500'>Age</span>
            {calculate_age(kid.birthday)}
          </div>
        )}
        {!isEdit && (
          <Link to={`/session/${id}`} className='self-end -mr-4 hover:scale-110 duration-150'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              className='w-5 h-5 stroke-black stroke-[1.5]'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
              />
            </svg>
          </Link>
        )}
        {isEdit && (
          <div className='w-full flex mt-2 justify-between items-center'>
            <Button
              isIconOnly
              color='default'
              aria-label='cancel'
              className='rounded-full min-w-unit-8 w-unit-8 h-unit-8'
              onClick={() => {
                setEdit(false);
                setNewKid(defaultKid);
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
              onClick={() => {
                setLoading(true);
                handleSaveKid();
              }}>
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
        )}
      </div>
    </div>
  );
}

export default Card;
