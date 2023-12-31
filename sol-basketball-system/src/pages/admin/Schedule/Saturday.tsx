import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Edit } from '../../../components/Icon';
import { useStore } from '../../../store/store';
import { firestore } from '../../../utils/firestore';
import { formatShowDate } from '../../../utils/helpers';
import { DetailType } from '../../../utils/types';
import SatItem from './SatItem';

interface PropsType {
  date: string;
  quarter: number;
  year: number;
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
  const showDate = formatShowDate(date);
  const isScheduled = scheduledDates.includes(date);
  const [todaySchedule, setTodaySchedule] = useState<object>({ [date]: [] });
  const ALL = 'all';
  const SATURDAY = 'saturday';

  const [detail, setDetail] = useState<DetailType>({
    address: '',
    date: date,
    tag: '',
    time: '',
    title: '',
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
  const gameCount = Object.values(todaySchedule)[0].length;

  const unScheduledClass = `text-gray-600 relative text-sm sm:text-base sm:px-12 py-2 sm:py-5 rounded-md border border-gray-600 mt-4 font-bold text-gray-400 tracking-wider ${
    gameCount > 0
      ? 'hover:[&:not(:has(*:hover))]:bg-slate-500 hover:cursor-pointer'
      : 'hover:cursor-auto hover:bg-slate-800'
  }`;

  const handleClickAdd = () => {
    firestore.getDoc('schedule', `${year}Q${quarter}`, SATURDAY, date).then((schedule) => {
      if (schedule) {
        firestore
          .updateDocArrayUnion('schedule', `${year}Q${quarter}`, date, { ...detail }, SATURDAY, date)
          .then(() => getSaturdaySchedules(year, quarter));
      } else {
        firestore
          .setDoc('schedule', `${year}Q${quarter}`, { [date]: [{ ...detail }] }, SATURDAY, date)
          .then(() => getSaturdaySchedules(year, quarter));
      }
    });
  };

  return (
    <div>
      {!isScheduled && (
        <div
          className={unScheduledClass}
          onClick={() => {
            if (!isEdit && gameCount > 0) {
              firestore
                .getDoc('schedule', `${year}Q${quarter}`)
                .then((schedule) => {
                  if (schedule) {
                    firestore.updateDocArrayUnion('schedule', `${year}Q${quarter}`, ALL, date);
                  } else {
                    firestore.setDoc('schedule', `${year}Q${quarter}`, { all: [date] }).then(() => {
                      firestore.setDoc('schedule', `${year}Q${quarter}`, { [date]: [detail] }, 'saturday', date);
                    });
                  }
                })
                .then(() => {
                  getScheduledDates(year, quarter);
                  toast.success('Scheduled!');
                });
            }
          }}>
          {!isEdit && (
            <>
              <span className={gameCount > 0 ? 'text-gray-300' : 'text-gray-600'}>{`${showDate} (${gameCount})`}</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setEdit(true);
                }}>
                {Edit(
                  'absolute bg-white sm:bg-transparent rounded-full p-1 sm:p-0 -top-2 sm:top-auto right-0 sm:right-8 w-5 sm:w-6 h-5 sm:h-6 inline-block text-gray-600 cursor-pointer hover:text-gray-200',
                )}
              </span>
            </>
          )}
          {isEdit && (
            <div
              className='fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 z-10'
              onClick={() => setEdit(false)}>
              <div
                className='z-20 bg-white max-w-[600px] mx-auto mt-24 rounded-2xl py-4 cursor-default font-sans relative'
                onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setEdit(false)}
                  className='hover:bg-gray-300 px-1 py-1 rounded-full cursor-pointer absolute right-4 top-4'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    className='w-5 h-5 stroke-[1.5]'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
                <div className='text-gray-500 text-xl mb-4'>{`${date} (${gameCount})`}</div>
                {gameCount > 0 && (
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
                  <label htmlFor='time' className='inline-block ml-1 text-center'>
                    Time
                  </label>
                  <span className='inline-block w-7/12'>
                    <Input
                      isRequired
                      type='time'
                      name='start'
                      id='start'
                      aria-label='start'
                      className='w-5/12 inline-block'
                      size='sm'
                      value={detail.time.slice(0, 5)}
                      onChange={(e) => {
                        const id = e.target.value;
                        setDetail({
                          ...detail,
                          time: `${id}-${id}`,
                        });
                      }}
                    />
                    <span className='inline-block w-1/12'>～</span>
                    <Input
                      isRequired
                      type='time'
                      name='end'
                      id='end'
                      aria-label='end'
                      isInvalid={detail.time.slice(0, 5) > detail.time.slice(6)}
                      color={detail.time.slice(0, 5) > detail.time.slice(6) ? 'danger' : 'default'}
                      errorMessage={
                        detail.time.slice(0, 5) > detail.time.slice(6) &&
                        'The end time should not precede the start time.'
                      }
                      className='w-5/12 inline-block'
                      classNames={{ errorMessage: 'whitespace-nowrap absolute right-0' }}
                      size='sm'
                      value={detail.time.slice(6)}
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
                  <Select
                    isRequired
                    label='Game Type'
                    className='max-w-sm text-black'
                    id='type'
                    size='sm'
                    onChange={(e) => {
                      const id = e.target.value;
                      setDetail({
                        ...detail,
                        title: id,
                      });
                    }}>
                    {detailSelection.title.map((title) => (
                      <SelectItem key={title.id} value={title.id}>
                        {title.text}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className='mt-4 text-sm'>
                  <Select
                    isRequired
                    label='Team'
                    className='max-w-sm text-black'
                    id='type'
                    size='sm'
                    onChange={(e) => {
                      const id = e.target.value;
                      setDetail({
                        ...detail,
                        tag: id,
                      });
                    }}>
                    {detailSelection.tag.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        {tag.text}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className='mt-4 text-sm'>
                  <Select
                    isRequired
                    label='Location'
                    className='max-w-sm text-black'
                    id='type'
                    size='sm'
                    onChange={(e) => {
                      const id = e.target.value;
                      setDetail({
                        ...detail,
                        address: id,
                      });
                    }}>
                    {detailSelection.address.map((address) => (
                      <SelectItem key={address.id} value={address.id}>
                        {address.text}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className='flex gap-2 justify-center mt-4 font-normal'>
                  <Button
                    isDisabled={Object.values(detail).some((item) => item.length === 0)}
                    color='primary'
                    onClick={handleClickAdd}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {isScheduled && (
        <div
          className='isScheduledClass relative bg-slate-400 hover:bg-slate-400'
          onClick={() => {
            firestore.updateDocArrayRemove('schedule', `${year}Q${quarter}`, 'all', date).then(() => {
              getScheduledDates(year, quarter);
              toast.error('Unscheduled!');
            });
            firestore.updateDocArrayRemove('schedule', `${year}Q${quarter}`, date, detail, 'saturday', date);
          }}>
          {`${showDate} (${gameCount})`}
        </div>
      )}
    </div>
  );
}

export default Saturday;
