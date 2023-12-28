import { Reset } from './Icon';

interface PropsType {
  quarter: number;
  setQuarter: React.Dispatch<React.SetStateAction<number>>;
  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;
  currentQuarter: number;
  currentYear: number;
}

export const getQuarterRange = (quarter: number) => {
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

function CalendarButton({ quarter, setQuarter, year, setYear, currentQuarter, currentYear }: PropsType) {
  const contentClass =
    'relative z-10 whitespace-nowrap mr-2 text-sm select-none text-center transition-colors text-zinc-800 font-semibold';

  const button = 'w-5 sm:w-6 h-5 sm:h-6 stroke-[1.5] text-zinc-700 cursor-pointer bg-white rounded-md shadow p-1';
  const arrowClass = `${button} ml-1 hover:scale-110 sm:hover:scale-125 duration-150 select-none`;

  const ArrowLeft = (className: string, callback: () => void) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      className={`fill-none stroke-current ${className}`}
      onClick={callback}>
      <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
    </svg>
  );

  const ArrowRight = (className: string, callback?: () => void) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      className={`fill-none stroke-current ${className}`}
      onClick={callback}>
      <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
    </svg>
  );

  return (
    <div className='flex sm:p-1 h-7 sm:h-9 gap-2 items-center flex-nowrap bg-zinc-100 rounded-medium mt-2 sm:mt-0 mr-0 md:mr-12 lg:mr-20'>
      <div className='flex items-center py-1 pl-3 justify-end w-32 sm:w-36'>
        <div className={contentClass}>{getQuarterRange(quarter)}</div>
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
      <div className='pr-2 pl-0 sm:pl-2 cursor-pointer text-zinc-700 hover:scale-110 sm:hover:scale-125 duration-150'>
        {Reset(button, () => {
          setQuarter(currentQuarter);
          setYear(currentYear);
        })}
      </div>
    </div>
  );
}

export default CalendarButton;
