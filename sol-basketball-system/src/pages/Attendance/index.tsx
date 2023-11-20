import { getDoc } from '../../utils/firebase';

import { useEffect } from 'react';

function Attendance() {
  const dates = [
    '2023-10-02',
    '2023-10-03',
    '2023-10-04',
    '2023-10-05',
    '2023-10-06',
    '2023-10-07',
    '2023-10-08',
    '2023-10-09',
    '2023-10-10',
    '2023-10-11',
    '2023-10-12',
    '2023-10-13',
  ];
  const studentsAttend = [
    {
      name: 'Grace-Yu',
      showUpDate: ['2023-10-02', '2023-10-03', '2023-10-04'],
    },
    {
      name: 'Jolina-Liang',
      showUpDate: [
        '2023-10-02',
        '2023-10-03',
        '2023-10-05',
        '2023-10-06',
        '2023-10-08',
        '2023-10-10',
        '2023-10-11',
        '2023-10-13',
      ],
    },
  ];
  const arrowClass = 'w-6 h-6 p-1 bg-amber-300 ml-2 rounded-md cursor-pointer shadow-md hover:bg-amber-200';

  useEffect(() => {}, []);

  const renderArrowUp = () => {
    return (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className={arrowClass}>
        <path
          fillRule='evenodd'
          d='M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z'
          clipRule='evenodd'
        />
      </svg>
    );
  };

  const renderArrowDown = () => {
    return (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className={arrowClass}>
        <path
          fillRule='evenodd'
          d='M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z'
          clipRule='evenodd'
        />
      </svg>
    );
  };

  const renderUncheck = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='w-6 h-6'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
    );
  };
  const renderChecked = () => {
    return (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
        <path
          fillRule='evenodd'
          d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z'
          clipRule='evenodd'
        />
      </svg>
    );
  };

  return (
    <div className='custom-main-container mt-28'>
      <div className='w-10/12 mx-auto'>
        <div className='mt-6  px-3 py-2 text-xl border-b border-gray-200 mb-5'>Attendance</div>
        <div className='flex justify-end gap-5'>
          <div className='flex bg-gray-100 px-3 py-2 rounded-lg shadow-inner'>
            <div className='mr-2 text-gray-800 font-medium'>Oct － Dec</div>
            {renderArrowUp()}
            {renderArrowDown()}
          </div>
          <div className='flex bg-gray-100 px-3 py-2 rounded-lg shadow-inner'>
            <div className='mr-2 text-gray-800 font-medium'>2023</div>
            {renderArrowUp()}
            {renderArrowDown()}
          </div>
        </div>
        <div className='mt-5 pr-16 pl-40 flex overflow-x-auto pb-4'>
          {dates.map((date) => {
            const formateDate = date.substring(5).replace('-', '/');
            return (
              <div className='bg-yellow-500 font-bold text-white shrink-0 w-16 text-sm tracking-wider text-center border-2 border-white rounded-md py-1'>
                {formateDate}
              </div>
            );
          })}
        </div>
        {studentsAttend.map((student) => {
          return (
            <div className='flex items-center'>
              <div className='w-40 bg-gray-50 font-bold tracking-wider border-2 border-white rounded-md py-1 px-2'>
                {student.name.replace('-', ' ')}
              </div>
              <div className='flex'>
                {dates.map((date) => {
                  return (
                    <div
                      key={date}
                      className='shrink-0 w-16 text-sm tracking-wider mx-auto border-2 border-white rounded-md py-1 flex justify-center'>
                      {student.showUpDate.includes(date) ? renderUncheck() : renderChecked()}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Attendance;
