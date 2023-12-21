import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CalendarButton from '../../components/CalendarButton';
import PageTitle from '../../components/PageTitle';
import { useStore } from '../../store/store';
import { apiCalendar } from '../../utils/googleCalendar';
import { AllDatesType } from '../../utils/types';
import Friday from './Friday';
import Saturday from './Saturday';
import Sunday from './Sunday';
import googleCalendarIco from './google-calendar_icon.png';

interface DetailType {
  address: string;
  date: string;
  tag?: string;
  time: string;
  title: string;
}

interface EventType {
  end: {
    dateTime: string;
    timeZone: string;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  location: string;
  summary: string;
  description: string;
}

function Schedule() {
  const { getScheduledDates, getSaturdaySchedules, setCurrentNav } = useStore();
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

  useEffect(() => {
    setCurrentNav('schedules');
  }, []);

  const firstDate = () => {
    switch (quarter) {
      case 1:
        return '-01-01';
      case 2:
        return '-04-01';
      case 3:
        return '-07-01';
      case 4:
        return '-10-01';
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

  const startDate = new Date(`${year}${firstDate()}`);
  const endDate = new Date(`${year}${lastDate()}`);

  const formatDate = (date: Date): string => {
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const formattedMm = mm < 10 ? `0${mm}` : String(mm);
    const dd = date.getDate();
    const formattedDd = dd < 10 ? `0${dd}` : String(dd);
    return `${yyyy}-${formattedMm}-${formattedDd}`;
  };

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
      const dateString = formatDate(currentDate);
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

  // ==================
  //  More Information
  // ==================

  const [isInfoShow, setInfoShow] = useState(false);
  const [info, setInfo] = useState<DetailType | DetailType[]>();

  const renderTitle = (title: string) => {
    switch (title) {
      case 'skills-training':
        return 'Skills Training';
      case 'team-practice':
        return 'Team Practice';
      case 'top-league-game':
        return 'Top League';
      case 'friendly':
        return 'Friendly Game';
      default:
        return 'Skills Training';
    }
  };
  const renderTeam = (tag: string) => {
    switch (tag) {
      case 'u10r':
        return 'U10 Roadrunners Rookies';
      case 'u10':
        return 'U10 Roadrunners';
      case 'u12':
        return 'U12 Roadrunners';
      default:
        return 'U10 Roadrunners Rookies';
    }
  };
  const renderAddress = (address: string) => {
    switch (address) {
      case 'blessed-imeldas-school':
        return 'Blessed Imeldas School 5th floor';
      case 'xindian-sport-center':
        return 'Xin Dian Sports Center';
      case 'high-school-normal-university':
        return 'HSNU';
      case 'jianan-elementary':
        return 'Jian An Elementary';
      case 'hondao-junior-high':
        return 'Hon Dao Junior High';
      default:
        return 'Blessed Imeldas School 5th floor';
    }
  };
  const getGoogleMapIframe = (address: string) => {
    switch (address) {
      case 'blessed-imeldas-school':
        return '?pb=!1m18!1m12!1m3!1d903.5746470077161!2d121.51451426962149!3d25.057866998612546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a96ac762a305%3A0x7596931acbdc09b7!2z6Z2c5L-u5a2455Sf5rS75YuV5Lit5b-D!5e0!3m2!1szh-TW!2stw!4v1700727351270!5m2!1szh-TW!2stw';
      case 'xindian-sport-center':
        return '?pb=!1m18!1m12!1m3!1d3616.9687633585777!2d121.53989727590383!3d24.967177377859684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34680192061b03d5%3A0x3c613171e5e81235!2z5paw5YyX5biC5paw5bqX5ZyL5rCR6YGL5YuV5Lit5b-D!5e0!3m2!1szh-TW!2stw!4v1700732047854!5m2!1szh-TW!2stw';
      case 'high-school-normal-university':
        return '?pb=!1m18!1m12!1m3!1d3615.0122253410727!2d121.53784687590569!3d25.033659177816578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442abd4e67885b5%3A0xa77f6b69f084634e!2z5ZyL56uL6Ie654Gj5bir56-E5aSn5a246ZmE5bGs6auY57Sa5Lit5a24!5e0!3m2!1szh-TW!2stw!4v1700732216331!5m2!1szh-TW!2stw';
      case 'jianan-elementary':
        return '?pb=!1m18!1m12!1m3!1d3615.1368903041075!2d121.54357737590563!3d25.029428077819368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442aa2d22bae595%3A0x8a3cd0da6072ff08!2z6Ie65YyX5biC5aSn5a6J5Y2A5bu65a6J5ZyL5rCR5bCP5a24!5e0!3m2!1szh-TW!2stw!4v1700732240951!5m2!1szh-TW!2stw';
      case 'hondao-junior-high':
        return '?pb=!1m18!1m12!1m3!1d14459.59777760741!2d121.49683948530854!3d25.03748636047309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a99fe6965fd3%3A0xbccf20390ec125cc!2z6Ie65YyX5biC56uL5byY6YGT5ZyL5rCR5Lit5a24!5e0!3m2!1szh-TW!2stw!4v1700732176326!5m2!1szh-TW!2stw';
      default:
        return '?pb=!1m18!1m12!1m3!1d903.5746470077161!2d121.51451426962149!3d25.057866998612546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a96ac762a305%3A0x7596931acbdc09b7!2z6Z2c5L-u5a2455Sf5rS75YuV5Lit5b-D!5e0!3m2!1szh-TW!2stw!4v1700727351270!5m2!1szh-TW!2stw';
    }
  };

  // ==========
  //  Calendar
  // ==========

  const handleClickGoogleCalendar = (item: DetailType) => {
    const userConfirm = confirm('To add an event to your Google Calendar, press "OK" to select an account.');
    if (userConfirm) {
      apiCalendar.handleAuthClick().then(() => {
        const event: EventType = {
          start: {
            dateTime: `${item.date}T${item.time.slice(0, 5)}:00+08:00`,
            timeZone: 'Asia/Taipei',
          },
          end: {
            dateTime: `${item.date}T${item.time.slice(6)}:00+08:00`,
            timeZone: 'Asia/Taipei',
          },
          location: `${renderAddress(item.address)}`,
          summary: `${renderTitle(item.title)}`,
          description: `${item.tag ? renderTeam(item.tag) : ''}`,
        };
        apiCalendar.createEvent(event).then((result: object) => {
          console.log(result);
        });
      });
    }
  };

  return (
    <div className='custom-main-container'>
      <div className='flex flex-col lg:flex-row w-full lg:w-auto'>
        <div className={`duration-150 px-4 sm:px-0 ${isInfoShow ? 'lg:w-[calc(100%-350px)]' : 'lg:w-full'}`}>
          <div className='flex flex-col md:flex-row justify-between items-center pt-6 lg:pt-14'>
            <PageTitle title='Schedule' />
            <CalendarButton
              quarter={quarter}
              setQuarter={setQuarter}
              year={year}
              setYear={setYear}
              currentQuarter={currentQuarter}
              currentYear={currentYear}
            />
          </div>

          <div
            className={`flex flex-col lg:py-6 pb-0 ${
              isInfoShow ? 'mx-0 md:mx-12 h-[calc(100vh-540px)] lg:h-auto' : 'mx-0 md:mx-12 lg:mx-20 h-auto'
            }`}>
            <div className='flex gap-3 text-sm sm:text-base lg:text-lg font-semibold tracking-wider my-4'>
              <div className={`flex-col ${tableHeadClass}`}>
                <div>Friday</div>
                <div>19:00-21:00</div>
              </div>
              <div className={`flex-col ${tableHeadClass}`}>
                <div>Saturday</div>
                <div>Flexible</div>
              </div>
              <div className={`flex-col ${tableHeadClass}`}>
                <div>Sunday</div>
                <div>16:30-18:30</div>
              </div>
            </div>
            {allDates && (
              <div className='h-[calc(100vh-228px)] overflow-y-auto'>
                <div className='flex gap-3'>
                  <div id='friday-container' className='w-full text-center'>
                    {allDates.friday[0].slice(8) > allDates.sunday[0].slice(8) && <div className={boxClass}>-</div>}
                    {allDates.friday.map((date) => {
                      return (
                        <Friday
                          key={date}
                          date={date}
                          isInfoShow={isInfoShow}
                          setInfoShow={setInfoShow}
                          setInfo={setInfo}
                          info={info as DetailType}
                        />
                      );
                    })}
                  </div>
                  <div className='w-full text-center'>
                    {allDates.saturday[0].slice(8) > allDates.sunday[0].slice(8) && <div className={boxClass}>-</div>}
                    {allDates.saturday.map((date) => {
                      return (
                        <Saturday
                          key={date}
                          date={date}
                          isInfoShow={isInfoShow}
                          setInfoShow={setInfoShow}
                          setInfo={setInfo}
                          info={info as DetailType[]}
                        />
                      );
                    })}
                  </div>
                  <div className='w-full text-center'>
                    {allDates.sunday.map((date) => {
                      return (
                        <Sunday
                          key={date}
                          date={date}
                          isInfoShow={isInfoShow}
                          setInfoShow={setInfoShow}
                          setInfo={setInfo}
                          info={info as DetailType}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className='sm:h-20' />
              </div>
            )}
          </div>
        </div>
        <AnimatePresence>
          {isInfoShow && info && (
            <motion.div
              key='infoBox'
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.2, type: 'tween' }}
              className='lg:w-[350px] text-white border-t lg:border-t-0 lg:border-l border-gray-600 pb-4 lg:min-h-screen lg:max-h-[calc(100vh-100px)] overflow-y-auto overflow-x-hidden'>
              <div className='lg:w-[350px] px-8 pt-4 sm:pt-14 sm:pb-8 flex items-center justify-between text-lg'>
                <div className='sm:text-2xl font-semibold text-zinc-300'>Course Detail</div>
                <button
                  onClick={() => setInfoShow(false)}
                  className='hover:scale-125 hover:text-white duration-150 text-gray-300 px-2 py-1 cursor-pointer font-bold'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    className='w-6 h-6 stroke-current stroke-[1.5] fill-none'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
              {!Array.isArray(info) && (
                <div className='px-8 py-5'>
                  <div className='font-bold text-xl lg:mb-2 py-2'>{renderTitle(info.title)}</div>
                  <div className='text-sm text-gray-200 lg:text-base flex flex-col sm:flex-row gap-0 sm:gap-5 lg:gap-0 lg:flex-col'>
                    <div className='mt-4 flex gap-2 items-center tracking-wider'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        className='w-5 h-5 stroke-current stroke-[1.5 fill-none'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5'
                        />
                      </svg>
                      {info.date.replace('-', '/').replace('-', '/')}
                    </div>
                    <div className='mt-4 flex gap-2 items-center tracking-wider'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        className='w-5 h-5 stroke-current stroke-[1.5] fill-none'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z' />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'
                        />
                      </svg>
                      {renderAddress(info.address)}
                    </div>
                    <div className='mt-4 flex gap-2 items-center tracking-wider'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        className='w-5 h-5 stroke-current stroke-[1.5] fill-none'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                      {info.time}
                    </div>
                    {new Date(info.date) > new Date() && (
                      <div className=''>
                        <div
                          className='rounded-full bg-slate-700 py-1 mt-8 flex justify-center gap-4 items-center cursor-pointer text-gray-300 hover:text-white hover:bg-slate-600 duration-150'
                          onClick={() => {
                            handleClickGoogleCalendar(info);
                          }}>
                          <img src={googleCalendarIco} alt='google-calendar-icon' className='w-5 h-5' />
                          Add to calendar
                        </div>
                        <Link
                          to='/login'
                          className='rounded-full bg-slate-700 py-1 mt-4 flex justify-center gap-4 items-center cursor-pointer text-gray-300 hover:text-white hover:bg-slate-600 duration-150'
                          onClick={() => setCurrentNav('')}>
                          Log in to purchase sessions
                        </Link>
                      </div>
                    )}
                  </div>
                  <iframe
                    src={`https://www.google.com/maps/embed${getGoogleMapIframe(info.address)}`}
                    className='w-full h-56 sm:h-72 lg:h-80 mt-6 lg:mt-8 rounded-2xl'
                    loading='lazy'
                  />
                </div>
              )}
              {Array.isArray(info) &&
                info.map((item, index) => {
                  return (
                    <div>
                      {index > 0 && <div className='w-full border border-gray-600 my-8' />}
                      <div key={index} className='px-8 py-5'>
                        <div className='font-bold text-xl lg:mb-2 py-2'>{renderTitle(item.title)}</div>
                        <div className='mt-4 flex text-gray-200 gap-2 items-center tracking-wider'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                            className='w-5 h-5 stroke-current stroke-[1.5] fill-none'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5'
                            />
                          </svg>
                          {item.date.replace('-', '/').replace('-', '/')}
                        </div>
                        {item.tag && (
                          <div className='mt-4 flex gap-2 items-center tracking-wider'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 24 24'
                              className='w-5 h-5 stroke-current stroke-[1.5] fill-none'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z'
                              />
                            </svg>
                            {renderTeam(item.tag)}
                          </div>
                        )}
                        <div className='mt-4 flex gap-2 items-center tracking-wider'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                            className='w-5 h-5 stroke-current stroke-[1.5] fill-none'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z' />
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'
                            />
                          </svg>
                          {renderAddress(item.address)}
                        </div>
                        <div className='mt-4 flex gap-2 items-center tracking-wider'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                            className='w-5 h-5 stroke-current stroke-[1.5] fill-none'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
                            />
                          </svg>
                          {item.time}
                        </div>
                        {new Date(item.date) > new Date() && (
                          <div
                            className='rounded-full bg-slate-700 py-1 mt-8 flex justify-center gap-4 items-center cursor-pointer text-gray-300 hover:text-white hover:bg-slate-600 duration-150'
                            onClick={() => {
                              handleClickGoogleCalendar(item);
                            }}>
                            <img src={googleCalendarIco} alt='google-calendar-icon' className='w-5 h-5' />
                            Add to calendar
                          </div>
                        )}
                        <iframe
                          src={`https://www.google.com/maps/embed${getGoogleMapIframe(item.address)}`}
                          className='w-full h-56 sm:h-72 lg:h-80 mt-6 lg:mt-8 rounded-2xl'
                          loading='lazy'
                        />
                      </div>
                    </div>
                  );
                })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Schedule;
