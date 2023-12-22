import dateFormat from 'dateformat';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarButton from '../../../components/CalendarButton';
import PageTitle from '../../../components/PageTitle';
import { useStore } from '../../../store/store';
import { AllDatesType } from '../../../utils/types';
import Friday from './Friday';
import Saturday from './Saturday';
import Sunday from './Sunday';

function AdminSchedule() {
  const { setCurrentNav, isLogin, getScheduledDates, getSaturdaySchedules } = useStore();

  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogin) {
      navigate('/');
      setCurrentNav('schedules');
    } else if (isLogin) {
      setCurrentNav('admin-schedules');
    }
  }, [isLogin]);

  const getCurrentQuarter = (currentDate: Date) => {
    const currentMonth = currentDate.getMonth() + 1;
    const currentQuarter = Math.ceil(currentMonth / 3);
    return currentQuarter;
  };
  const currentDate = new Date();
  const currentQuarter = getCurrentQuarter(currentDate);
  const currentYear = currentDate.getFullYear();
  const [quarter, setQuarter] = useState(currentQuarter);
  const [year, setYear] = useState(currentYear);

  const getDateRangeForQuarter = (quarter: number) => {
    if (quarter === 1) {
      return {
        firstDate: '-01-01',
        lastDate: '-03-31',
      };
    }
    if (quarter === 2) {
      return {
        firstDate: '-04-01',
        lastDate: '-06-30',
      };
    }
    if (quarter === 3) {
      return {
        firstDate: '-07-01',
        lastDate: '-09-30',
      };
    }
    if (quarter === 4) {
      return {
        firstDate: '-10-01',
        lastDate: '-12-31',
      };
    }
  };

  const startDate = new Date(`${year}${getDateRangeForQuarter(quarter)?.firstDate}`);
  const endDate = new Date(`${year}${getDateRangeForQuarter(quarter)?.lastDate}`);

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
      const dateString = dateFormat(currentDate, 'isoDate');
      const isFriday = day === 5;
      const isSaturday = day === 6;
      const isSunday = day === 0;
      if (isSunday) allDates.sunday.push(dateString);
      if (isFriday) allDates.friday.push(dateString);
      if (isSaturday) allDates.saturday.push(dateString);
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

  const tableHeadClass = 'flex justify-center items-center w-4/12 bg-gray-100 text-black py-2 rounded-t-2xl';
  const boxClass = `text-sm sm:text-base sm:px-12 py-2 sm:py-5 text-gray-600 rounded-3xl mt-4 font-bold border border-slate-800`;

  return (
    <div className='custom-main-container'>
      <div className='flex flex-col md:flex-row justify-between items-center pt-6 lg:pt-14'>
        <PageTitle title='Manage Schedules' />
        <CalendarButton
          quarter={quarter}
          setQuarter={setQuarter}
          year={year}
          setYear={setYear}
          currentQuarter={currentQuarter}
          currentYear={currentYear}
        />
      </div>

      <div className='mx-0 md:mx-12 lg:mx-20 flex flex-col px-4 sm:px-0'>
        <div className='w-full flex flex-col py-6 pb-0'>
          <div className='flex gap-3 text-sm sm:text-base lg:text-lg font-semibold tracking-wider my-4'>
            <div className={`flex-col ${tableHeadClass}`}>
              <div>Friday</div>
              <div>19:00-21:00</div>
            </div>
            <div className={tableHeadClass}>Saturday</div>
            <div className={`flex-col ${tableHeadClass}`}>
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
