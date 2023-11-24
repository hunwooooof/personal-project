import { useEffect, useState } from 'react';
import { useStore } from '../../store/store';

interface PropsType {
  date: string;
  setInfoShow: (arg0: boolean) => void;
  setInfo: (arg0: DetailType) => void;
}

interface DetailType {
  address: string;
  date: string;
  tag: string;
  time: string;
  title: string;
}

function Saturday({ date, setInfoShow, setInfo }: PropsType) {
  const { scheduledDates, saturdaySchedules } = useStore();
  const showDate = date.slice(5).replace('-', '/');
  const [todaySchedule, setTodaySchedule] = useState<object>({ [date]: [] });

  const getTodaySchedule = (date: string) => {
    const theDay = saturdaySchedules.find((dateEvents) => {
      const dateString = Object.keys(dateEvents);
      return dateString[0] === date;
    });
    if (theDay) return theDay;
  };

  useEffect(() => {
    if (saturdaySchedules) {
      const initialSchedule = getTodaySchedule(date);
      if (initialSchedule) setTodaySchedule(initialSchedule);
    }
  }, [saturdaySchedules]);

  const unScheduledClass = `px-12 py-5 border shadow-md rounded-lg mt-4 font-bold font-mono tracking-wider relative`;
  const isScheduledClass = `px-12 py-5 border shadow-md rounded-lg mt-4 font-bold font-mono tracking-wider cursor-pointer relative hover:shadow-inner hover:bg-teal-100 bg-teal-100`;

  return (
    <div>
      {!scheduledDates.includes(date) && <div className={unScheduledClass}>{showDate}</div>}
      {scheduledDates.includes(date) && (
        <div
          className={isScheduledClass}
          onClick={() => {
            setInfoShow(true);
            setInfo(Object.values(todaySchedule)[0]);
          }}>
          {showDate} <span className='font-normal text-gray-500'>{`(${Object.values(todaySchedule)[0].length})`}</span>
        </div>
      )}
    </div>
  );
}

export default Saturday;
