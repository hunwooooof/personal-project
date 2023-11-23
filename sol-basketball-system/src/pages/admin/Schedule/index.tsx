import { useEffect, useState } from 'react';
import { useStore } from '../../../store/store';
import Friday from './Friday';
import Saturday from './Saturday';
import Sunday from './Sunday';

interface AllDatesType {
  friday: string[];
  saturday: string[];
  sunday: string[];
}
function AdminSchedule() {
  const { getScheduledDates, getSaturdaySchedules } = useStore();
  const getCurrentQuarter = (currentDate: Date) => {
    const currentMonth = currentDate.getMonth() + 1; // JavaScript 中月份是從 0 開始的
    const currentQuarter = Math.ceil(currentMonth / 3);
    return currentQuarter;
  };
  const currentDate = new Date();
  const currentQuarter = getCurrentQuarter(currentDate);
  const currentYear = currentDate.getFullYear();
  const [quarter, setQuarter] = useState(currentQuarter);
  const [year, setYear] = useState(currentYear);

  const firstDate = () => {
    switch (quarter) {
      case 1:
        return '-01-01';
      case 2:
        return '-04-01';
      case 3:
        return '-07-01';
      case 4:
        return '-010-01';
      default:
        return '-01-01';
    }
  };

  const lastDate = () => {
    switch (quarter) {
      case 1:
        return '-03-31';
      case 2:
        return '-06-30';
      case 3:
        return '-09-30';
      case 4:
        return '-12-31';
      default:
        return '-03-31';
    }
  };

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

  const startDate = new Date(`${year}${firstDate()}`);
  const endDate = new Date(`${year}${lastDate()}`);

  const getValidDate = (firstDate: Date, lastDate: Date) => {
    const allDates: AllDatesType = {
      friday: [],
      saturday: [],
      sunday: [],
    };
    for (
      let currentDate = new Date(firstDate);
      currentDate <= lastDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const day = currentDate.getDay();
      const yyyy = currentDate.getFullYear();
      const mm = currentDate.getMonth() + 1;
      const formattedMm = mm < 10 ? `0${mm}` : String(mm);
      const dd = currentDate.getDate();
      const formattedDd = dd < 10 ? `0${dd}` : String(dd);
      const dateString = `${yyyy}-${formattedMm}-${formattedDd}`;
      if (day === 0) {
        allDates.sunday.push(dateString);
      } else if (day === 5) {
        allDates.friday.push(dateString);
      }
      if (day === 6) {
        allDates.saturday.push(dateString);
      }
    }
    return allDates;
  };

  const [allDates, setAllDates] = useState<AllDatesType>();
  useEffect(() => {
    const initialAllDates = getValidDate(startDate, endDate);
    setAllDates(initialAllDates);
    getScheduledDates(year, quarter);
    getSaturdaySchedules(year, quarter);
  }, [quarter, year]);

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
  const boxClass = `px-12 py-5 border rounded-lg mt-4 shadow-md font-bold font-mono tracking-wider`;

  return (
    <div className='custom-main-container mt-28'>
      <div className='w-10/12 flex flex-col mx-auto'>
        <div className='flex justify-end gap-5 mb-8 pr-16'>
          <div className='flex bg-gray-100 px-3 py-2 rounded-lg shadow-inner'>
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
          <div className='flex bg-gray-100 px-3 py-2 rounded-lg shadow-inner'>
            <div className='mr-2 text-gray-800 font-medium select-none'>{year}</div>
            <span onClick={() => setYear((n) => n - 1)}>{renderArrowLeft()}</span>
            <span onClick={() => setYear((n) => n + 1)}>{renderArrowRight()}</span>
          </div>
          <div className='p-2 rounded-lg shadow-inner cursor-pointer hover:bg-gray-100'>{renderResetIcon()}</div>
        </div>
        <div className='w-full mr-5 flex flex-col'>
          <div className='bg-gray-300 flex rounded-lg text-black font-bold font-serif tracking-wider py-2 border-b-4 border-gray-400'>
            <div className='flex flex-col justify-center items-center w-4/12'>
              <div>Friday</div>
              <div>19:00-21:00</div>
            </div>
            <div className='w-4/12 flex justify-center items-center'>Saturday</div>
            <div className='flex flex-col justify-center items-center w-4/12'>
              <div>Sunday</div>
              <div>16:30-18:30</div>
            </div>
          </div>
          {allDates && (
            <div className='flex gap-3 pb-24'>
              <div className='w-full text-center'>
                {allDates.friday[0].slice(8) > allDates.sunday[0].slice(8) && <div className={boxClass}>-</div>}
                {allDates.friday.map((date) => {
                  return <Friday key={date} date={date} quarter={quarter} year={year} />;
                })}
              </div>
              <div className='w-full text-center'>
                {allDates.saturday[0].slice(8) > allDates.sunday[0].slice(8) && <div className={boxClass}>-</div>}
                {allDates.saturday.map((date) => {
                  return <Saturday key={date} date={date} quarter={quarter} year={year} />;
                })}
              </div>
              <div className='w-full text-center'>
                {allDates.sunday.map((date) => {
                  return <Sunday key={date} date={date} quarter={quarter} year={year} />;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminSchedule;
