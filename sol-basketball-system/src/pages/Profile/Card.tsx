import { useRef, useState } from 'react';
import { useStore } from '../../store/store';
import {
  arrayRemove,
  db,
  deleteDoc,
  doc,
  getDownloadURL,
  ref,
  storage,
  updateDoc,
  uploadBytes,
} from '../../utils/firebase';

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
      const storageRef = ref(storage, `temporary-folder/${unitTime}${image.name}`);
      uploadBytes(storageRef, image).then(() => {
        getDownloadURL(ref(storage, `temporary-folder/${unitTime}${image.name}`)).then((url) => {
          setNewKid({ ...newKid, photoURL: url });
        });
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
      const storageRef = ref(storage, `users-photo/${unitTime}${newProfileImg.name}`);
      uploadBytes(storageRef, newProfileImg)
        .then(() => {
          getDownloadURL(ref(storage, `users-photo/${unitTime}${newProfileImg.name}`)).then((url) => {
            const kidWithPhoto = { ...newKid, photoURL: url };
            updateDoc(doc(db, 'students', docId), kidWithPhoto);
          });
        })
        .then(() => {
          getUserProfile(userRef);
        });
      setNewProfileImg(undefined);
    } else if (userRef) {
      updateDoc(doc(db, 'students', docId), newKid).then(() => getUserProfile(userRef));
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
            deleteDoc(doc(db, 'students', kid.docId));
            updateDoc(userRef, {
              kids: arrayRemove(doc(db, 'students', kid.docId)),
            });
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

  const renderCakeIcon = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
        fill='currentColor'
        className='w-5 h-5 inline-block text-indigo-400'>
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
        className='w-5 h-5 inline-block text-indigo-400'>
        <path
          fillRule='evenodd'
          d='M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424zM6 11.459a29.848 29.848 0 00-2.455-1.158 41.029 41.029 0 00-.39 3.114.75.75 0 00.419.74c.528.256 1.046.53 1.554.82-.21.324-.455.63-.739.914a.75.75 0 101.06 1.06c.37-.369.69-.77.96-1.193a26.61 26.61 0 013.095 2.348.75.75 0 00.992 0 26.547 26.547 0 015.93-3.95.75.75 0 00.42-.739 41.053 41.053 0 00-.39-3.114 29.925 29.925 0 00-5.199 2.801 2.25 2.25 0 01-2.514 0c-.41-.275-.826-.541-1.25-.797a6.985 6.985 0 01-1.084 3.45 26.503 26.503 0 00-1.281-.78A5.487 5.487 0 006 12v-.54z'
          clipRule='evenodd'
        />
      </svg>
    );
  };

  const renderAgeIcon = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='currentColor'
        className='w-5 h-5 inline-block text-indigo-400'>
        <path
          fillRule='evenodd'
          d='M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z'
          clipRule='evenodd'
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
            {renderCakeIcon()}
            {kid.birthday}
          </div>
          <div className='flex w-8/12 gap-1 mb-2 items-center'>
            {renderSchoolIcon()}
            {kid.school}
          </div>
          <div className='flex w-8/12 gap-1 items-center'>
            {renderAgeIcon()}
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
