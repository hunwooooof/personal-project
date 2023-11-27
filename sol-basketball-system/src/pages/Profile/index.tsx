import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { firestore, getDownloadURL, ref, storage, uploadBytes } from '../../utils/firestore';
import Kids from './Kids';

interface NewProfileType {
  photoURL: string;
  displayName: string;
  phoneNumber: string;
}

function Profile() {
  const navigate = useNavigate();
  const { user, userRef, isLogin, getUserProfile } = useStore();
  const [isEditProfile, setEditProfile] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [newProfile, setNewProfile] = useState<NewProfileType>({
    photoURL: user?.photoURL || '',
    displayName: user?.displayName || '',
    phoneNumber: user?.phoneNumber || '',
  });

  useEffect(() => {
    if (!isLogin) navigate('/');
  }, [isLogin]);

  const [newProfileImg, setNewProfileImg] = useState<File>();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      const unitTime = Date.now();
      const storageRef = ref(storage, `temporary-folder/${unitTime}${image.name}`);
      uploadBytes(storageRef, image).then(() => {
        getDownloadURL(ref(storage, `temporary-folder/${unitTime}${image.name}`)).then((url) => {
          setNewProfile({ ...newProfile, photoURL: url });
        });
      });
      setNewProfileImg(image);
    } else {
      setNewProfile({ ...newProfile, photoURL: user.photoURL || '' });
      setNewProfileImg(undefined);
    }
  };

  const handleChangeProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    setNewProfile({ ...newProfile, [id]: e.target.value });
  };

  const handleSaveProfile = () => {
    const unitTime = Date.now();
    if (newProfileImg && userRef) {
      const storageRef = ref(storage, `users-photo/${unitTime}${newProfileImg.name}`);
      uploadBytes(storageRef, newProfileImg).then(() => {
        getDownloadURL(ref(storage, `users-photo/${unitTime}${newProfileImg.name}`))
          .then((url) => {
            firestore.updateDocByRef(userRef, { ...newProfile });
            firestore.updateDocByRef(userRef, { photoURL: url });
          })
          .then(() => getUserProfile(userRef));
      });
      setNewProfileImg(undefined);
    } else if (userRef) firestore.updateDocByRef(userRef, { ...newProfile });
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
        className='w-6 h-6 inline-block text-gray-400 cursor-pointer'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
        />
      </svg>
    );
  };

  return (
    <div className='custom-main-container mt-28'>
      {!isEditProfile && (
        <div className='w-8/12 mx-auto flex flex-col items-center gap-3'>
          <img src={user.photoURL} className='w-24 h-24 object-cover rounded-full border border-slate-200' />
          <div>{user.displayName}</div>
          <div>{user.phoneNumber}</div>
          <div className='flex gap-2 items-center'>
            <div>{user.email}</div>
            <span
              onClick={() => {
                setEditProfile(true);
                setNewProfile({
                  displayName: user?.displayName || '',
                  phoneNumber: user?.phoneNumber || '',
                  photoURL: user?.photoURL || '',
                });
              }}>
              {renderEditIcon()}
            </span>
          </div>
        </div>
      )}
      {isEditProfile && (
        <div className='w-8/12 mx-auto '>
          <div className='w-full text-center text-2xl mb-7'>Edit profile</div>
          <div className='flex items-center justify-between bg-gray-100 rounded-md px-8 py-5'>
            <div className='flex flex-col gap-4 items-center'>
              <img
                src={newProfile.photoURL}
                className='w-24 h-24 object-cover rounded-full border border-slate-200 bg-white'
              />
              <input type='file' accept='image/*' ref={inputFileRef} onChange={handleImageChange} className=' w-60' />
            </div>
            <div className='flex flex-col justify-center gap-4 w-80 h-32'>
              <div className='flex justify-between'>
                <label>Name</label>
                <input
                  type='text'
                  value={newProfile.displayName}
                  id='displayName'
                  onChange={handleChangeProfile}
                  className='w-64 px-2 rounded-md'
                />
              </div>
              <div className='flex justify-between'>
                <label>Phone</label>
                <input
                  type='text'
                  value={newProfile.phoneNumber}
                  id='phoneNumber'
                  onChange={handleChangeProfile}
                  className='w-64 px-2 rounded-md'
                />
              </div>
            </div>
            <button
              onClick={() => {
                setEditProfile(false);
                handleSaveProfile();
              }}
              className=' text-lg px-3 bg-gray-200 rounded-sm'>
              Save
            </button>
          </div>
        </div>
      )}
      <Kids />
    </div>
  );
}

export default Profile;
