import { Button, Input } from '@nextui-org/react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useStore } from '../../store/store';
import { firebaseStorage } from '../../utils/firebaseStorage';
import { db, doc, firestore } from '../../utils/firestore';
import { formatTimestampToYYYYslashMMslashDD } from '../../utils/helpers';
import Card from './Card';

interface KidType {
  docId: string;
  firstName: string;
  lastName: string;
  chineseName: string;
  birthday: string;
  id: string;
  school: string;
  parentID: string;
  photoURL: string;
}

function Kids() {
  const { userID, userRef, kids, getUserProfile, setLoading } = useStore();
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
    // firstName: 'Diego',
    // lastName: 'Tsai',
    // chineseName: '蔡明德',
    // birthday: '2013-09-12',
    // id: 'A214478690',
    // school: '重陽國小',
    parentID: userID || '',
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
            .then(() => getUserProfile(userRef))
            .then(() => {
              setAddingKid(false);
              setLoading(false);
              toast.success('Creation successful!');
            });
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
          .then(() => getUserProfile(userRef))
          .then(() => {
            setAddingKid(false);
            setLoading(false);
            toast.success('Creation successful!');
          });
      }
      setNewKid(emptyNewKid);
    } else {
      setLoading(false);
    }
  };

  const currenTime = new Date();
  const isFirstNameInvalid = newKid.firstName.length > 16;
  const isLastNameInvalid = newKid.lastName.length > 20;
  const isChineseNameInvalid = newKid.chineseName.length > 10;
  const isIDInvalid = newKid.id.length > 0 && (newKid.id.length < 10 || newKid.id.length > 12);
  const isSchoolInvalid = newKid.school.length > 10;
  const isBirthdayInvalid = new Date().getTime() - new Date(newKid.birthday).getTime() < 94608000000;

  return (
    <div className='flex gap-8 items-center overflow-x-auto pt-4 pb-10'>
      {kids.length > 0 &&
        kids.map((kid) => {
          return <Card kid={kid as KidType} key={kid.docId} />;
        })}
      {!isAddingKid && (
        <div
          className='kidCard border-4 border-gray-700 border-dashed text-gray-700 cursor-pointer hover:text-white hover:border-white duration-150'
          onClick={() => setAddingKid(true)}>
          <div className='my-auto font-bold'>Add a kid</div>
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
              placeholder='John'
              value={newKid.firstName}
              classNames={{
                inputWrapper: 'h-9 py-0 px-2',
                errorMessage: 'whitespace-nowrap absolute top-0',
              }}
              isInvalid={isFirstNameInvalid}
              color={isFirstNameInvalid ? 'danger' : 'default'}
              errorMessage={isFirstNameInvalid && 'Exceeds maximum limit.'}
              onChange={handleChangeNewKidProfile}
            />
            <Input
              isRequired
              size='sm'
              label='Last name'
              type='text'
              id='lastName'
              placeholder='Wang'
              value={newKid.lastName}
              classNames={{
                inputWrapper: 'h-9 py-0 px-2',
                errorMessage: 'whitespace-nowrap absolute right-0 top-0',
              }}
              isInvalid={isLastNameInvalid}
              color={isLastNameInvalid ? 'danger' : 'default'}
              errorMessage={isLastNameInvalid && 'Exceeds maximum limit.'}
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
            value={newKid.chineseName}
            classNames={{
              inputWrapper: 'h-9 py-0 mx-4 w-auto',
              errorMessage: 'whitespace-nowrap absolute left-5 top-0',
            }}
            isInvalid={isChineseNameInvalid}
            color={isChineseNameInvalid ? 'danger' : 'default'}
            errorMessage={isChineseNameInvalid && 'Exceeds maximum limit.'}
            onChange={handleChangeNewKidProfile}
          />
          <Input
            isRequired
            size='sm'
            type='text'
            id='id'
            label='ID'
            placeholder='A123456789'
            className='mb-2'
            value={newKid.id}
            classNames={{
              inputWrapper: 'h-9 py-0 mx-4 w-auto',
              errorMessage: 'whitespace-nowrap absolute left-5 top-0',
            }}
            isInvalid={isIDInvalid}
            color={isIDInvalid ? 'danger' : 'default'}
            errorMessage={isIDInvalid && '10 ~ 12 characters limit.'}
            onChange={handleChangeNewKidProfile}
          />
          <Input
            isRequired
            size='sm'
            type='text'
            id='school'
            label='School'
            value={newKid.school}
            className='mb-2'
            classNames={{
              inputWrapper: 'h-9 py-0 mx-4 w-auto',
              errorMessage: 'whitespace-nowrap absolute left-5 top-0',
            }}
            isInvalid={isSchoolInvalid}
            color={isSchoolInvalid ? 'danger' : 'default'}
            errorMessage={isSchoolInvalid && 'Exceeds maximum limit.'}
            onChange={handleChangeNewKidProfile}
          />
          <Input
            isRequired
            size='sm'
            type='date'
            id='birthday'
            label='Birthday'
            placeholder='0'
            value={newKid.birthday}
            className='mb-2 text-gray-500'
            classNames={{
              inputWrapper: 'h-9 py-0 mx-4 w-auto',
              errorMessage: 'whitespace-nowrap absolute left-5 top-0',
            }}
            isInvalid={isBirthdayInvalid}
            color={isBirthdayInvalid ? 'danger' : 'default'}
            errorMessage={
              isBirthdayInvalid &&
              `出生日期不可晚於 ${formatTimestampToYYYYslashMMslashDD(currenTime.getTime() - 94608000000)}`
            }
            onChange={handleChangeNewKidProfile}
          />
          <div className='absolute bottom-4 px-4 w-full flex justify-between items-center'>
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
              isDisabled={
                Object.values(newKid).some((item) => item.length === 0) ||
                isBirthdayInvalid ||
                isFirstNameInvalid ||
                isLastNameInvalid ||
                isChineseNameInvalid
              }
              className='rounded-full min-w-unit-8 w-unit-8 h-unit-8'
              onClick={() => {
                setLoading(true);
                handleAddNewKid();
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
        </div>
      )}
    </div>
  );
}

export default Kids;
