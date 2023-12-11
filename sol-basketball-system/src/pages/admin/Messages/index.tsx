import { DocumentData, DocumentReference, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { collection, db, firestore, onSnapshot } from '../../../utils/firestore';
import { formatTimestampToYYYYMMDD, formatTimestampToYYYYslashMMslashDD } from '../../../utils/helpers';
import Bubble from './Bubble';
import KidInfo from './KidInfo';

interface MessageType {
  timestamp: number;
  content: string;
  sender: string;
}
interface ChatType {
  messages: MessageType[];
  unread: boolean;
  userID: string;
  userNickname: string;
  userName: string;
  userPhoto: string;
  lastMessage: {
    content: string;
    sender: string;
    timestamp: number;
  };
}

interface KidType {
  docId: string;
  birthday: string;
  chineseName: string;
  firstName: string;
  id: string;
  lastName: string;
  school: string;
  photoURL?: string;
}
interface UserType {
  photoURL?: string;
  email?: string;
  kids?: DocumentReference<DocumentData, DocumentData>[];
  // ordersRef?: DocumentReference<DocumentData, DocumentData>[];
  displayName?: string | undefined;
  phoneNumber?: string;
  registrationDate?: string;
  role?: string;
}

function Messages() {
  const navigate = useNavigate();
  const { isLogin, user, setCurrentNav } = useStore();
  const [chats, setChats] = useState<ChatType[]>();
  const [newMessage, setNewMessage] = useState<string>('');
  const [isInfoShow, setInfoShow] = useState<boolean>(false);
  const { id } = useParams();
  useEffect(() => {
    if (!isLogin || user.role !== 'admin') {
      navigate('/login');
      setCurrentNav('');
    }
  }, [isLogin, user]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'messages'), (docSnaps) => {
      const docArray: ChatType[] = [];
      docSnaps.forEach((docSnap) => {
        docArray.push(docSnap.data() as ChatType);
      });
      setChats(docArray);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const chatBox = document.getElementById('chatBox');
    chatBox?.scrollTo({
      behavior: 'smooth',
      top: chatBox.clientHeight * 30,
    });
  }, [chats, id]);

  const calculateTimeToNow = (second: number) => {
    const now = new Date().getTime();
    const diff = now - second;
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
  const sortByTimestamp = (a: MessageType, b: MessageType) => a.timestamp - b.timestamp;

  const setUnreadFalse = (id: string) => {
    if (id) {
      updateDoc(doc(db, 'messages', id), { unread: false });
    }
  };

  const handleSendMessage = () => {
    const currentTimestamp = new Date().getTime();
    if (id) {
      updateDoc(doc(db, 'messages', id), {
        messages: arrayUnion({
          sender: 'admin',
          timestamp: currentTimestamp,
          content: newMessage.trim(),
        }),
      });
      updateDoc(doc(db, 'messages', id), {
        lastMessage: {
          sender: 'admin',
          timestamp: currentTimestamp,
          content: newMessage.trim(),
        },
      });
      setNewMessage('');
    }
  };

  const [userDetail, setUserDetail] = useState<UserType>();
  const [userKids, setUserKids] = useState<KidType[]>();

  useEffect(() => {
    if (id) {
      firestore
        .getDoc('users', id)
        .then((result) => {
          if (result) {
            setUserDetail(result);
            return result.kids;
          }
        })
        .then((kidsRefs) => {
          const emptyArray: KidType[] = [];
          kidsRefs.forEach((kidRef: DocumentReference<DocumentData, DocumentData>) => {
            firestore.getDocByRef(kidRef).then((result) => emptyArray.push(result as KidType));
          });
          setTimeout(() => setUserKids(emptyArray), 200);
        });
    }
  }, [id]);

  const handleEnterDown = (e: {
    key: string;
    nativeEvent: { isComposing: boolean };
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    const pressedKey = e.key.toUpperCase();
    if (pressedKey === 'ENTER') {
      if (e.nativeEvent.isComposing) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!e.nativeEvent.isComposing && newMessage.trim()) {
        handleSendMessage();
        e.preventDefault();
      }
    }
  };

  return (
    <div className='custom-main-container'>
      <div className='flex bg-slate-800 text-white'>
        <div className='min-w-20 lg:w-4/12 flex flex-col border-r border-gray-700'>
          <div className='hidden lg:block font-bold px-5 py-4'>Messages</div>
          <div className='overflow-y-auto h-[calc(100vh-56px)]'>
            {chats &&
              chats
                .sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp)
                .map((chat) => {
                  return (
                    <Link
                      to={`/messages/${chat.userID}`}
                      key={chat.userID}
                      onClick={() => {
                        setUnreadFalse(chat.userID);
                        setInfoShow(false);
                      }}
                      className={`flex items-center px-5 py-2 cursor-pointer ${
                        id === chat.userID ? 'bg-slate-600 hover:bg-slate-600' : 'hover:bg-slate-700'
                      }`}>
                      <img src={chat.userPhoto} alt='' className='h-14 w-14 rounded-full' />
                      <div className='hidden lg:block px-4 w-[calc(100%-56px)]'>
                        <div className={`${chat.unread && 'font-extrabold'} w-full`}>{chat.userName}</div>
                        {chat.lastMessage.timestamp !== 0 && (
                          <div className='flex text-sm text-gray-400 w-full'>
                            <div className={`${chat.unread && 'text-white font-semibold'} max-w-[91%] h-5 truncate`}>
                              {chat.lastMessage.sender === 'admin' && 'You: '}
                              {chat.lastMessage.content}
                            </div>
                            <div>・</div>
                            <div>{calculateTimeToNow(chat.lastMessage.timestamp)}</div>
                          </div>
                        )}
                      </div>
                      <div className={`items-center justify-center ${chat.unread ? 'flex' : 'hidden'}`}>
                        <div className='hidden lg:block w-2 h-2 bg-cyan-400 rounded-full' />
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
          <div className='w-8/12 flex' onClick={() => setUnreadFalse(id as string)}>
            <div className='flex-1'>
              {chats &&
                chats
                  .filter((chat) => chat.userID === id)
                  .map((currentChat) => {
                    return (
                      <div className='flex flex-col' key={currentChat.userID}>
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
                        <div id='chatBox' className='flex flex-col w-full px-4 h-[calc(100vh-139px)] overflow-y-auto'>
                          <div className='self-center pt-6 pb-4'>
                            <img src={currentChat.userPhoto} alt='user photo' className='h-20 w-20 rounded-full' />
                            <div className='text-center mt-2 font-bold'>{currentChat.userName}</div>
                          </div>
                          {currentChat.messages.length > 0 &&
                            currentChat.messages.sort(sortByTimestamp).map((message, index) => {
                              const date = formatTimestampToYYYYMMDD(message.timestamp);
                              const showDate = formatTimestampToYYYYslashMMslashDD(message.timestamp);

                              const lastTimestamp = currentChat.messages.sort(sortByTimestamp)[index - 1]?.timestamp;
                              const lastDate = formatTimestampToYYYYMMDD(lastTimestamp);

                              const now = new Date().getTime();
                              const today = formatTimestampToYYYYMMDD(now);

                              let dateBubble = undefined;
                              if (lastDate === 'NaNNaNNaN' && date !== today) {
                                dateBubble = showDate;
                              } else if (Number(date) > Number(lastDate)) {
                                dateBubble = showDate;
                              }
                              if (Number(today) - Number(date) === 1 && date !== lastDate) {
                                dateBubble = 'Yesterday';
                              } else if (date === today && date !== lastDate) {
                                dateBubble = 'Today';
                              }

                              return (
                                <>
                                  {dateBubble && (
                                    <div className='mt-2 px-3 py-1 scale-75 mx-auto text-center text-sm text-gray-500 bg-slate-900 rounded-full'>
                                      {dateBubble}
                                    </div>
                                  )}
                                  <Bubble message={message} key={message.timestamp} />
                                </>
                              );
                            })}
                        </div>
                        <div className='w-full px-4 py-4 relative'>
                          <form action=''>
                            <input
                              type='text'
                              value={newMessage}
                              placeholder='Message...'
                              className='w-full pl-5 pr-14 py-1 bg-slate-800 border border-gray-700 rounded-full'
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyDown={handleEnterDown}
                            />
                            {newMessage.trim() && (
                              <button
                                className='absolute top-5 right-8 text-blue-500 hover:text-white'
                                onClick={handleSendMessage}>
                                Send
                              </button>
                            )}
                          </form>
                        </div>
                      </div>
                    );
                  })}
            </div>
            <div className={`${isInfoShow ? 'flex' : 'hidden'} flex-col w-4/12 border-l border-gray-700`}>
              <div className='w-full py-5 pl-5 text-lg font-semibold'>User details</div>
              {userDetail && (
                <div className='py-4 w-full'>
                  <div className='flex items-center px-4 gap-4'>
                    <img src={userDetail.photoURL} alt='user photo' className='h-10 w-10 rounded-full' />
                    <div className='flex flex-col'>
                      <div className='font-bold text-md text-gray-200'>{userDetail.displayName}</div>
                      <div className='text-sm text-gray-400'>{userDetail.email}</div>
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
              <div
                className='mt-auto w-full border-t border-gray-700'
                onClick={() => {
                  const userConfirm = confirm('Permanently delete chat?');
                  if (userConfirm && id) {
                    updateDoc(doc(db, 'messages', id), {
                      messages: [],
                    });
                    updateDoc(doc(db, 'messages', id), {
                      lastMessage: { timestamp: 0 },
                    });
                  }
                }}>
                <div className='w-full my-4 pl-4 text-red-500 cursor-pointer'>Delete messages</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
