import { useEffect, useState } from 'react';
import { db, doc, getDoc } from '../../utils/firebase';

interface PropsType {
  currentKid: string;
}

function Attendance({ currentKid }: PropsType) {
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
      const scheduleSnap = await getDoc(doc(db, 'schedule', `${year}Q${quarter}`));
      if (scheduleSnap) {
        const schedule = scheduleSnap.data();
        if (schedule) {
          setDates(schedule.all.sort());
        } else setDates([]);
      }
    }
    getDates();
  }, [quarter, year]);

  const [showUpDates, setShowUpDates] = useState(['']);
  async function getAttendanceDoc() {
    const kidAttendanceSnapshot = await getDoc(doc(db, 'attendance', currentKid));
    if (kidAttendanceSnapshot) {
      const kidAttendance = kidAttendanceSnapshot.data();
      if (kidAttendance) setShowUpDates(kidAttendance.showUpDate);
    }
  }
  useEffect(() => {
    getAttendanceDoc();
  }, [quarter, year, currentKid]);

  const months = () => {
    switch (quarter) {
      case 1:
        return 'Jan － Mar';
      case 2:
        return 'Apr － Jun';
      case 3:
        return 'Jul － Sep';
      case 4:
        return 'Oct － Dec';
      default:
        return 'Jan － Mar';
    }
  };

  const arrowClass = 'w-6 h-6 p-1 bg-amber-200 ml-2 rounded-md cursor-pointer shadow-md hover:bg-amber-300 select-none';
  const renderArrowLeft = () => {
    return (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className={arrowClass}>
        <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
      </svg>
    );
  };
  const renderArrowRight = () => {
    return (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className={arrowClass}>
        <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
      </svg>
    );
  };
  const renderResetIcon = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='w-6 h-6'
        onClick={() => {
          setQuarter(currentQuarter);
          setYear(currentYear);
        }}>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
        />
      </svg>
    );
  };

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
      <div className='mt-6  px-3 py-2 text-xl border-b border-gray-200'>Attendance</div>
      <div className='flex justify-end gap-5 mb-8 pr-16'>
        <div className='flex px-3 py-2 rounded-lg'>
          <div className='mr-2 text-gray-800 font-medium select-none'>{months()}</div>
          <span
            onClick={() => {
              if (quarter > 1) setQuarter((n) => n - 1);
              else setQuarter(4);
            }}>
            {renderArrowLeft()}
          </span>
          <span
            onClick={() => {
              if (quarter < 4) setQuarter((n) => n + 1);
              else setQuarter(1);
            }}>
            {renderArrowRight()}
          </span>
        </div>
        <div className='flex px-3 py-2 rounded-lg'>
          <div className='mr-2 text-gray-800 font-medium select-none'>{year}</div>
          <span onClick={() => setYear((n) => n - 1)}>{renderArrowLeft()}</span>
          <span onClick={() => setYear((n) => n + 1)}>{renderArrowRight()}</span>
        </div>
        <div className='m-2 rounded-lg cursor-pointer hover:bg-gray-100'>{renderResetIcon()}</div>
      </div>
      {dates.length === 0 && (
        <div className='text-2xl text-center mt-20 text-gray-400'>No data available for this section.</div>
      )}
      {dates.length > 0 && (
        <>
          <div className='w-10/12 mt-5 mx-16 overflow-x-auto p-2 pb-4 rounded-lg shadow-inner'>
            <div className='flex mb-4'>
              {dates.map((date) => {
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
        </>
      )}
    </div>
  );
}

export default Attendance;
