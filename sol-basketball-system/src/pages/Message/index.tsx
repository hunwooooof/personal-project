import { ScrollShadow } from '@nextui-org/react';
import { arrayUnion, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { db, doc, firestore, onSnapshot } from '../../utils/firestore';
import { formatTimestampToYYYYMMDD, formatTimestampToYYYYslashMMslashDD } from '../../utils/helpers';
import Bubble from './Bubble';

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

function Message() {
  const navigate = useNavigate();
  const { isLogin, user, userID, setCurrentNav } = useStore();
  const [chat, setChat] = useState<ChatType>();
  const [newMessage, setNewMessage] = useState<string>('');
  const adminPhoto =
    'https://firebasestorage.googleapis.com/v0/b/sol-basketball.appspot.com/o/sol-logo.jpg?alt=media&token=5f42ab2f-0c16-48f4-86dd-33c7db8d7496';

  useEffect(() => {
    if (userID) {
      const unsubscribe = onSnapshot(doc(db, 'messages', userID), (docSnap) => {
        setChat(docSnap.data() as ChatType);
      });
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (!isLogin || user.role === 'admin') {
      navigate('/');
      setCurrentNav('schedules');
    } else if (isLogin) {
      setCurrentNav('message');
    }
  }, [isLogin, user]);

  useEffect(() => {
    const chatBox = document.getElementById('chatBox');
    chatBox?.scrollTo({
      behavior: 'smooth',
      top: chatBox.clientHeight * 30,
    });
  }, [chat]);

  const sortByTimestamp = (a: MessageType, b: MessageType) => a.timestamp - b.timestamp;
  const sortedMessages = chat?.messages.sort(sortByTimestamp);
  const handleSendMessage = () => {
    const currentTimestamp = new Date().getTime();
    if (userID) {
      updateDoc(doc(db, 'messages', userID), {
        messages: arrayUnion({
          sender: 'user',
          timestamp: currentTimestamp,
          content: newMessage.trim(),
        }),
      });
      updateDoc(doc(db, 'messages', userID), {
        lastMessage: {
          sender: 'user',
          timestamp: currentTimestamp,
          content: newMessage.trim(),
        },
      });
      updateDoc(doc(db, 'messages', userID), {
        unread: true,
      });
      setNewMessage('');
    }
  };

  const handleEnterDown = (e: {
    key: string;
    nativeEvent: { isComposing: boolean };
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    const pressedKey = e.key.toUpperCase();
    if (pressedKey === 'ENTER' && newMessage.trim()) {
      if (e.nativeEvent.isComposing) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!e.nativeEvent.isComposing) {
        handleSendMessage();
        e.preventDefault();
      }
    }
  };

  const userMessagesTemplate = [
    'Thanks!',
    '😆😆',
    'I have completed the bank transfer. Please verify for me.',
    'I have questions about my course enrollment.',
    'Pleas provide information on the payment process.',
    'I have questions about the courses offered.',
    'I need help.',
  ];

  return (
    <div className='custom-main-container max-h-screen'>
      <div className='w-full bg-slate-800 text-white'>
        <div className='lg:max-w-[700px] mx-auto lg:border-r lg:border-l border-gray-600 flex flex-col'>
          <div className='flex justify-between items-center px-4 py-4 border-b border-gray-600'>
            <img src={adminPhoto} alt='user photo' className='h-10 w-10 rounded-full' />
            <div className='ml-3 mr-auto font-bold'>admin</div>
          </div>
          <div id='chatBox' className='flex flex-col w-full px-4 h-[calc(100vh-190px)] overflow-y-auto'>
            <div className='self-center pt-6 pb-4'>
              <img src={adminPhoto} alt='user photo' className='h-20 w-20 rounded-full' />
              <div className='text-center mt-2 font-bold'>admin</div>
            </div>
            {chat &&
              sortedMessages?.map((message, index) => {
                const date = formatTimestampToYYYYMMDD(message.timestamp);
                const showDate = formatTimestampToYYYYslashMMslashDD(message.timestamp);

                const lastTimestamp = sortedMessages[index - 1]?.timestamp;
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
          {!chat && (
            <div className='w-full flex justify-center py-4'>
              <button
                className='px-4 py-1 my-4 text-center border rounded-full hover:bg-slate-600'
                onClick={() => {
                  const newDoc = {
                    lastMessage: { timestamp: 0 },
                    messages: [],
                    unread: false,
                    userID,
                    userName: user.displayName,
                    userPhoto: user.photoURL,
                  };
                  firestore.setDoc('messages', userID as string, newDoc);
                }}>
                Start a conversation
              </button>
            </div>
          )}
          {chat && (
            <div className='w-full px-4 py-4 relative'>
              <ScrollShadow orientation='horizontal' className='flex gap-3 overflow-x-auto pb-2'>
                {userMessagesTemplate.map((faq) => (
                  <div
                    className='rounded-full cursor-pointer px-2 py-1 text-gray-400 border border-gray-700 whitespace-nowrap hover:bg-gray-700'
                    onClick={() => setNewMessage(faq)}>
                    {faq}
                  </div>
                ))}
              </ScrollShadow>
              <input
                type='text'
                value={newMessage}
                placeholder='Message...'
                className='w-full pl-5 pr-14 py-1 bg-slate-800 border border-gray-700 rounded-full mt-2'
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleEnterDown}
              />
              {newMessage.trim() && (
                <button
                  className='absolute bottom-5 right-8 text-blue-500 hover:text-white'
                  onClick={handleSendMessage}>
                  Send
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;
