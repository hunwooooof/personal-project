import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit } from '../../components/Icon';
import LoadingAnimation from '../../components/LoadingAnimation';
import PageTitle from '../../components/PageTitle';
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
  const { setCurrentNav, user, userRef, isLogin, getUserProfile, isLoading, setLoading } = useStore();
  const [isEditProfile, setEditProfile] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [newProfile, setNewProfile] = useState<NewProfileType>({
    photoURL: user?.photoURL || '',
    displayName: user?.displayName || '',
    phoneNumber: user?.phoneNumber || '',
  });

  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
      setCurrentNav('');
      setLoading(false);
    } else if (isLogin) {
      setCurrentNav('profile');
      setLoading(false);
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
        .then(() => getUserProfile(userRef))
        .then(() => {
          setEditProfile(false);
          setLoading(false);
        });
      setNewProfileImg(undefined);
    } else if (userRef) {
      firestore.updateDocByRef(userRef, { ...newProfile }).then(() => {
        setEditProfile(false);
        setLoading(false);
      });
    }
    getUserProfile(userRef);
  };

  const isInvalidName = newProfile.displayName.length > 26;

  return (
    <div className='custom-main-container pt-6 lg:pt-14'>
      {isLoading && <LoadingAnimation />}
      {!isLoading && (
        <>
          <PageTitle title='Profile' />
          <div className='mx-8 md:mx-12 lg:mx-20 flex items-center py-6'>
            <div className='w-full relative pt-10 pb-6 flex items-center justify-center gap-8 my-4 bg-white rounded-3xl'>
              <div className='absolute top-0 left-0 rounded-t-3xl bg-slate-400 w-full h-6' />
              <div className='relative'>
                <img
                  src={isEditProfile ? newProfile.photoURL : user.photoURL}
                  className='w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full border bg-white'
                />
                {isEditProfile && (
                  <div>
                    <input
                      type='file'
                      id='userPhoto'
                      accept='image/*'
                      ref={inputFileRef}
                      onChange={handleImageChange}
                      className='hidden'
                    />
                    <label
                      htmlFor='userPhoto'
                      className='absolute left-0 top-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex opacity-0 hover:opacity-100 hover:bg-gray-600/70 cursor-pointer items-center justify-center duration-150'>
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
              </div>
              <div className='w-72 sm:w-60 md:w-auto flex flex-col md:flex-row gap-1 md:gap-0 text-black'>
                <div className='flex flex-row md:flex-col mr-10 gap-2'>
                  <div className='px-2 text-gray-500 pt-1 md:pt-0'>Name</div>
                  {isEditProfile ? (
                    <div className='relative'>
                      <input
                        type='text'
                        value={newProfile.displayName}
                        id='displayName'
                        onChange={handleChangeProfile}
                        className={`px-2 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 ${
                          isInvalidName && 'text-red-500 ring-2 ring-red-500'
                        }`}
                      />
                      {isInvalidName && (
                        <div className='absolute -bottom-5 -right-5 text-red-500 text-sm scale-80 whitespace-nowrap'>
                          Exceeds the maximum character limit.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className='px-2 py-1'>{user.displayName}</div>
                  )}
                </div>
                <div className='flex flex-row md:flex-col w-32 gap-2'>
                  <div className='px-2 text-gray-500 pt-1 md:pt-0'>Phone</div>
                  {!isEditProfile &&
                    (user.phoneNumber?.length === 0 ? (
                      <div className='px-2'>N/A</div>
                    ) : (
                      <div className='px-2 py-1'>{user.phoneNumber}</div>
                    ))}
                  {isEditProfile && (
                    <input
                      type='text'
                      value={newProfile.phoneNumber}
                      id='phoneNumber'
                      onChange={handleChangeProfile}
                      className='px-2 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200'
                    />
                  )}
                </div>
                <div className='flex flex-row md:flex-col w-40 gap-2'>
                  <div className='text-gray-500 pt-1 md:pt-0 pl-2 md:pl-6'>Email</div>
                  <div className='pl-6 py-1'>{user.email}</div>
                </div>
              </div>
              {isEditProfile ? (
                <button
                  onClick={() => {
                    setLoading(true);
                    handleSaveProfile();
                  }}
                  disabled={isInvalidName}
                  className='absolute right-4 bottom-4 text-center w-14 py-1 border rounded-xl text-zinc-500 hover:scale-110 duration-150 disabled:text-zinc-300'>
                  Save
                </button>
              ) : (
                <div
                  className='absolute right-0 bottom-2 cursor-pointer w-14 py-1 rounded-xl hover:text-zinc-300 hover:scale-110 duration-150 text-zinc-200'
                  onClick={() => {
                    setEditProfile(true);
                    setNewProfile({
                      displayName: user?.displayName || '',
                      phoneNumber: user?.phoneNumber || '',
                      photoURL: user?.photoURL || '',
                    });
                  }}>
                  {Edit('w-6 h-6 mx-auto')}
                </div>
              )}
            </div>
          </div>
          {user.role === 'user' && (
            <div>
              <div className='border-t border-gray-600 pt-4 lg:pt-8'>
                <PageTitle title='Kids' />
              </div>
              <div className='mx-0 md:mx-12 lg:mx-20 flex items-center pt-4 pb-4'>
                <Kids />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Profile;
