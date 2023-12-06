import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Reset } from '../../../components/Icon';
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
  const { setCurrentNav, isLogin, getScheduledDates, getSaturdaySchedules } = useStore();

  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
      setCurrentNav('');
    }
  }, [isLogin]);

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

  const arrowClass = 'w-6 h-6 ml-1 rounded-full text-blue-400 cursor-pointer hover:scale-125 duration-150 select-none';
  const boxClass = `px-12 py-5 rounded-3xl mt-4 font-bold `;

  return (
    <div className='custom-main-container pt-14'>
      <div className='w-10/12 flex flex-col mx-auto'>
        <div className='flex justify-between items-center'>
          <div className='custom-page-title'>Manage Schedules</div>
          <div className='flex items-center rounded-sm border border-gray-600'>
            <div className='flex px-2 py-1 w-44 justify-end border-r border-gray-600'>
              <div className='text-white font-medium select-none text-center w-24'>{months()}</div>
              {ArrowLeft(arrowClass, () => {
                if (quarter > 1) setQuarter((n) => n - 1);
                else setQuarter(4);
              })}
              {ArrowRight(arrowClass, () => {
                if (quarter < 4) setQuarter((n) => n + 1);
                else setQuarter(1);
              })}
            </div>
            <div className='flex border-r border-gray-600 pr-2 pl-4 py-1'>
              <div className='text-white font-medium select-none'>{year}</div>
              {ArrowLeft(arrowClass, () => setYear((n) => n - 1))}
              {ArrowRight(arrowClass, () => setYear((n) => n + 1))}
            </div>
            <div className='px-2 cursor-pointer text-blue-400 hover:scale-125 duration-150'>
              {Reset('w-5 h-5', () => {
                setQuarter(currentQuarter);
                setYear(currentYear);
              })}
            </div>
          </div>
        </div>

        <div className='w-full flex flex-col p-6 pb-0'>
          <div className='flex text-lg font-bold tracking-wider mb-4 pt-6'>
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
            <div className='h-[calc(100vh-228px)] overflow-y-auto'>
              <div className='flex gap-3'>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminSchedule;
