import { ArrowLeft, ArrowRight, Reset } from './Icon';

interface PropsType {
  quarter: number;
  setQuarter: React.Dispatch<React.SetStateAction<number>>;
  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;
  currentQuarter: number;
  currentYear: number;
}

function CalendarButton({ quarter, setQuarter, year, setYear, currentQuarter, currentYear }: PropsType) {
  const months = () => {
    switch (quarter) {
      case 1:
        return 'Jan - Mar';
      case 2:
        return 'Apr - Jun';
      case 3:
        return 'Jul - Sep';
      case 4:
        return 'Oct - Dec';
      default:
        return 'Jan - Mar';
    }
  };

  const contentClass =
    'relative z-10 whitespace-nowrap mr-2 text-sm select-none text-center transition-colors text-zinc-500';

  const button = 'w-6 h-6 text-zinc-700 cursor-pointer bg-white rounded-md shadow p-1';
  const arrowClass = `${button} ml-1 hover:scale-125 duration-150 select-none`;

  return (
    <div className='flex p-1 h-9 gap-2 items-center flex-nowrap overflow-x-scroll scrollbar-hide bg-zinc-100 rounded-medium mr-0 md:mr-12 lg:mr-20'>
      <div className='flex items-center py-1 pl-3 justify-end w-36'>
        <div className={contentClass}>{months()}</div>
        {ArrowLeft(arrowClass, () => {
          if (quarter > 1) setQuarter((n) => n - 1);
          else setQuarter(4);
        })}
        {ArrowRight(arrowClass, () => {
          if (quarter < 4) setQuarter((n) => n + 1);
          else setQuarter(1);
        })}
      </div>
      <div className='flex items-center pl-2 py-1'>
        <div className={contentClass}>{year}</div>
        {ArrowLeft(arrowClass, () => setYear((n) => n - 1))}
        {ArrowRight(arrowClass, () => setYear((n) => n + 1))}
      </div>
      <div className='px-2 cursor-pointer text-zinc-700 hover:scale-125 duration-150'>
        {Reset(button, () => {
          setQuarter(currentQuarter);
          setYear(currentYear);
        })}
      </div>
    </div>
  );
}

export default CalendarButton;
