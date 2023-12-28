import toast from 'react-hot-toast';
import { useStore } from '../../../store/store';
import { firestore } from '../../../utils/firestore';
import { formatShowDate } from '../../../utils/helpers';
import { DetailType } from '../../../utils/types';

interface PropsType {
  date: string;
  quarter: number;
  year: number;
}

function Friday({ date, quarter, year }: PropsType) {
  const { scheduledDates, getScheduledDates } = useStore();
  const showDate = formatShowDate(date);
  const isScheduled = scheduledDates.includes(date);
  const ALL = 'all';
  const FRIDAY = 'friday';

  const detail: DetailType = {
    address: 'blessed-imeldas-school',
    date: date,
    time: '19:00-21:00',
    title: 'skills-training',
  };

  const unscheduledClass = 'unScheduledClass cursor-pointer hover:bg-slate-500';
  const scheduledClass = 'isScheduledClass bg-slate-400 hover:bg-slate-400';

  const handleScheduleUpdate = async () => {
    if (isScheduled) {
      firestore.updateDocArrayRemove('schedule', `${year}Q${quarter}`, ALL, date).then(() => {
        getScheduledDates(year, quarter);
        toast.error('Unscheduled!');
      });
      firestore.deleteDoc('schedule', `${year}Q${quarter}`, FRIDAY, date);
    }
    if (!isScheduled) {
      firestore
        .getDoc('schedule', `${year}Q${quarter}`)
        .then((schedule) => {
          if (schedule) {
            firestore.updateDocArrayUnion('schedule', `${year}Q${quarter}`, ALL, date);
            firestore.setDoc('schedule', `${year}Q${quarter}`, detail, FRIDAY, date);
          } else {
            firestore.setDoc('schedule', `${year}Q${quarter}`, { all: [date] }).then(() => {
              firestore.setDoc('schedule', `${year}Q${quarter}`, detail, FRIDAY, date);
            });
          }
        })
        .then(() => {
          getScheduledDates(year, quarter);
          toast.success('Scheduled!');
        });
    }
  };

  return (
    <div>
      <div className={isScheduled ? scheduledClass : unscheduledClass} onClick={handleScheduleUpdate}>
        {showDate}
      </div>
    </div>
  );
}

export default Friday;
