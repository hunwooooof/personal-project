import { useStore } from '../../../store/store';
import { arrayRemove, arrayUnion, db, deleteDoc, doc, getDoc, setDoc, updateDoc } from '../../../utils/firebase';

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
  title: 'skills-training';
}

function Friday({ date, quarter, year }: PropsType) {
  const { scheduledDates, getScheduledDates } = useStore();
  const showDate = date.slice(5).replace('-', '/');
  const detail: DetailType = {
    address: 'blessed-imeldas-school',
    date: date,
    time: '19:00-21:00',
    title: 'skills-training',
  };

  const unScheduledClass = `px-12 py-5 border shadow-md rounded-lg mt-4 font-bold font-mono tracking-wider cursor-pointer relative hover:shadow-inner hover:bg-teal-50`;
  const isScheduledClass = `px-12 py-5 border shadow-md rounded-lg mt-4 font-bold font-mono tracking-wider cursor-pointer relative hover:shadow-inner hover:bg-teal-50 bg-teal-50`;

  return (
    <div>
      {!scheduledDates.includes(date) && (
        <div
          className={unScheduledClass}
          onClick={() => {
            getDoc(doc(db, 'schedule', `${year}Q${quarter}`))
              .then((scheduleSnap) => {
                if (scheduleSnap.data()) {
                  updateDoc(doc(db, 'schedule', `${year}Q${quarter}`), {
                    all: arrayUnion(date),
                  });
                  setDoc(doc(db, 'schedule', `${year}Q${quarter}`, 'friday', date), detail);
                } else {
                  setDoc(doc(db, 'schedule', `${year}Q${quarter}`), {
                    all: [date],
                  }).then(() => {
                    setDoc(doc(db, 'schedule', `${year}Q${quarter}`, 'friday', date), detail);
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
            updateDoc(doc(db, 'schedule', `${year}Q${quarter}`), {
              all: arrayRemove(date),
            }).then(() => getScheduledDates(year, quarter));
            deleteDoc(doc(db, 'schedule', `${year}Q${quarter}`, 'friday', date));
          }}>
          {showDate}
        </div>
      )}
    </div>
  );
}

export default Friday;
