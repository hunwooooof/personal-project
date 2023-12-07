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
  const arrowClass =
    'w-4 sm:w-5 w-4 sm:h-5 ml-1 text-gray-300 cursor-pointer hover:text-white hover:scale-125 duration-150 select-none';

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

  return (
    <div className='flex items-center rounded-sm border border-gray-600 mr-0 md:mr-12 lg:mr-20'>
      <div className='flex items-center px-2 py-1 w-36 sm:w-40 justify-end border-r border-gray-600'>
        <div className='text-gray-300 font-medium select-none text-center w-24 text-sm sm:text-base'>{months()}</div>
        {ArrowLeft(arrowClass, () => {
          if (quarter > 1) setQuarter((n) => n - 1);
          else setQuarter(4);
        })}
        {ArrowRight(arrowClass, () => {
          if (quarter < 4) setQuarter((n) => n + 1);
          else setQuarter(1);
        })}
      </div>
      <div className='flex items-center border-r border-gray-600 pr-2 pl-4 py-1'>
        <div className='text-gray-300 font-medium select-none text-sm sm:text-base'>{year}</div>
        {ArrowLeft(arrowClass, () => setYear((n) => n - 1))}
        {ArrowRight(arrowClass, () => setYear((n) => n + 1))}
      </div>
      <div className='px-2 cursor-pointer text-gray-300 hover:text-white hover:scale-125 duration-150'>
        {Reset('w-5 h-5', () => {
          setQuarter(currentQuarter);
          setYear(currentYear);
        })}
      </div>
    </div>
  );
}

export default CalendarButton;
