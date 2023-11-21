import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { arrayRemove, arrayUnion, collection, db, doc, getDoc, getDocs, updateDoc } from '../../utils/firebase';

interface AttendanceType {
  docId: string;
  name: string;
  showUpDate: string[];
}

function Attendance() {
  const { user, isLogin } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (user.role === 'user' || !isLogin) {
      navigate('/');
    }
  }, [isLogin]);

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

  const [attendances, setAttendances] = useState<AttendanceType[]>([]);
  async function getAttendances() {
    const attendanceSnapshot = await getDocs(collection(db, 'attendance'));
    const attendanceArray: object[] = [];
    attendanceSnapshot.forEach((doc) => {
      attendanceArray.push(doc.data());
    });
    setAttendances(attendanceArray as AttendanceType[]);
  }
  useEffect(() => {
    getAttendances();
  }, [quarter, year]);

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

  const renderUncheck = (date: string, docId: string) => {
    return (
      <svg
        id={date}
        onClick={(e) => {
          updateDoc(doc(db, 'attendance', docId), {
            showUpDate: arrayUnion(e.currentTarget.id),
          }).then(() => getAttendances());
        }}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='h-6 px-4 rounded-md cursor-pointer hover:bg-gray-100'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
    );
  };

  const renderChecked = (date: string, docId: string) => {
    return (
      <svg
        id={date}
        onClick={(e) => {
          updateDoc(doc(db, 'attendance', docId), {
            showUpDate: arrayRemove(e.currentTarget.id),
          }).then(() => getAttendances());
        }}
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='currentColor'
        className='h-6 px-4 text-green-500 rounded-md cursor-pointer hover:bg-gray-100'>
        <path
          fillRule='evenodd'
          d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z'
          clipRule='evenodd'
        />
      </svg>
    );
  };

  return (
    <div className='custom-main-container mt-28'>
      <div className='w-10/12 mx-auto'>
        <div className='mt-6  px-3 py-2 text-xl border-b border-gray-200 mb-8'>Attendance</div>
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
        {dates.length === 0 && (
          <div className='text-3xl text-center mt-40 text-gray-400'>No data available for this section.</div>
        )}
        {dates.length > 0 && (
          <div className='mt-5 overflow-x-auto pr-16 pb-4'>
            <div className='pl-40 flex'>
              {dates.map((date: string) => {
                const formateDate = date.substring(5).replace('-', '/');
                return (
                  <div
                    key={date}
                    className='bg-gray-700 font-bold text-white shrink-0 w-16 text-sm tracking-wider text-center border-2 border-white rounded-md py-1 select-none'>
                    {formateDate}
                  </div>
                );
              })}
            </div>
            {Object.keys(attendances[0]).length > 0 &&
              attendances.map((attendance: AttendanceType) => {
                const { docId, name, showUpDate } = attendance;
                return (
                  <div className='flex items-center mt-3' key={name}>
                    <div className='shrink-0 w-40 bg-gray-50 font-bold tracking-wider border-2 border-white rounded-md py-1 px-2'>
                      {name.replace('-', ' ')}
                    </div>
                    <div className='flex shrink-0'>
                      {dates.map((date) => {
                        return (
                          <div
                            key={date}
                            id={date}
                            className='shrink-0 w-16 text-sm mx-auto border-2 border-white py-1 flex justify-center'>
                            {showUpDate.includes(date) ? renderChecked(date, docId) : renderUncheck(date, docId)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;
