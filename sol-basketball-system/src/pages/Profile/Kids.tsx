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

function Kids() {
  const { user, userRef, kidsRef, kids, setUser, isLogin, getUserProfile, getKidsProfile } = useStore();
  const [isAddingKid, setAddingKid] = useState(false);
  const inputFieldClass = 'rounded-md px-2 w-full';

  // =============
  //   Edit Kid
  // =============
  const [isEditKid, setEditKid] = useState(false);

  // =============
  //  Add New Kid
  // =============

  const [newKid, setNewKid] = useState({
    firstName: '',
    lastName: '',
    chineseName: '',
    birthday: '',
    id: '',
    school: '',
  });

  const handleChangeNewKidProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    setNewKid({ ...newKid, [id]: e.target.value });
  };

  const handleAddNewKid = () => {
    setDoc(doc(db, 'students', newKid.id), newKid);
    if (userRef)
      updateDoc(userRef, {
        kids: arrayUnion(doc(db, 'students', newKid.id)),
      });
    getUserProfile(userRef);
  };

  const renderEditIcon = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='w-6 h-6 inline-block text-gray-400 cursor-pointer self-end'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
        />
      </svg>
    );
  };

  const renderCakeIcon = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
        fill='currentColor'
        className='w-5 h-5 inline-block text-gray-400'>
        <path d='M6.75.98l-.884.883a1.25 1.25 0 101.768 0L6.75.98zM13.25.98l-.884.883a1.25 1.25 0 101.768 0L13.25.98zM10 .98l.884.883a1.25 1.25 0 11-1.768 0L10 .98zM7.5 5.75a.75.75 0 00-1.5 0v.464c-1.179.305-2 1.39-2 2.622v.094c.1-.02.202-.038.306-.051A42.869 42.869 0 0110 8.5c1.93 0 3.83.129 5.694.379.104.013.206.03.306.051v-.094c0-1.232-.821-2.317-2-2.622V5.75a.75.75 0 00-1.5 0v.318a45.645 45.645 0 00-1.75-.062V5.75a.75.75 0 00-1.5 0v.256c-.586.01-1.17.03-1.75.062V5.75zM4.505 10.365A41.377 41.377 0 0110 10c1.863 0 3.697.124 5.495.365C16.967 10.562 18 11.838 18 13.28v.693a3.72 3.72 0 01-1.665-.393 5.222 5.222 0 00-4.67 0 3.722 3.722 0 01-3.33 0 5.222 5.222 0 00-4.67 0A3.72 3.72 0 012 13.972v-.693c0-1.441 1.033-2.716 2.505-2.914zM15.665 14.921a5.22 5.22 0 002.335.551V16.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 16.5v-1.028c.8 0 1.6-.183 2.335-.551a3.722 3.722 0 013.33 0c1.47.735 3.2.735 4.67 0a3.722 3.722 0 013.33 0z' />
      </svg>
    );
  };

  const renderSchoolIcon = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
        fill='currentColor'
        className='w-5 h-5 inline-block text-gray-400'>
        <path
          fillRule='evenodd'
          d='M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424zM6 11.459a29.848 29.848 0 00-2.455-1.158 41.029 41.029 0 00-.39 3.114.75.75 0 00.419.74c.528.256 1.046.53 1.554.82-.21.324-.455.63-.739.914a.75.75 0 101.06 1.06c.37-.369.69-.77.96-1.193a26.61 26.61 0 013.095 2.348.75.75 0 00.992 0 26.547 26.547 0 015.93-3.95.75.75 0 00.42-.739 41.053 41.053 0 00-.39-3.114 29.925 29.925 0 00-5.199 2.801 2.25 2.25 0 01-2.514 0c-.41-.275-.826-.541-1.25-.797a6.985 6.985 0 01-1.084 3.45 26.503 26.503 0 00-1.281-.78A5.487 5.487 0 006 12v-.54z'
          clipRule='evenodd'
        />
      </svg>
    );
  };

  const renderPlusCircle = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
        fill='currentColor'
        className='w-16 h-16 cursor-pointer'>
        <path
          fillRule='evenodd'
          d='M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z'
          clipRule='evenodd'
        />
      </svg>
    );
  };

  return (
    <div className='w-8/12 mx-auto mt-28 flex gap-12 items-center overflow-x-auto py-4'>
      {kids.length > 0 &&
        kids.map((kid) => {
          return (
            <div className='flex flex-col shrink-0 items-center w-56 h-80 bg-gray-200 p-3 rounded-md' key={kid.id}>
              {renderEditIcon()}
              <img src={kid.photoURL} className='w-24 rounded-full mb-5' />
              <div className='text-xl text-black mb-5'>{kid.firstName}</div>
              <div className='flex w-8/12 gap-1 mb-2'>
                {renderCakeIcon()}
                {kid.birthday}
              </div>
              <div className='flex w-8/12 gap-1'>
                {renderSchoolIcon()}
                {kid.school}
              </div>
            </div>
          );
        })}
      {!isAddingKid && <span onClick={() => setAddingKid(true)}>{renderPlusCircle()}</span>}
      {isAddingKid && (
        <div className='flex flex-col gap-1 items-center w-56 h-80 shrink-0 bg-gray-100 p-3 rounded-md'>
          <img
            src='https://firebasestorage.googleapis.com/v0/b/sol-basketball.appspot.com/o/default-avatar-profile.png?alt=media&token=2ca8bd76-a025-4b94-a2f6-d5d39210289c'
            className='w-16 rounded-full mb-1'
          />
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
              className='px-1 rounded-sm bg-gray-300 hover:bg-gray-400'
              onClick={() => {
                setAddingKid(false);
              }}>
              Cancel
            </button>
            <button
              className='px-1 rounded-sm bg-gray-300 hover:bg-gray-400'
              onClick={() => {
                setAddingKid(false);
                handleAddNewKid();
              }}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Kids;
