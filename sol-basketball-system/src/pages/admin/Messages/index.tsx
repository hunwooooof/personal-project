import { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { firestore } from '../../../utils/firestore';
import Bubble from './Bubble';

interface MessageType {
  timestamp: Timestamp;
  text: string;
  sender: string;
}
interface ChatType {
  adminMessage: MessageType[];
  userMessage: MessageType[];
  unread: boolean;
  userID: string;
  userNickname: string;
  userName: string;
  userPhoto: string;
  lastMessage: {
    content: string;
    sender: string;
    timestamp: Timestamp;
  };
}

function Messages() {
  const [chats, setChats] = useState<ChatType[]>();
  const [isInfoShow, setInfoShow] = useState<boolean>(true);
  const { id } = useParams();

  useEffect(() => {
    firestore.getDocs('chatroom').then((result) => {
      setChats(result as ChatType[]);
    });
  }, []);

  const calculateTimeToNow = (second: number) => {
    const now = new Date().getTime();
    const diff = now - second * 1000;
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;
    if (diff < minute) {
      return '1m';
    } else if (diff < hour) {
      const minutes = Math.floor(diff / minute);
      return `${minutes}m`;
    } else if (diff < day) {
      const hours = Math.floor(diff / hour);
      return `${hours}h`;
    } else if (diff < month) {
      const days = Math.floor(diff / day);
      return `${days}d`;
    } else if (diff < year) {
      const months = Math.floor(diff / month);
      return `${months}m`;
    } else {
      const years = Math.floor(diff / year);
      return `${years}y`;
    }
  };
  const sortByTimestamp = (a: MessageType, b: MessageType) => a.timestamp.seconds - b.timestamp.seconds;

  return (
    <div className='custom-main-container'>
      <div className='flex bg-slate-800 text-white'>
        <div className='w-4/12 flex flex-col border-r border-gray-700'>
          <div className='font-bold px-5 py-4'>Messages</div>
          <div className='overflow-y-auto h-[calc(100vh-56px)]'>
            {chats &&
              chats.map((chat) => {
                return (
                  <Link
                    to={`/messages/${chat.userID}`}
                    key={chat.userID}
                    className={`flex items-center px-5 py-2 cursor-pointer ${
                      id === chat.userID ? 'bg-slate-600 hover:bg-slate-600' : 'hover:bg-slate-700'
                    }`}>
                    <img src={chat.userPhoto} alt='' className='h-14 w-14 rounded-full' />
                    <div className='flex-1 px-4'>
                      <div className={`${chat.unread && 'font-extrabold'}`}>{chat.userName}</div>
                      <div className='flex text-sm text-gray-400'>
                        <div className={`${chat.unread && 'text-white font-semibold'}`}>
                          {chat.lastMessage.sender === 'admin' && 'You: '}
                          {chat.lastMessage.content}
                        </div>
                        <div>・</div>
                        <div>{calculateTimeToNow(chat.lastMessage.timestamp.seconds)}</div>
                      </div>
                    </div>
                    <div className={`items-center justify-center ${chat.unread ? 'flex' : 'hidden'}`}>
                      <div className='w-2 h-2 bg-cyan-400 rounded-full' />
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
        {id === 'inbox' && (
          <div className='w-8/12 h-screen flex flex-col items-center justify-center text-slate-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-20 h-20 block mb-4'>
              <path d='M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z' />
              <path d='M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z' />
            </svg>
            <div className='mb-8 select-none'>Click a conversation!</div>
          </div>
        )}
        {id !== 'inbox' && (
          <div className='w-8/12 flex'>
            <div className='flex-1'>
              {chats &&
                chats
                  .filter((chat) => chat.userID === id)
                  .map((currentChat) => {
                    console.log(currentChat);
                    return (
                      <div className='flex flex-col'>
                        <div className='flex justify-between items-center px-4 py-4 border-b border-gray-700'>
                          <img src={currentChat.userPhoto} alt='user photo' className='h-10 w-10 rounded-full' />
                          <div className='ml-3 mr-auto font-bold'>{currentChat.userName}</div>
                          {!isInfoShow && (
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className='w-7 h-7 cursor-pointer'
                              onClick={() => setInfoShow(true)}>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
                              />
                            </svg>
                          )}
                          {isInfoShow && (
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 24 24'
                              fill='currentColor'
                              className='w-7 h-7 cursor-pointer'
                              onClick={() => setInfoShow(false)}>
                              <path
                                fillRule='evenodd'
                                d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z'
                                clipRule='evenodd'
                              />
                            </svg>
                          )}
                        </div>
                        <div className='flex flex-col w-full px-4 h-[calc(100vh-139px)] overflow-y-auto'>
                          {currentChat.adminMessage.sort(sortByTimestamp).map((message) => {
                            return <Bubble message={message} />;
                          })}
                        </div>
                        <div className='w-full px-4 py-4'>
                          <input
                            type='text'
                            name=''
                            id=''
                            placeholder='Message...'
                            className='w-full px-5 py-1 bg-slate-800 border border-gray-700 rounded-full'
                          />
                        </div>
                      </div>
                    );
                  })}
            </div>
            <div className={`${isInfoShow ? 'flex' : 'hidden'} w-4/12 border-l border-gray-700`}>Info</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;