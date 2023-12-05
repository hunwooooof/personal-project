import { arrayUnion, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { db, doc, firestore, onSnapshot } from '../../utils/firestore';
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
  // const chatRoomRef = useRef<HTMLDivElement>(null);
  const [chat, setChat] = useState<ChatType>();
  const [newMessage, setNewMessage] = useState<string>('');
  const adminPhoto =
    'https://firebasestorage.googleapis.com/v0/b/sol-basketball.appspot.com/o/sol-logo.jpg?alt=media&token=5f42ab2f-0c16-48f4-86dd-33c7db8d7496';
  useEffect(() => {
    if (userID) {
      const unsubscribe = onSnapshot(doc(db, 'messages', userID), (docSnap) => {
        setChat(docSnap.data() as ChatType);
        console.log(docSnap.data());
      });
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (!isLogin || user.role !== 'user') {
      navigate('/login');
      setCurrentNav('');
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

  // useEffect(() => {
  //   if (id) {
  //     firestore.getDoc('users', id).then((result) => setUserDetail(result));
  //   }
  // }, [id]);

  /*
  const handleEnterDown = (e) => {
    const pressedKey = e.key.toUpperCase();
    if (pressedKey === 'ENTER') {
      if (e.isComposing) {
        e.preventDefault();
      }
      if (!e.isComposing && newMessage.trim()) {
        handleSendMessage();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEnterDown);
    return () => {
      window.removeEventListener('keydown', handleEnterDown);
    };
  }, []);
*/
  return (
    <div className='custom-main-container'>
      <div className='w-full bg-slate-800 text-white'>
        <div className='max-w-[700px] mx-auto lg:border-r lg:border-l flex flex-col'>
          <div className='flex justify-between items-center px-4 py-4 border-b border-gray-700'>
            <img src={adminPhoto} alt='user photo' className='h-10 w-10 rounded-full' />
            <div className='ml-3 mr-auto font-bold'>admin</div>
          </div>
          <div id='chatBox' className='flex flex-col w-full px-4 h-[calc(100vh-139px)] overflow-y-auto'>
            <div className='self-center pt-6 pb-4'>
              <img src={adminPhoto} alt='user photo' className='h-20 w-20 rounded-full' />
              <div className='text-center mt-2 font-bold'>admin</div>
            </div>
            {chat &&
              chat.messages.sort(sortByTimestamp).map((message) => {
                return <Bubble message={message} key={message.timestamp} />;
              })}
          </div>
          {!chat && (
            <div className='w-full px-4 py-4 relative'>
              <button
                className='px-4 py-1 text-center border rounded-full hover:bg-slate-600'
                onClick={() => {
                  const newDoc = {
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
              <input
                type='text'
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
                placeholder='Message...'
                className='w-full pl-5 pr-14 py-1 bg-slate-800 border border-gray-700 rounded-full'
              />
              {newMessage.trim() && (
                <button className='absolute top-5 right-8 text-blue-500 hover:text-white' onClick={handleSendMessage}>
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
