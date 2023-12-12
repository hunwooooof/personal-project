import { formatTimestampToTime } from '../../utils/helpers';

interface MessageType {
  timestamp: number;
  content: string;
  sender: string;
}

interface PropsType {
  message: MessageType;
}

function Bubble({ message }: PropsType) {
  const time = formatTimestampToTime(message.timestamp);

  return (
    <div
      className={`cursor-pointer mt-4 rounded-2xl text-sm px-3 py-1 relative ${
        message.sender === 'admin' ? 'bg-slate-600 self-start mr-24' : 'bg-blue-500 self-end ml-24'
      }`}>
      {message.content}
      <div
        className={`absolute w-32 text-gray-500 text-sm scale-75 -bottom-1 ${
          message.sender === 'admin' ? '-right-[120px]' : '-left-[50px]'
        }`}>
        {time}
      </div>
    </div>
  );
}

export default Bubble;
