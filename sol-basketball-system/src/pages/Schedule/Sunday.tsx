import { useStore } from '../../store/store';
import { formatShowDate } from '../../utils/helpers';
import { DetailType } from '../../utils/types';

interface PropsType {
  date: string;
  isInfoShow: boolean;
  setInfoShow: (arg0: boolean) => void;
  setInfo: (arg0: DetailType) => void;
  info: DetailType | undefined;
}

function Sunday({ date, isInfoShow, setInfoShow, setInfo, info }: PropsType) {
  const { scheduledDates } = useStore();
  const showDate = formatShowDate(date);
  const isScheduled = scheduledDates.includes(date);
  const isFocusInfo = info?.date === date;

  const detail: DetailType = {
    address: 'blessed-imeldas-school',
    date: date,
    time: '19:00-21:00',
    title: 'team-practice',
  };

  return (
    <div>
      {!isScheduled && <div className='unScheduledClass'>{showDate}</div>}
      {isScheduled && (
        <div
          className={`isScheduledClass ${isFocusInfo ? 'bg-white hover:bg-white' : 'bg-slate-400 hover:bg-slate-200'}`}
          onClick={() => {
            if (isFocusInfo && isInfoShow) {
              setInfoShow(false);
            } else {
              setInfoShow(true);
              setInfo(detail);
            }
          }}>
          {showDate}
        </div>
      )}
    </div>
  );
}

export default Sunday;
