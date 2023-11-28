import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Reset } from '../../components/Icon';
import { firestore } from '../../utils/firestore';

interface PropsType {
  currentKidId: string;
}

function Attendance({ currentKidId }: PropsType) {
  const currentDate = new Date();
  function getCurrentQuarter(currentDate: Date) {
    const currentMonth = currentDate.getMonth() + 1; // JavaScript 中月份是從 0 開始的
    const currentQuarter = Math.ceil(currentMonth / 3);
    return currentQuarter;
  }
  const currentQuarter = getCurrentQuarter(currentDate);
  const currentYear = currentDate.getFullYear();
  const [quarter, setQuarter] = useState(currentQuarter);
  const [year, setYear] = useState(currentYear);

  const [dates, setDates] = useState([]);
  useEffect(() => {
    async function getDates() {
      const schedule = await firestore.getDoc('schedule', `${year}Q${quarter}`);
      if (schedule) {
        setDates(schedule.all.sort());
      } else setDates([]);
    }
    getDates();
  }, [quarter, year]);

  const [showUpDates, setShowUpDates] = useState(['']);
  async function getAttendanceDoc() {
    const kidAttendance = await firestore.getDoc('attendance', currentKidId);
    if (kidAttendance) setShowUpDates(kidAttendance.showUpDate);
  }
  useEffect(() => {
    getAttendanceDoc();
  }, [quarter, year, currentKidId]);

  const months = () => {
    switch (quarter) {
      case 1:
        return 'M1 － M3';
      case 2:
        return 'M4 － M6';
      case 3:
        return 'M7 － M9';
      case 4:
        return 'M10 － M12';
      default:
        return 'M1 － M3';
    }
  };

  const arrowClass = 'w-6 h-6 ml-1 rounded-full text-slate-400 cursor-pointer hover:text-black select-none';

  const renderUncheck = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='h-6 px-4 rounded-md'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
    );
  };

  const renderChecked = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='currentColor'
        className='h-6 px-4 text-green-500 rounded-md'>
        <path
          fillRule='evenodd'
          d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z'
          clipRule='evenodd'
        />
      </svg>
    );
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-6 mt-14'>
        <div className='custom-page-title'>Attendance</div>
        <div className='flex items-center gap-2 bg-white rounded-full py-2 px-2'>
          <div className='flex bg-slate-100 px-2 py-1 rounded-full w-44 justify-end'>
            <div className='text-gray-800 font-medium select-none text-center w-24'>{months()}</div>
            {ArrowLeft(arrowClass, () => {
              if (quarter > 1) setQuarter((n) => n - 1);
              else setQuarter(4);
            })}
            {ArrowRight(arrowClass, () => {
              if (quarter < 4) setQuarter((n) => n + 1);
              else setQuarter(1);
            })}
          </div>
          <div className='flex bg-slate-100 pr-2 pl-4 py-1 rounded-full'>
            <div className='text-gray-800 font-medium select-none'>{year}</div>
            {ArrowLeft(arrowClass, () => setYear((n) => n - 1))}
            {ArrowRight(arrowClass, () => setYear((n) => n + 1))}
          </div>
          <div className=' rounded-full cursor-pointer text-slate-400 hover:text-black'>
            {Reset('w-5 h-5', () => {
              setQuarter(currentQuarter);
              setYear(currentYear);
            })}
          </div>
        </div>
      </div>
      <div className='bg-white rounded-3xl py-5 px-8'>
        {dates.length === 0 && (
          <div className='text-2xl text-center text-gray-400'>No data available for this section.</div>
        )}
        {dates.length > 0 && (
          <div className='overflow-x-auto pb-4 rounded-lg'>
            <div className='flex mb-4'>
              {dates.map((date: string) => {
                const formateDate = date.substring(5).replace('-', '/');
                return (
                  <div
                    key={date}
                    className='shrink-0 w-16 bg-gray-200 font-bold text-sm tracking-wider text-center border-2 border-white rounded-md py-1 select-none'>
                    {formateDate}
                  </div>
                );
              })}
            </div>
            {showUpDates.length >= 0 && (
              <div className='flex'>
                {dates.map((date) => {
                  return (
                    <div key={date} className='shrink-0 w-16 text-sm py-1 flex justify-center items-center'>
                      {showUpDates.includes(date) ? renderChecked() : renderUncheck()}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;
