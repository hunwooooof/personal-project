import { useStore } from '../../../store/store';
import { db, deleteDoc, doc, firestoreApi, getDoc, setDoc } from '../../../utils/firebase';

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

  const unScheduledClass = `px-12 py-5 border shadow-md rounded-lg mt-4 font-bold font-mono tracking-wider cursor-pointer relative hover:shadow-inner hover:bg-teal-50`;
  const isScheduledClass = `px-12 py-5 border shadow-md rounded-lg mt-4 font-bold font-mono tracking-wider cursor-pointer relative hover:shadow-inner hover:bg-teal-100 bg-teal-100`;

  return (
    <div>
      {!scheduledDates.includes(date) && (
        <div
          className={unScheduledClass}
          onClick={() => {
            getDoc(doc(db, 'schedule', `${year}Q${quarter}`))
              .then((scheduleSnap) => {
                if (scheduleSnap.data()) {
                  firestoreApi.updateDocArrayUnion('schedule', `${year}Q${quarter}`, 'all', date);
                  setDoc(doc(db, 'schedule', `${year}Q${quarter}`, 'sunday', date), detail);
                } else {
                  setDoc(doc(db, 'schedule', `${year}Q${quarter}`), {
                    all: [date],
                  }).then(() => {
                    setDoc(doc(db, 'schedule', `${year}Q${quarter}`, 'sunday', date), detail);
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
            firestoreApi
              .updateDocArrayRemove('schedule', `${year}Q${quarter}`, 'all', date)
              .then(() => getScheduledDates(year, quarter));
            deleteDoc(doc(db, 'schedule', `${year}Q${quarter}`, 'sunday', date));
          }}>
          {showDate}
        </div>
      )}
    </div>
  );
}

export default Sunday;
