import { useParams } from 'react-router-dom';
import { firestore } from '../../../utils/firestore';
import { KidType, UserType } from '../../../utils/types';
import KidInfo from './KidInfo';

interface PropsType {
  userDetail: UserType;
  userKids: KidType[];
}

function UserInfo({ userDetail, userKids }: PropsType) {
  const { id } = useParams();

  const deletePreviousMessage = () => {
    const confirmDeleteMessage = confirm('Permanently delete previous messages?');
    if (id && confirmDeleteMessage) {
      firestore.updateDoc('messages', id, {
        messages: [],
      });
      firestore.updateDoc('messages', id, {
        lastMessage: { timestamp: 0 },
      });
    }
  };

  return (
    <div className='flex flex-col w-4/12 border-l border-gray-700'>
      <div className='w-full py-5 pl-5 text-lg font-semibold'>User details</div>
      {userDetail && (
        <div className='py-4 w-full'>
          <div className='flex items-center px-4 gap-4 w-full'>
            <img src={userDetail.photoURL} alt='user photo' className='h-10 w-10 rounded-full' />
            <div className='flex flex-col w-[calc(100%-40px)]'>
              <div className='font-bold text-md text-gray-200'>{userDetail.displayName}</div>
              <div className='text-sm text-gray-400 truncate w-full hover:overflow-visible'>{userDetail.email}</div>
            </div>
          </div>
          <div className='w-full text-sm mt-6 px-4 text-gray-200'>
            Registration Date
            <div className='text-gray-400'>{userDetail.registrationDate?.slice(0, 16)}</div>
          </div>
        </div>
      )}
      {userKids && userKids.length > 0 && (
        <div className='w-full border-t border-gray-700'>
          <div className='w-full py-5 pl-5 text-lg font-semibold'>Kids</div>
          <div className='w-full'>
            {userKids.map((kid) => {
              return <KidInfo kid={kid} key={kid.docId} />;
            })}
          </div>
        </div>
      )}
      <div className='mt-auto w-full border-t border-gray-700' onClick={deletePreviousMessage}>
        <div className='w-full my-4 pl-4 text-red-500 cursor-pointer'>Delete messages</div>
      </div>
    </div>
  );
}

export default UserInfo;
