import { useStore } from '../../store/store';

interface PropsType {
  date: string;
  setInfoShow: (arg0: boolean) => void;
  setInfo: (arg0: DetailType) => void;
}

interface DetailType {
  address: 'blessed-imeldas-school';
  date: string;
  tag?: string;
  time: '19:00-21:00';
  title: 'team-practice';
}

function Sunday({ date, setInfoShow, setInfo }: PropsType) {
  const { scheduledDates } = useStore();
  const showDate = date.slice(5).replace('-', '/');
  const detail: DetailType = {
    address: 'blessed-imeldas-school',
    date: date,
    time: '19:00-21:00',
    title: 'team-practice',
  };

  const unScheduledClass = `px-12 py-5 border shadow-md rounded-lg mt-4 font-bold font-mono tracking-wider relative`;
  const isScheduledClass = `px-12 py-5 border shadow-md rounded-lg mt-4 font-bold font-mono tracking-wider cursor-pointer relative hover:shadow-inner hover:bg-teal-100 bg-teal-100`;

  return (
    <div>
      {!scheduledDates.includes(date) && <div className={unScheduledClass}>{showDate}</div>}
      {scheduledDates.includes(date) && (
        <div
          className={isScheduledClass}
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

export default Sunday;
