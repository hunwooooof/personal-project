import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Reset } from '../../components/Icon';
import { useStore } from '../../store/store';
import { apiCalendar } from '../../utils/googleCalendar';
import Friday from './Friday';
import Saturday from './Saturday';
import Sunday from './Sunday';
import calendarIcon from './calendar-icon.png';
import googleCalendarIco from './google-calendar_icon.png';
import locationIcon from './location-icon.png';
import personIcon from './person-icon.png';
import timeIcon from './time-icon.png';

interface AllDatesType {
  friday: string[];
  saturday: string[];
  sunday: string[];
}

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
  const { getScheduledDates, getSaturdaySchedules } = useStore();
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

  const arrowClass =
    'w-5 sm:w-6 w-5 sm:h-6 ml-1 rounded-full text-blue-400 cursor-pointer hover:scale-125 duration-150 select-none';
  const boxClass = `px-12 py-5 rounded-3xl mt-4 font-bold`;

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
    <div className='custom-main-container pt-6 lg:pt-14'>
      <div className='w-10/12 mx-auto'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <div className='custom-page-title'>Schedule</div>
          <div className='flex items-center rounded-sm border border-gray-600'>
            <div className='flex px-2 py-1 w-36 sm:w-44 justify-end border-r border-gray-600'>
              <div className='text-white font-medium select-none text-center w-24 text-sm sm:text-base'>{months()}</div>
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
              <div className='text-white font-medium select-none text-sm sm:text-base'>{year}</div>
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
      </div>

      <div className='flex flex-col lg:flex-row'>
        <div className={`w-10/12 mx-auto flex flex-col lg:p-6 pb-0 ${isInfoShow ? 'h-[calc(100vh-530px)]' : 'h-auto'}`}>
          <div className='flex text-sm sm:text-base lg:text-lg font-bold tracking-wider mb-4 pt-6'>
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
                <div id='friday-container' className='w-full text-center'>
                  {allDates.friday[0].slice(8) > allDates.sunday[0].slice(8) && <div className={boxClass}>-</div>}
                  {allDates.friday.map((date) => {
                    return <Friday key={date} date={date} setInfoShow={setInfoShow} setInfo={setInfo} />;
                  })}
                </div>
                <div className='w-full text-center'>
                  {allDates.saturday[0].slice(8) > allDates.sunday[0].slice(8) && <div className={boxClass}>-</div>}
                  {allDates.saturday.map((date) => {
                    return <Saturday key={date} date={date} setInfoShow={setInfoShow} setInfo={setInfo} />;
                  })}
                </div>
                <div className='w-full text-center'>
                  {allDates.sunday.map((date) => {
                    return <Sunday key={date} date={date} setInfoShow={setInfoShow} setInfo={setInfo} />;
                  })}
                </div>
              </div>
              <div className='h-20' />
            </div>
          )}
        </div>
        {isInfoShow && info && (
          <div className='px-5 lg:px-0 lg:w-5/12 relative max-h-[calc(100vh-100px)] overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-600 pb-4'>
            <button
              onClick={() => setInfoShow(false)}
              className='hover:scale-125 duration-150 text-gray-300 px-2 py-1 rounded-full cursor-pointer absolute font-bold right-12 lg:right-6 top-7'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
            {!Array.isArray(info) && (
              <div className='px-10 py-5'>
                <div className='font-serif font-bold text-xl lg:mb-2 py-2'>
                  {renderTitle(info.title)}
                  <img
                    src={googleCalendarIco}
                    alt='google-calendar-icon'
                    className='lg:hidden ml-5 inline w-7 h-7 cursor-pointer'
                    onClick={() => {
                      handleClickGoogleCalendar(info);
                    }}
                  />
                </div>
                <div className='text-sm lg:text-md flex flex-col sm:flex-row gap-0 sm:gap-5 lg:gap-3 lg:flex-col'>
                  <div className='mt-4 flex gap-2 items-center tracking-wider'>
                    <img className='rounded-sm opacity-80 inline w-5 h-5' src={calendarIcon} alt='' />
                    {info.date.replace('-', '/').replace('-', '/')}
                  </div>
                  <div className='mt-4 flex gap-2 items-center'>
                    <img className='rounded-sm opacity-80 inline w-5 h-5' src={locationIcon} alt='' />
                    {renderAddress(info.address)}
                  </div>
                  <div className='mt-4 flex gap-2 items-center'>
                    <img className='rounded-sm opacity-80 inline w-5 h-5' src={timeIcon} alt='' />
                    {info.time}
                  </div>
                </div>
                <iframe
                  src={`https://www.google.com/maps/embed${getGoogleMapIframe(info.address)}`}
                  className='w-full h-56 sm:h-72 lg:h-80 mt-6 lg:mt-8 border'
                  loading='lazy'></iframe>
                <div className='hidden lg:flex gap-5 justify-center items-center mt-4'>
                  <span className='tracking-wider font-semibold'>Add to calendar</span>
                  <img
                    src={googleCalendarIco}
                    alt='google-calendar-icon'
                    className='w-8 h-8 cursor-pointer'
                    onClick={() => {
                      handleClickGoogleCalendar(info);
                    }}
                  />
                </div>
              </div>
            )}
            {Array.isArray(info) &&
              info.map((item, index) => {
                return (
                  <div>
                    {index > 0 && <div className='w-full border border-gray-600 my-8' />}
                    <div key={index} className='px-10 py-5'>
                      <div className='font-serif font-bold text-xl mb-2 pb-2 pt-6'>{renderTitle(item.title)}</div>
                      <div className='mt-4 flex gap-2 items-center tracking-wider'>
                        <img className='rounded-sm opacity-80 inline w-5 h-5' src={calendarIcon} alt='calendar-icon' />
                        {item.date.replace('-', '/').replace('-', '/')}
                      </div>
                      {item.tag && (
                        <div className='mt-4 flex gap-2 tracking-wider'>
                          <img className='rounded-sm opacity-80 inline w-5 h-5' src={personIcon} alt='team-icon' />
                          {renderTeam(item.tag)}
                        </div>
                      )}
                      <div className='mt-4 flex gap-2'>
                        <img className='rounded-sm opacity-80 inline w-5 h-5' src={locationIcon} alt='address-icon' />
                        {renderAddress(item.address)}
                      </div>
                      <div className='mt-4 flex gap-2 items-center'>
                        <img className='rounded-sm opacity-80 inline w-5 h-5' src={timeIcon} alt='time-icon' />
                        {item.time}
                      </div>
                      <iframe
                        src={`https://www.google.com/maps/embed${getGoogleMapIframe(item.address)}`}
                        className='w-full h-80 mt-4 border'
                        loading='lazy'></iframe>
                      <div className='flex gap-5 justify-center items-center mt-4'>
                        <span className='tracking-wider font-semibold'>Add to calendar</span>
                        <img
                          src={googleCalendarIco}
                          alt='google-calendar-icon'
                          className='w-8 h-8 cursor-pointer'
                          onClick={() => {
                            handleClickGoogleCalendar(item);
                          }}
                        />
                      </div>
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

export default Schedule;
