import { useState } from 'react';

interface MessageType {
  timestamp: number;
  content: string;
  sender: string;
}

interface PropsType {
  message: MessageType;
}

function Bubble({ message }: PropsType) {
  const [isTimeShow, setTimeShow] = useState<boolean>(false);

  const time = message.timestamp;
  const timestamp = new Date(time);
  const yyyy = timestamp.getFullYear();
  const mm = timestamp.getMonth() + 1;
  const formattedMm = mm < 10 ? `0${mm}` : String(mm);
  const dd = timestamp.getDate();
  const formattedDd = dd < 10 ? `0${dd}` : String(dd);
  const hour = timestamp.getHours();
  const formattedHour = hour < 10 ? `0${hour}` : String(hour);
  const min = timestamp.getMinutes();
  const formattedMin = min < 10 ? `0${min}` : String(min);
  const dateTime = `${yyyy}/${formattedMm}/${formattedDd} ${formattedHour}:${formattedMin}`;

  return (
    <div
      className={`cursor-pointer mt-4 rounded-2xl text-sm px-3 py-1 relative ${
        message.sender === 'user' ? 'bg-slate-600 self-start mr-24' : 'bg-blue-500 self-end ml-24'
      }`}
      onClick={() => setTimeShow(!isTimeShow)}>
      {message.content}
      {isTimeShow && (
        <div
          className={`absolute w-32 text-gray-500 text-sm scale-75 top-1 ${
            message.sender === 'user' ? '-right-32' : '-left-28'
          }`}>
          {dateTime}
        </div>
      )}
    </div>
  );
}

export default Bubble;
