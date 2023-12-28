import { ScrollShadow } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarButton from '../../../components/CalendarButton';
import PageTitle from '../../../components/PageTitle';
import { useStore } from '../../../store/store';
import { firestore } from '../../../utils/firestore';
import { getCurrentQuarter } from '../../../utils/helpers';

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
  const { user, isLogin, setCurrentNav } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role === 'user' || !isLogin) {
      navigate('/');
      setCurrentNav('schedules');
    }
    if (user.role === 'admin') {
      setCurrentNav('admin-attendance');
    }
  }, [isLogin]);

  const currentDate = new Date();

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

  const [allCredits, setAllCredits] = useState<CreditDocType[]>();
  async function getCredits() {
    const creditsArray = await firestore.getDocs('credits');
    setAllCredits(creditsArray as CreditDocType[]);
  }
  useEffect(() => {
    getCredits();
  }, []);

  const updateAttendance = async (docId: string, targetId: string) => {
    await firestore.updateDocArrayUnion('attendance', docId, 'showUpDate', targetId);
  };

  const updateAttendanceToAbsent = async (docId: string, targetId: string) => {
    await firestore.updateDocArrayRemove('attendance', docId, 'showUpDate', targetId);
  };

  const renderUncheck = (date: string, docId: string) => {
    return (
      <svg
        id={date}
        onClick={(e) => {
          const targetId = e.currentTarget.id;
          firestore.getDoc('credits', docId).then((result) => {
            if (result) {
              updateAttendance(docId, targetId)
                .then(() => getAttendances())
                .then(() => {
                  firestore.getDoc('attendance', docId).then((attendance) => {
                    if (attendance) {
                      const countShowUp = attendance.showUpDate.length;
                      firestore.updateDoc('credits', docId, { used: countShowUp }).then(() => getCredits());
                    }
                  });
                });
            }
          });
        }}
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        className='h-6 px-4 rounded-md cursor-pointer hover:text-green-500 stroke-current stroke-[1.5] fill-none'>
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
          const targetId = e.currentTarget.id;
          updateAttendanceToAbsent(docId, targetId)
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
        className='h-6 px-4 text-green-500 rounded-md cursor-pointer hover:text-slate-300 fill-current'>
        <path
          fillRule='evenodd'
          d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z'
          clipRule='evenodd'
        />
      </svg>
    );
  };

  return (
    <div className='custom-main-container'>
      <div className='flex flex-col md:flex-row justify-between items-center pt-6 lg:pt-14 pb-14'>
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
      <div className='mx-0 md:mx-12 lg:mx-20 rounded-2xl bg-white'>
        {dates.length === 0 && (
          <div className='w-full h-[70vh] p-2 text-xl text-center text-gray-600 flex justify-center items-center'>
            No data available for this section.
          </div>
        )}
        {dates.length > 0 && (
          <div className='w-full min-h-[70vh] flex px-6 text-black'>
            <div className='pl-2 py-6'>
              <div className='w-40 px-2 mb-5 py-2 font-bold text-gray-500 bg-gray-100 rounded-l-lg'>Name</div>
              {attendances.map((attendance: AttendanceType) => {
                const { name } = attendance;
                return (
                  <div
                    className='shrink-0 w-40 mt-3 bg-white font-bold tracking-wide py-1 px-2 truncate hover:max-w-[none] hover:overflow-visible rounded-lg'
                    key={name}>
                    {name.replace('-', ' ')}
                  </div>
                );
              })}
            </div>
            <ScrollShadow orientation='horizontal' className='w-full h-full'>
              <div className='py-6'>
                <div className='flex mb-5 py-2 font-bold text-gray-500 bg-gray-100 w-[1800px]'>
                  {dates.map((date: string) => {
                    const formateDate = date.substring(5).replace('-', '/');
                    return (
                      <div key={date} className='text-center w-16 tracking-wide shrink-0 select-none'>
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
            </ScrollShadow>
            <div className='py-6'>
              <div className='flex mb-5 pr-2 py-2 font-bold text-gray-500 bg-gray-100 rounded-r-lg'>
                <div className='shrink-0 w-20 text-center select-none'>Used</div>
                <div className='shrink-0 w-24 text-center select-none'>Purchased</div>
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
