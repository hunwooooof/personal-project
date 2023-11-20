import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/store';
import {
  updateDoc,
  setDoc,
  db,
  doc,
  arrayUnion,
  ref,
  storage,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from '../../utils/firebase';
import Card from './Card';

function Kids() {
  const { user, userRef, kidsRef, kids, setUser, isLogin, getUserProfile, getKidsProfile } = useStore();
  const [isAddingKid, setAddingKid] = useState(false);
  const inputFileRef = useRef(null);
  const inputFieldClass = 'rounded-md px-2 w-full';

  const emptyNewKid = {
    firstName: '',
    lastName: '',
    chineseName: '',
    birthday: '',
    id: '',
    school: '',
    photoURL:
      'https://firebasestorage.googleapis.com/v0/b/sol-basketball.appspot.com/o/default-avatar-profile.png?alt=media&token=2ca8bd76-a025-4b94-a2f6-d5d39210289c',
  };
  const [newKid, setNewKid] = useState({ ...emptyNewKid });

  const [newProfileImg, setNewProfileImg] = useState(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files[0];
    const unitTime = Date.now();
    const storageRef = ref(storage, `temporary-folder/${unitTime}${image.name}`);
    uploadBytes(storageRef, image).then(() => {
      getDownloadURL(ref(storage, `temporary-folder/${unitTime}${image.name}`)).then((url) => {
        setNewKid({ ...newKid, photoURL: url });
      });
    });
    setNewProfileImg(image);
  };

  const handleChangeNewKidProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    setNewKid({ ...newKid, [id]: e.target.value });
  };

  const handleAddNewKid = () => {
    const { birthday, id } = newKid;
    const docId = `${birthday}${id}`;
    const unitTime = Date.now();
    if (newProfileImg && userRef) {
      const storageRef = ref(storage, `users-photo/${unitTime}${newProfileImg.name}`);
      uploadBytes(storageRef, newProfileImg).then(() => {
        getDownloadURL(ref(storage, `users-photo/${unitTime}${newProfileImg.name}`)).then((url) => {
          const newKidWithDocId = { ...newKid, docId, photoURL: url };
          setDoc(doc(db, 'students', docId), newKidWithDocId);
          setDoc(doc(db, 'attendance', docId), {
            name: `${newKidWithDocId.firstName}-${newKidWithDocId.lastName}`,
            showUpDate: [],
          });
          updateDoc(userRef, { kids: arrayUnion(doc(db, 'students', docId)) }).then(() => getUserProfile(userRef));
        });
      });
      setNewProfileImg(null);
    } else if (userRef) {
      const newKidWithDocId = { ...newKid, docId };
      setDoc(doc(db, 'students', docId), newKidWithDocId);
      setDoc(doc(db, 'attendance', docId), {
        name: `${newKidWithDocId.firstName}-${newKidWithDocId.lastName}`,
        showUpDate: [],
      });
      updateDoc(userRef, {
        kids: arrayUnion(doc(db, 'students', docId)),
      }).then(() => getUserProfile(userRef));
    }
    setNewKid(emptyNewKid);
  };

  const renderPlusCircle = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
        fill='currentColor'
        className='w-16 h-16 cursor-pointer'
        onClick={() => setAddingKid(true)}>
        <path
          fillRule='evenodd'
          d='M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z'
          clipRule='evenodd'
        />
      </svg>
    );
  };

  return (
    <div className='w-8/12 mx-auto mt-16 flex gap-12 items-center overflow-x-auto py-4'>
      {kids.length === 0 && !isAddingKid && (
        <div className='h-80 flex items-center text-gray-400'>Click to add student information!</div>
      )}
      {kids.length > 0 &&
        kids.map((kid) => {
          return <Card kid={kid} key={kid.docId} />;
        })}
      {!isAddingKid && <span>{renderPlusCircle()}</span>}
      {isAddingKid && (
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
            <label htmlFor='birthday' className='text-gray-600 text-sm self-start'>
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
          <div className='flex gap-2 items-center mt-1'>
            <button
              className='px-1 rounded-sm bg-green-300 hover:bg-gray-300 text-md w-20 text-center'
              onClick={() => {
                setAddingKid(false);
                handleAddNewKid();
              }}>
              Save
            </button>
            <button
              className='px-1 rounded-sm bg-red-300 hover:bg-gray-300 text-md w-20 text-center'
              onClick={() => {
                setAddingKid(false);
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
