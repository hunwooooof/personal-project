import dateFormat from 'dateformat';
import { firestore } from '../../../utils/firestore';
import { CompleteOrderType } from '../../../utils/types';

interface PropsType {
  order: CompleteOrderType;
  tag: string;
}

function OrderRow({ order, tag }: PropsType) {
  const isTagInProcess = tag === 'inProcess';
  const orderTimestamp = order.timestamp.seconds * 1000;
  const dateTime = dateFormat(new Date(orderTimestamp), 'yyyy/mm/dd HH:MM:ss');

  const setOrderSuccess = (orderId: string, docId: string, plan: string) => {
    const credit = parseInt(plan);
    const confirmSetOrderSuccess = confirm('Set the order to SUCCESS?');
    if (confirmSetOrderSuccess) {
      firestore.updateDoc('orders', orderId, { status: 'SUCCESS' });
      firestore.updateDocIncrement('credits', docId, 'all', credit);
    }
  };

  const renderUncheckIcon = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        className='stroke-[1.5] stroke-current fill-none h-6 cursor-pointer text-slate-400 hover:text-green-500 hover:scale-125 duration-150'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
    );
  };

  const renderRemoveIcon = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        className='stroke-[1.5] stroke-current fill-none h-6 cursor-pointer text-slate-400 hover:text-red-500 hover:scale-125 duration-150'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
    );
  };

  const renderResetIcon = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        className='stroke-[1.5] stroke-current fill-none h-5 cursor-pointer text-slate-400 hover:text-black hover:scale-125 duration-150'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
        />
      </svg>
    );
  };

  const planMap = {
    '01': 'Single Session',
    '08': '8 Sessions',
    '10': '10 Sessions',
    '12': '12 Sessions',
  };

  const sessionType = planMap[order.plan];

  const renderButtonByStatus = (order: CompleteOrderType) => {
    if (order.status === 'IN_PROCESS') {
      return {
        hasButton: true,
        handleClickButton: () => setOrderSuccess(order.id, order.kid.docId, order.plan),
        icon: renderUncheckIcon(),
      };
    }
    if (order.status === 'SUCCESS') {
      return {
        hasButton: false,
      };
    }
    if (order.status === 'FAILED') {
      return {
        hasButton: true,
        handleClickButton: () => firestore.updateDoc('orders', order.id, { status: 'IN_PROCESS' }),
        icon: renderResetIcon(),
      };
    }
  };

  const isInProcessStatus = order.status === 'IN_PROCESS';
  const isSuccessStatus = order.status === 'SUCCESS';

  if (tag === 'all' || (isTagInProcess && isInProcessStatus)) {
    return (
      <div className={`flex items-center px-4 py-1 rounded-sm ${isInProcessStatus ? 'text-black' : 'text-gray-400'}`}>
        <div className='flex-1 mr-6'>{dateTime}</div>
        <div className='flex-1'>{sessionType}</div>
        <div className='flex-1'>{order.kid.firstName}</div>
        <div className='flex-1'>{order.method === 'cash' ? 'Cash' : 'Bank transfer'}</div>
        <div className='flex-1'>{isSuccessStatus ? 'Success' : isInProcessStatus ? 'In process' : 'Failed'}</div>
        <div className='flex w-20 items-center justify-center gap-4'>
          {renderButtonByStatus(order)?.hasButton && (
            <button id={order.id} onClick={renderButtonByStatus(order)?.handleClickButton}>
              {renderButtonByStatus(order)?.icon}
            </button>
          )}
          {isInProcessStatus && (
            <button id={order.id} onClick={() => firestore.updateDoc('orders', order.id, { status: 'FAILED' })}>
              {renderRemoveIcon()}
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default OrderRow;
