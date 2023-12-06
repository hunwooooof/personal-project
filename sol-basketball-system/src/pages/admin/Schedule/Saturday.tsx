import { useEffect, useState } from 'react';
import { Edit } from '../../../components/Icon';
import { useStore } from '../../../store/store';
import { firestore } from '../../../utils/firestore';
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
    time: '',
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

  const unScheduledClass = `relative px-12 py-5 rounded-3xl mt-4 font-bold text-gray-400 tracking-wider cursor-pointer ${
    isEdit ? '' : 'hover:[&:not(:has(*:hover))]:bg-slate-200'
  }`;
  const isScheduledClass = `relative px-12 py-5 rounded-3xl mt-4 font-bold tracking-wider text-white cursor-pointer bg-slate-500 hover:bg-slate-400`;

  const handleClickAdd = () => {
    firestore.getDoc('schedule', `${year}Q${quarter}`, 'saturday', date).then((schedule) => {
      if (schedule) {
        firestore
          .updateDocArrayUnion('schedule', `${year}Q${quarter}`, date, { ...detail }, 'saturday', date)
          .then(() => getSaturdaySchedules(year, quarter));
      } else {
        firestore
          .setDoc('schedule', `${year}Q${quarter}`, { [date]: [{ ...detail }] }, 'saturday', date)
          .then(() => getSaturdaySchedules(year, quarter));
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
              firestore
                .getDoc('schedule', `${year}Q${quarter}`)
                .then((schedule) => {
                  if (schedule) {
                    firestore.updateDocArrayUnion('schedule', `${year}Q${quarter}`, 'all', date);
                  } else {
                    firestore.setDoc('schedule', `${year}Q${quarter}`, { all: [date] }).then(() => {
                      firestore.setDoc('schedule', `${year}Q${quarter}`, { [date]: [detail] }, 'saturday', date);
                    });
                  }
                })
                .then(() => getScheduledDates(year, quarter));
            }
          }}>
          {!isEdit && (
            <>
              {`${showDate} (${Object.values(todaySchedule)[0].length})`}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setEdit(true);
                }}>
                {Edit('absolute right-8 w-6 h-6 inline-block text-gray-600 cursor-pointer hover:text-gray-200')}
              </span>
            </>
          )}
          {isEdit && (
            <div
              className='fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 z-10'
              onClick={() => setEdit(false)}>
              <div
                className='z-20 bg-white w-5/12 mx-auto mt-28 rounded-2xl py-8 cursor-default font-sans relative'
                onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setEdit(false)}
                  className='hover:bg-gray-300 px-2 py-1 rounded-full cursor-pointer absolute right-4 top-4'>
                  Ｘ
                </button>
                <div className='text-gray-500 text-xl mb-4'>{`${date} (${
                  Object.values(todaySchedule)[0].length
                })`}</div>
                {Object.values(todaySchedule)[0].length > 0 && (
                  <div>
                    <div id='saturday-schedules'>
                      <div className='shadow-inner max-h-60 overflow-y-auto bg-gray-100 pt-4'>
                        {todaySchedule &&
                          Object.values(todaySchedule)[0].map((eachSchedule: DetailType, id: number) => {
                            return (
                              <SatItem
                                schedule={eachSchedule}
                                key={`${eachSchedule.tag}${id}`}
                                quarter={quarter}
                                year={year}
                              />
                            );
                          })}
                      </div>
                    </div>
                    <div className='w-10/12 border mx-auto my-8' />
                  </div>
                )}
                <div className='mt-2 text-sm'>
                  <label htmlFor='time' className='inline-block mr-4 w-2/12 text-center'>
                    Time
                  </label>
                  <span className='inline-block w-6/12'>
                    <input
                      type='time'
                      name='start'
                      id='start'
                      value={detail.time.slice(0, 5)}
                      className='cursor-pointer border pl-2 py-1 rounded-md w-5/12 font-bold text-gray-800'
                      onChange={(e) => {
                        const id = e.target.value;
                        setDetail({
                          ...detail,
                          time: `${id}-${detail.time.slice(6)}`,
                        });
                      }}
                      required
                    />
                    <span className='inline-block w-2/12'>～</span>
                    <input
                      type='time'
                      name='end'
                      id='end'
                      value={detail.time.slice(6)}
                      className='cursor-pointer border pl-2 py-1 rounded-md w-5/12 font-bold text-gray-800'
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
                <div className='mt-4 text-sm'>
                  <label htmlFor='title' className='inline-block mr-4 w-2/12 text-center'>
                    Game Type
                  </label>
                  <select
                    name='title'
                    id='title'
                    value={detail.title}
                    className='cursor-pointer border font-bold px-2 py-1 rounded-md w-6/12 text-center text-gray-800'
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
                <div className='mt-4 text-sm'>
                  <label htmlFor='team' className='inline-block mr-4 w-2/12 text-center'>
                    Team
                  </label>
                  <select
                    name='team'
                    id='team'
                    value={detail.tag}
                    className='cursor-pointer border font-bold px-2 py-1 rounded-md w-6/12 text-center text-gray-800'
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
                <div className='mt-4 text-sm'>
                  <label htmlFor='address' className='inline-block mr-4 w-2/12 text-center'>
                    Location
                  </label>
                  <select
                    name='address'
                    id='address'
                    value={detail.address}
                    className='cursor-pointer border font-bold px-2 py-1 rounded-md w-6/12 text-center text-gray-800'
                    onChange={(e) => {
                      const id = e.target.value;
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
                <div className='flex gap-2 justify-center mt-4 font-normal'>
                  <button
                    onClick={handleClickAdd}
                    className={`bg-green-800 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300`}
                    disabled={Object.values(detail).some((item) => item.length === 0)}>
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
            firestore
              .updateDocArrayRemove('schedule', `${year}Q${quarter}`, 'all', date)
              .then(() => getScheduledDates(year, quarter));
            firestore.updateDocArrayRemove('schedule', `${year}Q${quarter}`, date, detail, 'saturday', date);
          }}>
          {`${showDate} (${Object.values(todaySchedule)[0].length})`}
        </div>
      )}
    </div>
  );
}

export default Saturday;
