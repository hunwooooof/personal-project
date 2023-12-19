import { useEffect, useState } from 'react';
import { useStore } from '../../store/store';

interface PropsType {
  date: string;
  isInfoShow: boolean;
  setInfoShow: (arg0: boolean) => void;
  setInfo: (arg0: DetailType) => void;
  info: DetailType[] | undefined;
}

interface DetailType {
  address: string;
  date: string;
  tag?: string;
  time: string;
  title: string;
}

function Saturday({ date, isInfoShow, setInfoShow, setInfo, info }: PropsType) {
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

  const unScheduledClass = `text-sm sm:text-base sm:px-12 py-2 sm:py-5 rounded-md border border-gray-600 mt-4 font-bold text-gray-600 tracking-wider border border-gray-600 relative`;
  const isScheduledClass = `text-sm sm:text-base sm:px-12 py-2 sm:py-5 rounded-md border border-slate-400 mt-4 font-bold tracking-wider cursor-pointer text-black relative ${
    Array.isArray(info) && info[0].date === date ? 'bg-white hover:bg-white' : 'bg-slate-400 hover:bg-slate-200'
  }`;

  return (
    <div>
      {!scheduledDates.includes(date) && <div className={unScheduledClass}>{showDate}</div>}
      {scheduledDates.includes(date) && (
        <div
          className={isScheduledClass}
          onClick={() => {
            console.log(date);
            if (Object.keys(todaySchedule)[0] == date && isInfoShow) {
              setInfoShow(false);
            } else {
              setInfoShow(true);
              setInfo(Object.values(todaySchedule)[0]);
            }
          }}>
          {`${showDate} (${Object.values(todaySchedule)[0].length})`}
        </div>
      )}
    </div>
  );
}

export default Saturday;
