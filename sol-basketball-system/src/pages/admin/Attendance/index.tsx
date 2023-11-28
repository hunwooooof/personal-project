import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Reset } from '../../../components/Icon';
import { useStore } from '../../../store/store';
import { firestore } from '../../../utils/firestore';

interface AttendanceType {
  docId: string;
  name: string;
  showUpDate: string[];
}

interface CreditDocType {
  all: number;
  docId: string;
  name: string;
  used: number;
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
      const schedule = await firestore.getDoc('schedule', `${year}Q${quarter}`);
      if (schedule) {
        setDates(schedule.all.sort());
      } else setDates([]);
    }
    getDates();
  }, [quarter, year]);

  const [attendances, setAttendances] = useState<AttendanceType[]>([]);
  async function getAttendances() {
    const attendanceArray = await firestore.getDocs('attendance');
    setAttendances(attendanceArray as AttendanceType[]);
  }
  useEffect(() => {
    getAttendances();
  }, [quarter, year]);

  const months = () => {
    switch (quarter) {
      case 1:
        return 'M1 - M3';
      case 2:
        return 'M4 － M6';
      case 3:
        return 'M7 － M9';
      case 4:
        return 'M10 － M12';
      default:
        return 'M1 - M3';
    }
  };

  const [allCredits, setAllCredits] = useState<CreditDocType[]>();
  async function getCredits() {
    const creditsArray = await firestore.getDocs('credits');
    setAllCredits(creditsArray as CreditDocType[]);
  }
  useEffect(() => {
    getCredits();
  }, []);

  const arrowClass = 'w-6 h-6 ml-1 rounded-full text-slate-400 cursor-pointer hover:text-black select-none';

  const renderUncheck = (date: string, docId: string) => {
    return (
      <svg
        id={date}
        onClick={(e) => {
          firestore
            .updateDocArrayUnion('attendance', docId, 'showUpDate', e.currentTarget.id)
            .then(() => getAttendances())
            .then(() => {
              firestore.getDoc('attendance', docId).then((attendance) => {
                if (attendance) {
                  const countShowUp = attendance.showUpDate.length;
                  firestore.updateDoc('credits', docId, { used: countShowUp }).then(() => getCredits());
                }
              });
            });
        }}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='h-6 px-4 rounded-md cursor-pointer hover:text-green-500'>
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
          firestore
            .updateDocArrayRemove('attendance', docId, 'showUpDate', e.currentTarget.id)
            .then(() => getAttendances())
            .then(() => {
              firestore.getDoc('attendance', docId).then((attendance) => {
                if (attendance) {
                  const countShowUp = attendance.showUpDate.length;
                  firestore.updateDoc('credits', docId, { used: countShowUp }).then(() => getCredits());
                }
              });
            });
        }}
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='currentColor'
        className='h-6 px-4 text-green-500 rounded-md cursor-pointer hover:text-slate-300'>
        <path
          fillRule='evenodd'
          d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z'
          clipRule='evenodd'
        />
      </svg>
    );
  };

  return (
    <div className='custom-main-container pt-16'>
      <div className='w-10/12 mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <div className='custom-page-title'>Attendance</div>
          <div className='flex items-center gap-2 bg-white rounded-full p-2'>
            <div className='flex bg-slate-100 px-2 py-1 rounded-full w-44 justify-end'>
              <div className='text-gray-800 font-medium select-none'>{months()}</div>
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
        {dates.length === 0 && (
          <div className='w-full h-[70vh] p-2 bg-white text-4xl text-center text-gray-400 rounded-3xl flex justify-center items-center'>
            No data available for this section.
          </div>
        )}
        {dates.length > 0 && (
          <div className='w-full min-h-[70vh] bg-white rounded-3xl flex p-6'>
            <div className='m-2 border-r'>
              <div className='font-bold text-slate-400 w-40 tracking-wider px-2 mb-5'>Name</div>
              {attendances.map((attendance: AttendanceType) => {
                const { name } = attendance;
                return (
                  <div className='shrink-0 w-40 mt-3 font-bold tracking-wider py-1 px-2' key={name}>
                    {name.replace('-', ' ')}
                  </div>
                );
              })}
            </div>
            <div className='overflow-x-auto py-2 mx-4'>
              <div className='flex mb-5'>
                {dates.map((date: string) => {
                  const formateDate = date.substring(5).replace('-', '/');
                  return (
                    <div
                      key={date}
                      className='font-bold text-slate-400 text-center w-16 tracking-wider shrink-0 select-none'>
                      {formateDate}
                    </div>
                  );
                })}
              </div>
              {attendances.length > 0 &&
                attendances.map((attendance: AttendanceType) => {
                  const { docId, name, showUpDate } = attendance;
                  return (
                    <div className='flex items-center mt-3' key={name}>
                      <div className='flex shrink-0'>
                        {dates.map((date) => {
                          return (
                            <div
                              key={date}
                              id={date}
                              className='shrink-0 w-16 text-sm mx-auto py-1 flex justify-center'>
                              {showUpDate.includes(date) ? renderChecked(date, docId) : renderUncheck(date, docId)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className='m-2 border-l'>
              <div className='flex mb-5'>
                <div className='font-bold text-slate-400 shrink-0 w-20 tracking-wider text-center select-none'>
                  Used
                </div>
                <div className='font-bold text-slate-400 shrink-0 w-24 tracking-wider text-center select-none'>
                  Purchased
                </div>
              </div>
              {attendances.map((attendance: AttendanceType) => {
                const { docId, name } = attendance;
                return (
                  <div className='flex items-center mt-3' key={name}>
                    {allCredits?.map((each) => {
                      if (each.docId === docId) {
                        return (
                          <div className='flex' key={`${docId}${each.used}${each.all}`}>
                            <div
                              className={`shrink-0 w-20 text-md mx-auto py-1 px-2 flex justify-center font-bold ${
                                each.used > each.all ? 'text-red-600' : ''
                              }`}>
                              {each.used}
                            </div>
                            <div className='shrink-0 w-24 text-md mx-auto py-1 px-2 flex justify-center font-bold'>
                              {each.all}
                            </div>
                          </div>
                        );
                      }
                    })}
                    {!allCredits?.some((each) => each.docId === docId) && (
                      <div className='flex' key={`${docId}0`}>
                        <div className='shrink-0 w-20 text-md mx-auto py-1 px-2 flex justify-center font-bold'>0</div>
                        <div className='shrink-0 w-24 text-md mx-auto py-1 px-2 flex justify-center font-bold'>0</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;
