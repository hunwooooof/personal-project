import { useRef, useState } from 'react';
import { Age, Cake, School } from '../../components/icon';
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
  const inputFieldClass = 'rounded-md px-2 w-full';

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

  const renderTrashIcon = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
        fill='currentColor'
        onClick={() => {
          const userConfirmed = confirm('Are you sure you want to delete?');
          if (userConfirmed && userRef) {
            firestore.deleteDoc('students', kid.docId);
            firestore.updateDocArrayRemoveByRef(userRef, 'kids', doc(db, 'students', kid.docId));
            getUserProfile(userRef);
          }
        }}
        className='w-6 h-6 inline-block text-gray-300 cursor-pointer hover:text-red-400'>
        <path
          fillRule='evenodd'
          d='M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z'
          clipRule='evenodd'
        />
      </svg>
    );
  };

  const renderEditIcon = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        onClick={() => setEdit(true)}
        className='w-6 h-6 inline-block text-gray-300 cursor-pointer hover:text-blue-400'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
        />
      </svg>
    );
  };

  const calculate_age = (birthday: string) => {
    const dateOfBirth = new Date(birthday);
    const diff = Date.now() - dateOfBirth.getTime();
    const age = new Date(diff);
    return Math.abs(age.getUTCFullYear() - 1970);
  };

  return (
    <div>
      {!isEdit && (
        <div className='flex flex-col shrink-0 items-center w-56 h-96 bg-gray-200 p-3 rounded-md' key={kid.id}>
          <div className='w-full flex justify-between mb-2'>
            {renderTrashIcon()}
            {renderEditIcon()}
          </div>
          <img src={kid.photoURL} className='w-24 h-24 object-cover rounded-full mb-5' />
          <div className='text-xl text-black mb-2'>
            {kid.firstName} {kid.lastName}
          </div>
          <div className=' text-black mb-5'>{kid.chineseName}</div>
          <div className='flex w-8/12 gap-1 mb-2 items-center'>
            <Cake />
            {kid.birthday}
          </div>
          <div className='flex w-8/12 gap-1 mb-2 items-center'>
            <School />
            {kid.school}
          </div>
          <div className='flex w-8/12 gap-1 items-center'>
            <Age />
            {calculate_age(kid.birthday)} y
          </div>
        </div>
      )}
      {isEdit && (
        <div className='flex flex-col gap-3 items-center w-56 h-96 shrink-0 bg-gray-100 p-3 rounded-md'>
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
              className='absolute right-12 bottom-0 p-1 bg-zinc-300 text-white rounded-md cursor-pointer text-sm hover:bg-orange-500'>
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
            <label htmlFor='birthday' className='text-gray-600 text-sm self-start'>
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
          <div className='flex gap-2 items-center mt-1'>
            <button
              className='px-1 rounded-sm bg-green-300 hover:bg-gray-300 text-md w-20 text-center'
              onClick={() => {
                setEdit(false);
                handleSaveKid();
              }}>
              Save
            </button>
            <button
              className='px-1 rounded-sm bg-red-300 hover:bg-gray-300 text-md w-20 text-center'
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
