import { useStore } from '../../store/store';

interface DetailType {
  address: string;
  date: string;
  tag?: string;
  time: string;
  title: string;
}
interface PropsType {
  date: string;
  setInfoShow: (arg0: boolean) => void;
  setInfo: (arg0: DetailType) => void;
  info: DetailType | undefined;
}

function Friday({ date, setInfoShow, setInfo, info }: PropsType) {
  const { scheduledDates } = useStore();
  const showDate = date.slice(5).replace('-', '/');
  const detail: DetailType = {
    address: 'blessed-imeldas-school',
    date: date,
    time: '19:00-21:00',
    title: 'skills-training',
  };

  return (
    <div>
      {!scheduledDates.includes(date) && <div className='unScheduledClass'>{showDate}</div>}
      {scheduledDates.includes(date) && (
        <div
          className={`isScheduledClass ${
            info?.date === date ? 'bg-white hover:bg-white' : 'bg-slate-400 hover:bg-slate-200'
          }`}
          onClick={() => {
            setInfoShow(true);
            setInfo(detail);
          }}>
          {showDate}
        </div>
      )}
    </div>
  );
}

export default Friday;
