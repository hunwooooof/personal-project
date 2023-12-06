import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit } from '../../components/Icon';
import { useStore } from '../../store/store';
import { firebaseStorage } from '../../utils/firebaseStorage';
import { firestore } from '../../utils/firestore';
import Kids from './Kids';

interface NewProfileType {
  photoURL: string;
  displayName: string;
  phoneNumber: string;
}

function Profile() {
  const navigate = useNavigate();
  const { setCurrentNav, user, userRef, isLogin, getUserProfile } = useStore();
  const [isEditProfile, setEditProfile] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [newProfile, setNewProfile] = useState<NewProfileType>({
    photoURL: user?.photoURL || '',
    displayName: user?.displayName || '',
    phoneNumber: user?.phoneNumber || '',
  });

  useEffect(() => {
    if (!isLogin) {
      navigate('/');
      setCurrentNav('schedules');
    }
  }, [isLogin]);

  const [newProfileImg, setNewProfileImg] = useState<File>();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      const unitTime = Date.now();

      const storageReferenceRoot = `temporary-folder/${unitTime}${image.name}`;
      firebaseStorage
        .uploadAndGetDownloadURL(storageReferenceRoot, image)
        .then((url) => setNewProfile({ ...newProfile, photoURL: url }));
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
      const storageReferenceRoot = `users-photo/${unitTime}${newProfileImg.name}`;
      firebaseStorage
        .uploadAndGetDownloadURL(storageReferenceRoot, newProfileImg)
        .then((url) => {
          firestore.updateDocByRef(userRef, { ...newProfile });
          firestore.updateDocByRef(userRef, { photoURL: url });
        })
        .then(() => getUserProfile(userRef));
      setNewProfileImg(undefined);
    } else if (userRef) firestore.updateDocByRef(userRef, { ...newProfile });
    getUserProfile(userRef);
  };

  return (
    <div className='custom-main-container pt-16'>
      <div className='border-b border-gray-600 pb-4'>
        <div className='w-9/12 mx-auto'>
          <div className='custom-page-title'>Profile</div>
          {!isEditProfile && (
            <div className='flex items-center justify-center gap-16 p-8'>
              <img src={user.photoURL} className='w-24 h-24 object-cover rounded-full border bg-white' />
              <div className='w-80 flex flex-col gap-2'>
                <div className='flex gap-10 items-center'>
                  <div className='text-gray-500 w-14'>Name</div>
                  {user.displayName}
                </div>
                <div className='flex gap-10 items-center'>
                  <div className='text-gray-500 w-14'>Phone</div>
                  {user.phoneNumber}
                </div>
                <div className='flex gap-10 items-center'>
                  <div className='text-gray-500 w-14'>Email</div>
                  {user.email}
                </div>
              </div>
              <span
                onClick={() => {
                  setEditProfile(true);
                  setNewProfile({
                    displayName: user?.displayName || '',
                    phoneNumber: user?.phoneNumber || '',
                    photoURL: user?.photoURL || '',
                  });
                }}>
                {Edit('w-6 h-6 inline-block text-gray-400 cursor-pointer')}
              </span>
            </div>
          )}
          {isEditProfile && (
            <div className='flex items-center justify-center gap-16 p-8'>
              <div className='flex flex-col gap-4 items-center'>
                <img
                  src={newProfile.photoURL}
                  className='w-24 h-24 object-cover rounded-full border border-slate-200 bg-white'
                />
                <input type='file' accept='image/*' ref={inputFileRef} onChange={handleImageChange} className=' w-60' />
              </div>
              <div className='flex flex-col justify-center gap-4 w-80 h-32'>
                <div className='flex justify-between items-center'>
                  <label className='text-gray-500'>Name</label>
                  <input
                    type='text'
                    value={newProfile.displayName}
                    id='displayName'
                    onChange={handleChangeProfile}
                    className='w-64 px-2 py-1 rounded-sm bg-slate-700'
                  />
                </div>
                <div className='flex justify-between items-center'>
                  <label className='text-gray-500'>Phone</label>
                  <input
                    type='text'
                    value={newProfile.phoneNumber}
                    id='phoneNumber'
                    onChange={handleChangeProfile}
                    className='w-64 px-2 py-1 rounded-sm bg-slate-700'
                  />
                </div>
                <button
                  onClick={() => {
                    setEditProfile(false);
                    handleSaveProfile();
                  }}
                  className='text-white px-3 py-1 border border-gray-600 rounded-sm hover:bg-slate-600'>
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='w-9/12 mx-auto'>
        <div className='custom-page-title mt-8'>Kids</div>
        <Kids />
      </div>
    </div>
  );
}

export default Profile;
