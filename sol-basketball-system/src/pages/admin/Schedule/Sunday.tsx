import { useStore } from '../../../store/store';
import { firestore } from '../../../utils/firestore';

interface PropsType {
  date: string;
  quarter: number;
  year: number;
}

interface DetailType {
  address: 'blessed-imeldas-school';
  date: string;
  tag?: string;
  time: '19:00-21:00';
  title: 'team-practice';
}

function Sunday({ date, quarter, year }: PropsType) {
  const { scheduledDates, getScheduledDates } = useStore();
  const showDate = date.slice(5).replace('-', '/');
  const detail: DetailType = {
    address: 'blessed-imeldas-school',
    date: date,
    time: '19:00-21:00',
    title: 'team-practice',
  };

  const unScheduledClass = `px-12 py-5 rounded-3xl mt-4 font-bold text-gray-400 tracking-wider cursor-pointer relative hover:bg-slate-200`;
  const isScheduledClass = `px-12 py-5 rounded-3xl mt-4 font-bold tracking-wider cursor-pointer text-white bg-slate-500 relative hover:bg-slate-400`;

  return (
    <div>
      {!scheduledDates.includes(date) && (
        <div
          className={unScheduledClass}
          onClick={() => {
            firestore
              .getDoc('schedule', `${year}Q${quarter}`)
              .then((schedule) => {
                if (schedule) {
                  firestore.updateDocArrayUnion('schedule', `${year}Q${quarter}`, 'all', date);
                  firestore.setDoc('schedule', `${year}Q${quarter}`, detail, 'sunday', date);
                } else {
                  firestore.setDoc('schedule', `${year}Q${quarter}`, { all: [date] }).then(() => {
                    firestore.setDoc('schedule', `${year}Q${quarter}`, detail, 'sunday', date);
                  });
                }
              })
              .then(() => getScheduledDates(year, quarter));
          }}>
          {showDate}
        </div>
      )}
      {scheduledDates.includes(date) && (
        <div
          className={isScheduledClass}
          onClick={() => {
            firestore
              .updateDocArrayRemove('schedule', `${year}Q${quarter}`, 'all', date)
              .then(() => getScheduledDates(year, quarter));
            firestore.deleteDoc('schedule', `${year}Q${quarter}`, 'sunday', date);
          }}>
          {showDate}
        </div>
      )}
    </div>
  );
}

export default Sunday;
