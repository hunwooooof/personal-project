import { Tooltip } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { formatTimestampToTime, formatTimestampToYYYYslashMMslashDD } from '../../utils/helpers';
import { CompleteOrderType } from '../../utils/types';

interface PropsType {
  order: CompleteOrderType;
  tag: string;
}

function OrderRow({ order, tag }: PropsType) {
  const { seconds } = order.timestamp;
  const showDate = formatTimestampToYYYYslashMMslashDD(seconds * 1000);
  const time = formatTimestampToTime(seconds * 1000);
  const timestamp = new Date(seconds * 1000);
  const sec = timestamp.getSeconds();
  const formattedSec = sec < 10 ? `0${sec}` : String(sec);
  const dateTime = `${showDate} ${time}:${formattedSec}`;

  const planMap = {
    '01': 'Single Session',
    '08': '8 Sessions',
    '10': '10 Sessions',
    '12': '12 Sessions',
  };

  const sessionType = planMap[order.plan];

  if (tag === 'all' || (tag === 'inProcess' && order.status === 'IN_PROCESS')) {
    return (
      <div
        className={`flex items-center px-4 py-1 rounded-sm ${
          order.status === 'IN_PROCESS' ? 'text-black' : 'text-gray-400'
        }`}
        key={seconds}>
        <div className='flex-1 mr-6 rounded-lg truncate hover:overflow-visible'>{dateTime}</div>
        <div className='flex-1'>{sessionType}</div>
        <div className='flex-1'>{order.kid.firstName}</div>
        <div className='flex-1'>{order.method === 'cash' ? 'Cash' : 'Bank transfer'}</div>
        <div className='w-24 relative'>
          {order.status === 'SUCCESS' ? 'Success' : order.status === 'IN_PROCESS' ? 'In process' : 'Failed'}
          {order.status === 'IN_PROCESS' && (
            <Tooltip
              placement='bottom-end'
              className='w-60'
              content='Click to contact the coach for any inquiries or if you have already made a payment.'
              color='foreground'>
              <Link to='/message'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  className='absolute -right-1 top-[2px] w-5 h-5 stroke-1 stroke-black cursor-pointer'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z'
                  />
                </svg>
              </Link>
            </Tooltip>
          )}
        </div>
      </div>
    );
  }
}

export default OrderRow;
