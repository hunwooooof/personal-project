import dateFormat from 'dateformat';
import { MessageType } from '../../../utils/types';

interface PropsType {
  message: MessageType;
}

function Bubble({ message }: PropsType) {
  const time = dateFormat(new Date(message.timestamp), 'HH:MM');
  const isUser = message.sender === 'user';

  return (
    <div
      className={`cursor-pointer mt-4 rounded-2xl text-sm px-3 py-1 relative ${
        isUser ? 'bg-slate-600 self-start mr-28' : 'bg-blue-500 self-end ml-28'
      }`}>
      {message.content}
      <div
        className={`absolute w-32 text-gray-500 text-sm scale-75 -bottom-1 ${
          isUser ? '-right-[120px]' : '-left-[50px]'
        }`}>
        {time}
      </div>
    </div>
  );
}

export default Bubble;
