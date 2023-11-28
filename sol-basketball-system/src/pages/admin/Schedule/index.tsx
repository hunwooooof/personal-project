import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Reset } from '../../../components/icon';
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
  const boxClass = `px-12 py-5 border rounded-lg mt-4 shadow-md font-bold font-mono tracking-wider`;

  return (
    <div className='custom-main-container mt-28'>
      <div className='w-10/12 flex flex-col mx-auto'>
        <div className='flex justify-end gap-5 mb-8 pr-16'>
          <div className='flex bg-gray-100 px-3 py-2 rounded-lg shadow-inner'>
            <div className='mr-2 text-gray-800 font-medium select-none'>{months()}</div>
            {ArrowLeft(arrowClass, () => {
              if (quarter > 1) setQuarter((n) => n - 1);
              else setQuarter(4);
            })}
            {ArrowRight(arrowClass, () => {
              if (quarter < 4) setQuarter((n) => n + 1);
              else setQuarter(1);
            })}
          </div>
          <div className='flex bg-gray-100 px-3 py-2 rounded-lg shadow-inner'>
            <div className='mr-2 text-gray-800 font-medium select-none'>{year}</div>
            {ArrowLeft(arrowClass, () => setYear((n) => n - 1))}
            {ArrowRight(arrowClass, () => setYear((n) => n + 1))}
          </div>
          <div className='p-2 rounded-lg shadow-inner cursor-pointer hover:bg-gray-100'>
            {Reset('w-6 h-6', () => {
              setQuarter(currentQuarter);
              setYear(currentYear);
            })}
          </div>
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
