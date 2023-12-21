import { useEffect, useState } from 'react';
import CalendarButton from '../../components/CalendarButton';
import PageTitle from '../../components/PageTitle';
import { collection, db, firestore, onSnapshot } from '../../utils/firestore';

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
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'attendance'), (docSnaps) => {
      docSnaps.forEach((docSnap) => {
        const doc = docSnap.data();
        if (doc.docId === currentKidId) {
          setShowUpDates(doc.showUpDate);
        }
      });
    });
    return () => unsubscribe();
  }, []);

  const renderCheck = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        className='h-6 px-4 text-green-500 stroke-[1.5] stroke-current'>
        <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
      </svg>
    );
  };
  const renderMinus = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        className='w-6 h-6 px-2 text-gray-700 stroke-[1.5] stroke-current'>
        <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
      </svg>
    );
  };

  return (
    <div>
      <div className='flex flex-col md:flex-row justify-between items-center pt-6 lg:pt-14'>
        <PageTitle title='Attendance' />
        <CalendarButton
          quarter={quarter}
          setQuarter={setQuarter}
          year={year}
          setYear={setYear}
          currentQuarter={currentQuarter}
          currentYear={currentYear}
        />
      </div>
      <div className='mx-0 md:mx-12 lg:mx-20 py-5'>
        {dates.length === 0 && (
          <div className='w-full h-72 py-10 my-4 bg-white rounded-3xl text-xl flex items-center justify-center text-gray-400'>
            No data to display.
          </div>
        )}
        {dates.length > 0 && (
          <div className='w-full h-72 relative overflow-x-auto px-10 py-4 my-4 bg-white rounded-3xl'>
            <div className='flex items-center text-gray-500 mt-5'>
              {dates.map((date: string) => {
                const targetMonths = ['01', '04', '07', '10'];
                const currentMonth = date.slice(5, 7);
                if (targetMonths.includes(currentMonth)) {
                  const formateDate = date.substring(5).replace('-', '/');
                  return (
                    <div
                      key={date}
                      className='shrink-0 w-16 font-bold text-sm tracking-wider text-center py-1 select-none'>
                      {formateDate}
                    </div>
                  );
                }
              })}
            </div>
            {showUpDates.length >= 0 && (
              <div className='flex'>
                {dates.map((date: string) => {
                  const targetMonths = ['01', '04', '07', '10'];
                  const currentMonth = date.slice(5, 7);
                  if (targetMonths.includes(currentMonth)) {
                    return (
                      <div key={date} className='shrink-0 w-16 text-sm py-1 flex justify-center items-center'>
                        {showUpDates.includes(date) ? renderCheck() : renderMinus()}
                      </div>
                    );
                  }
                })}
              </div>
            )}
            <div className='flex items-center text-gray-500 mt-5'>
              {dates.map((date: string) => {
                const targetMonths = ['02', '05', '08', '11'];
                const currentMonth = date.slice(5, 7);
                if (targetMonths.includes(currentMonth)) {
                  const formateDate = date.substring(5).replace('-', '/');
                  return (
                    <div
                      key={date}
                      className='shrink-0 w-16 font-bold text-sm tracking-wider text-center py-1 select-none'>
                      {formateDate}
                    </div>
                  );
                }
              })}
            </div>
            {showUpDates.length >= 0 && (
              <div className='flex'>
                {dates.map((date: string) => {
                  const targetMonths = ['02', '05', '08', '11'];
                  const currentMonth = date.slice(5, 7);
                  if (targetMonths.includes(currentMonth)) {
                    return (
                      <div key={date} className='shrink-0 w-16 text-sm py-1 flex justify-center items-center'>
                        {showUpDates.includes(date) ? renderCheck() : renderMinus()}
                      </div>
                    );
                  }
                })}
              </div>
            )}
            <div className='flex items-center text-gray-500 mt-5'>
              {dates.map((date: string) => {
                const targetMonths = ['03', '06', '09', '12'];
                const currentMonth = date.slice(5, 7);
                if (targetMonths.includes(currentMonth)) {
                  const formateDate = date.substring(5).replace('-', '/');
                  return (
                    <div
                      key={date}
                      className='shrink-0 w-16 font-bold text-sm tracking-wider text-center py-1 select-none'>
                      {formateDate}
                    </div>
                  );
                }
              })}
            </div>
            {showUpDates.length >= 0 && (
              <div className='flex'>
                {dates.map((date: string) => {
                  const targetMonths = ['03', '06', '09', '12'];
                  const currentMonth = date.slice(5, 7);
                  if (targetMonths.includes(currentMonth)) {
                    return (
                      <div key={date} className='shrink-0 w-16 text-sm py-1 flex justify-center items-center'>
                        {showUpDates.includes(date) ? renderCheck() : renderMinus()}
                      </div>
                    );
                  }
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
