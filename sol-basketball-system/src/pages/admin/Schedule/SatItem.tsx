import { useStore } from '../../../store/store';
import { arrayRemove, db, doc, updateDoc } from '../../../utils/firebase';

interface DetailType {
  address: string;
  date: string;
  tag: string;
  time: string;
  title: string;
}

interface PropsType {
  schedule: DetailType;
  quarter: number;
  year: number;
}

function SatItem({ schedule, quarter, year }: PropsType) {
  const { getSaturdaySchedules } = useStore();

  const renderTitle = (title: string) => {
    switch (title) {
      case 'top-league-game':
        return 'Top League';
      case 'friendly':
        return 'Friendly Game';
      default:
        return 'Top League';
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
      case 'xindian-sport-center':
        return 'Xin Dian Sports Center';
      case 'high-school-normal-university':
        return 'HSNU';
      case 'jianan-elementary':
        return 'Jian An Elementary';
      case 'hondao-junior-high':
        return 'Hon Dao Junior High';
      default:
        return 'Xin Dian Sports Center';
    }
  };

  const renderTrashIcon = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
        fill='currentColor'
        onClick={() => {
          const { date } = schedule;
          updateDoc(doc(db, 'schedule', `${year}Q${quarter}`, 'saturday', date), {
            [date]: arrayRemove({ ...schedule }),
          }).then(() => getSaturdaySchedules(year, quarter));
        }}
        className='w-6 h-6 inline-block text-gray-300 cursor-pointer hover:text-red-400'>
        <path
          fillRule='evenodd'
          d='M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z'
          clipRule='evenodd'
        />
      </svg>
    );
  };

  return (
    <div className='font-normal w-10/12 shadow-lg bg-white mx-auto px-8 py-4 rounded-xl mb-4 border flex justify-between items-center'>
      <div className='w-11/12 pr-2 flex flex-col gap-2'>
        <div className='flex justify-between'>
          <div className='flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-5 h-5 text-red-300 inline mr-1'>
              <path
                fillRule='evenodd'
                d='M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.77l-.108-.054a8.25 8.25 0 00-5.69-.625l-2.202.55V21a.75.75 0 01-1.5 0V3A.75.75 0 013 2.25z'
                clipRule='evenodd'
              />
            </svg>
            {renderTitle(schedule.title)}
          </div>
          <div className='flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-5 h-5 text-green-300 inline mr-1'>
              <path
                fillRule='evenodd'
                d='M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z'
                clipRule='evenodd'
              />
            </svg>
            {renderTeam(schedule.tag)}
          </div>
        </div>
        <div className='flex justify-between'>
          <div className='flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-5 h-5 text-blue-300 inline mr-1'>
              <path
                fillRule='evenodd'
                d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z'
                clipRule='evenodd'
              />
            </svg>
            {schedule.time}
          </div>
          <div className='flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-5 h-5 text-yellow-300 inline mr-1'>
              <path
                fillRule='evenodd'
                d='M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z'
                clipRule='evenodd'
              />
            </svg>
            {renderAddress(schedule.address)}
          </div>
        </div>
      </div>
      <div>{renderTrashIcon()}</div>
    </div>
  );
}

export default SatItem;
