import { useState } from 'react';
import { useStore } from '../../../store/store';
import { arrayRemove, arrayUnion, db, deleteDoc, doc, getDoc, setDoc, updateDoc } from '../../../utils/firebase';

interface PropsType {
  date: string;
  quarter: number;
  year: number;
}

interface DetailType {
  address: 'xindian-sport-center';
  date: string;
  tag: 'u10' | 'u12';
  time: string;
  title: 'top-league-game';
}

function Saturday({ date, quarter, year }: PropsType) {
  const { scheduledDates, getScheduledDates } = useStore();
  const showDate = date.slice(5).replace('-', '/');

  const [detail, setDetail] = useState<DetailType>({
    address: 'xindian-sport-center',
    date: date,
    tag: 'u10',
    time: '19:00-21:00',
    title: 'top-league-game',
  });

  const [isEdit, setEdit] = useState<boolean>(false);

  const unScheduledClass = `relative px-12 py-5 border rounded-lg mt-4 font-bold font-mono tracking-wider cursor-pointer relative hover:shadow-inner ${
    isEdit ? 'shadow-inner' : 'shadow-md hover:bg-teal-50'
  }`;
  const isScheduledClass = `relative px-12 py-5 border shadow-md rounded-lg mt-4 font-bold font-mono tracking-wider cursor-pointer relative hover:shadow-inner hover:bg-teal-50 bg-teal-50`;

  const renderEditIcon = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='currentColor'
        viewBox='0 0 24 24'
        onClick={(e) => {
          e.stopPropagation();
          setEdit(true);
        }}
        className='absolute right-3 w-6 h-6 inline-block pb-1 text-gray-300 cursor-pointer hover:text-black'>
        <path d='M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z' />
        <path d='M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z' />
      </svg>
    );
  };

  return (
    <div>
      {!scheduledDates.includes(date) && (
        <div
          className={unScheduledClass}
          onClick={() => {
            if (!isEdit) {
              getDoc(doc(db, 'schedule', `${year}Q${quarter}`))
                .then((scheduleSnap) => {
                  if (scheduleSnap.data()) {
                    updateDoc(doc(db, 'schedule', `${year}Q${quarter}`), {
                      all: arrayUnion(date),
                    });
                    setDoc(doc(db, 'schedule', `${year}Q${quarter}`, 'saturday', date), detail);
                  } else {
                    setDoc(doc(db, 'schedule', `${year}Q${quarter}`), {
                      all: [date],
                    }).then(() => {
                      setDoc(doc(db, 'schedule', `${year}Q${quarter}`, 'saturday', date), detail);
                    });
                  }
                })
                .then(() => getScheduledDates(year, quarter));
            }
          }}>
          {!isEdit && showDate}
          {!isEdit && renderEditIcon()}
          {isEdit && <div>Editing!</div>}
        </div>
      )}
      {scheduledDates.includes(date) && (
        <div
          className={isScheduledClass}
          onClick={() => {
            updateDoc(doc(db, 'schedule', `${year}Q${quarter}`), {
              all: arrayRemove(date),
            }).then(() => getScheduledDates(year, quarter));
            deleteDoc(doc(db, 'schedule', `${year}Q${quarter}`, 'saturday', date));
          }}>
          {showDate}
        </div>
      )}
    </div>
  );
}

export default Saturday;
