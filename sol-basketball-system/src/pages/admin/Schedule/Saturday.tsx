import { useEffect, useState } from 'react';
import { useStore } from '../../../store/store';
import { arrayRemove, arrayUnion, db, doc, getDoc, setDoc, updateDoc } from '../../../utils/firebase';
import SatItem from './SatItem';

interface PropsType {
  date: string;
  quarter: number;
  year: number;
}

interface DetailType {
  address: string;
  date: string;
  tag: string;
  time: string;
  title: string;
}

const detailSelection = {
  address: [
    { id: 'xindian-sport-center', text: 'Xin Dian Sports Center' },
    { id: 'high-school-normal-university', text: 'HSNU' },
    { id: 'jianan-elementary', text: 'Jian An Elementary' },
    { id: 'hondao-junior-high', text: 'Hon Dao Junior High' },
  ],
  tag: [
    { id: 'u10r', text: 'U10 Roadrunners Rookies' },
    { id: 'u10', text: 'U10 Roadrunners' },
    { id: 'u12', text: 'U12 Roadrunners' },
  ],
  title: [
    { id: 'top-league-game', text: 'Top League' },
    { id: 'friendly', text: 'Friendly Game' },
  ],
};

function Saturday({ date, quarter, year }: PropsType) {
  const { scheduledDates, getScheduledDates, saturdaySchedules, getSaturdaySchedules } = useStore();
  const showDate = date.slice(5).replace('-', '/');
  const [todaySchedule, setTodaySchedule] = useState<object>({ [date]: [] });
  const [detail, setDetail] = useState<DetailType>({
    address: 'xindian-sport-center',
    date: date,
    tag: 'u10r',
    time: '00:00-00:00',
    title: 'top-league-game',
  });

  const getTodaySchedule = (date: string) => {
    const theDay = saturdaySchedules.find((dateEvents) => {
      const dateString = Object.keys(dateEvents);
      return dateString[0] === date;
    });
    if (theDay) return theDay;
  };

  useEffect(() => {
    if (saturdaySchedules) {
      const initialSchedule = getTodaySchedule(date);
      if (initialSchedule) setTodaySchedule(initialSchedule);
    }
  }, [saturdaySchedules]);

  const [isEdit, setEdit] = useState<boolean>(false);

  const unScheduledClass = `relative px-12 py-5 border rounded-lg mt-4 font-bold font-mono tracking-wider cursor-pointer relative hover:shadow-inner ${
    isEdit ? 'shadow-inner' : 'shadow-md hover:[&:not(:has(*:hover))]:bg-teal-50'
  }`;
  const isScheduledClass = `relative px-12 py-5 border shadow-md rounded-lg mt-4 font-bold font-mono tracking-wider cursor-pointer relative hover:shadow-inner hover:bg-teal-50 bg-teal-50 `;

  const renderEditIcon = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='currentColor'
        viewBox='0 0 24 24'
        onClick={(e) => {
          e.stopPropagation();
          setEdit(true);
        }}
        className='absolute right-3 w-6 h-6 inline-block pb-1 text-gray-300 cursor-pointer hover:text-black'>
        <path d='M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z' />
        <path d='M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z' />
      </svg>
    );
  };

  const handleClickAdd = () => {
    getDoc(doc(db, 'schedule', `${year}Q${quarter}`, 'saturday', date)).then((scheduleSnap) => {
      if (scheduleSnap.data()) {
        updateDoc(doc(db, 'schedule', `${year}Q${quarter}`, 'saturday', date), {
          [date]: arrayUnion({ ...detail }),
        }).then(() => getSaturdaySchedules(year, quarter));
      } else {
        setDoc(doc(db, 'schedule', `${year}Q${quarter}`, 'saturday', date), {
          [date]: [{ ...detail }],
        }).then(() => getSaturdaySchedules(year, quarter));
      }
    });
  };

  return (
    <div>
      {!scheduledDates.includes(date) && (
        <div
          className={unScheduledClass}
          onClick={() => {
            if (!isEdit) {
              getDoc(doc(db, 'schedule', `${year}Q${quarter}`))
                .then((scheduleSnap) => {
                  if (scheduleSnap.data()) {
                    updateDoc(doc(db, 'schedule', `${year}Q${quarter}`), {
                      all: arrayUnion(date),
                    });
                  } else {
                    setDoc(doc(db, 'schedule', `${year}Q${quarter}`), {
                      all: [date],
                    }).then(() => {
                      setDoc(doc(db, 'schedule', `${year}Q${quarter}`, 'saturday', date), {
                        [date]: [{ ...detail }],
                      });
                    });
                  }
                })
                .then(() => getScheduledDates(year, quarter));
            }
          }}>
          {!isEdit && (
            <>
              {showDate}
              {renderEditIcon()}
            </>
          )}
          {isEdit && (
            <div
              className='fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-10'
              onClick={() => setEdit(false)}>
              <div
                className='z-20 bg-white w-5/12 mx-auto mt-28 rounded-2xl py-8 cursor-default font-sans relative'
                onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setEdit(false)}
                  className='hover:bg-gray-300 px-2 py-1 rounded-full cursor-pointer absolute right-4 top-4'>
                  Ｘ
                </button>
                <div className='text-gray-500 text-xl mb-4'>{date}</div>
                <div id='saturday-schedules'>
                  <div className='shadow-inner mh-64 overflow-y-auto bg-gray-100 pt-4'>
                    {todaySchedule &&
                      Object.values(todaySchedule)[0].map((eachSchedule: DetailType) => {
                        return <SatItem schedule={eachSchedule} key={eachSchedule.tag} />;
                      })}
                  </div>
                </div>
                <div className='w-10/12 border mx-auto my-8' />
                <div className='-mt-2'>
                  <label htmlFor='time' className='inline-block mr-4 w-2/12 text-end'>
                    Time
                  </label>
                  <span className='inline-block w-6/12'>
                    <input
                      type='time'
                      name='start'
                      id='start'
                      value={detail.time.slice(0, 5)}
                      className='cursor-pointer border pl-2 py-1 rounded-md w-5/12 font-normal'
                      onChange={(e) => {
                        const id = e.target.value;
                        setDetail({
                          ...detail,
                          time: `${id}-${detail.time.slice(6)}`,
                        });
                      }}
                    />
                    <span className='inline-block w-2/12'>～</span>
                    <input
                      type='time'
                      name='end'
                      id='end'
                      value={detail.time.slice(6)}
                      className='cursor-pointer border pl-2 py-1 rounded-md w-5/12 font-normal'
                      onChange={(e) => {
                        const id = e.target.value;
                        setDetail({
                          ...detail,
                          time: `${detail.time.slice(0, 5)}-${id}`,
                        });
                      }}
                    />
                  </span>
                </div>
                <div className='mt-4'>
                  <label htmlFor='title' className='inline-block mr-4 w-2/12 text-end'>
                    Title
                  </label>
                  <select
                    name='title'
                    id='title'
                    value={detail.title}
                    className='cursor-pointer border font-normal px-2 py-1 rounded-md w-6/12 text-center'
                    onChange={(e) => {
                      const id = e.target.value;
                      setDetail({
                        ...detail,
                        title: id,
                      });
                    }}>
                    {detailSelection.title.map((title) => {
                      return (
                        <option key={title.id} value={title.id}>
                          {title.text}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className='mt-4'>
                  <label htmlFor='team' className='inline-block mr-4 w-2/12 text-end'>
                    Team
                  </label>
                  <select
                    name='team'
                    id='team'
                    value={detail.tag}
                    className='cursor-pointer border font-normal px-2 py-1 rounded-md w-6/12 text-center'
                    onChange={(e) => {
                      const id = e.target.value;
                      setDetail({
                        ...detail,
                        tag: id,
                      });
                    }}>
                    {detailSelection.tag.map((tag) => {
                      return (
                        <option key={tag.id} value={tag.id}>
                          {tag.text}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className='mt-4'>
                  <label htmlFor='address' className='inline-block mr-4 w-2/12 text-end'>
                    Location
                  </label>
                  <select
                    name='address'
                    id='address'
                    value={detail.address}
                    className='cursor-pointer border font-normal px-2 py-1 rounded-md w-6/12 text-center'
                    onChange={(e) => {
                      const id = e.target.value;
                      console.log(id);
                      setDetail({
                        ...detail,
                        address: id,
                      });
                    }}>
                    {detailSelection.address.map((address) => {
                      return (
                        <option key={address.id} value={address.id}>
                          {address.text}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className='flex gap-2 justify-center mt-3'>
                  <button onClick={handleClickAdd} className='bg-green-400 px-2 py-1 rounded-md cursor-pointer'>
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {scheduledDates.includes(date) && (
        <div
          className={isScheduledClass}
          onClick={() => {
            updateDoc(doc(db, 'schedule', `${year}Q${quarter}`), {
              all: arrayRemove(date),
            }).then(() => getScheduledDates(year, quarter));
            updateDoc(doc(db, 'schedule', `${year}Q${quarter}`, 'saturday', date), {
              [date]: arrayRemove(detail),
            });
          }}>
          {showDate}
        </div>
      )}
    </div>
  );
}

export default Saturday;
