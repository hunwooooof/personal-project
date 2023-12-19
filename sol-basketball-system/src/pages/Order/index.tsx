import { Tab, Tabs, Tooltip } from '@nextui-org/react';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import { Key, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingAnimation from '../../components/LoadingAnimation';
import PageTitle from '../../components/PageTitle';
import { useStore } from '../../store/store';
import { firestore } from '../../utils/firestore';
import { formatTimestampToTime, formatTimestampToYYYYslashMMslashDD } from '../../utils/helpers';

interface OrderType {
  id?: string;
  userRef?: DocumentReference<DocumentData, DocumentData>;
  kid: {
    docId?: string;
    firstName?: string;
    lastName?: string;
  };
  plan?: '01' | '08' | '10' | '12';
  method?: 'cash' | 'tran';
  status?: 'SUCCESS' | 'IN_PROCESS';
  timestamp: {
    seconds: number;
  };
  price?: 1000 | 7200 | 8250 | 9000;
}

function Order() {
  const navigate = useNavigate();
  const { setCurrentNav, user, isLogin, isLoading, setLoading } = useStore();
  const [tag, setTag] = useState('all');
  const [orders, setOrders] = useState<OrderType[]>([]);

  const getOrders = async (ordersRef: DocumentReference<DocumentData, DocumentData>[]) => {
    const orders = [];
    for (const orderRef of ordersRef) {
      const order = await firestore.getDocByRef(orderRef);
      if (order) orders.push(order as OrderType);
    }
    const sortByTimestamp = (a: OrderType, b: OrderType) => b.timestamp.seconds - a.timestamp.seconds;
    orders.sort(sortByTimestamp);
    setOrders(orders as OrderType[]);
    setLoading(false);
  };

  useEffect(() => {
    if (isLogin) {
      setCurrentNav('order');
    } else if (!isLogin) {
      navigate('/');
      setCurrentNav('schedules');
    }
    if (user.ordersRef) {
      getOrders(user.ordersRef);
    }
  }, [isLogin, user]);

  return (
    <div className='custom-main-container'>
      {isLoading && <LoadingAnimation />}
      <div className='flex flex-col md:flex-row justify-between items-center pt-6 lg:pt-14 pb-14'>
        <PageTitle title='Orders' />
        <div className='flex flex-col mr-0 md:mr-12 lg:mr-20'>
          <Tabs aria-label='status' selectedKey={tag} onSelectionChange={setTag as (key: Key) => string}>
            <Tab key='all' title='All' />
            <Tab key='inProcess' title='In Process' />
          </Tabs>
        </div>
      </div>
      <div className='mx-0 md:mx-12 lg:mx-20 min-h-[70vh] p-6 bg-white rounded-2xl'>
        <div className='flex mb-8 px-4 py-2 font-bold text-gray-500 bg-gray-100 rounded-lg'>
          <div className='flex-1 mr-6'>TIME</div>
          <div className='flex-1'>PLAN</div>
          <div className='flex-1'>NAME</div>
          <div className='flex-1'>METHOD</div>
          <div className='w-24'>STATUS</div>
        </div>
        <div className='flex flex-col gap-4 h-[60vh] overflow-y-auto'>
          {orders.length === 0 && <div className='text-center mt-[20vh] text-gray-400'>No orders to display.</div>}
          {orders.length > 0 &&
            orders.map((order) => {
              const { seconds } = order.timestamp;
              const showDate = formatTimestampToYYYYslashMMslashDD(seconds * 1000);
              const time = formatTimestampToTime(seconds * 1000);
              const timestamp = new Date(seconds * 1000);
              const sec = timestamp.getSeconds();
              const formattedSec = sec < 10 ? `0${sec}` : String(sec);
              const dateTime = `${showDate} ${time}:${formattedSec}`;
              if (tag === 'all' || (tag === 'inProcess' && order.status === 'IN_PROCESS')) {
                return (
                  <div
                    className={`flex items-center px-4 py-1 rounded-sm ${
                      order.status === 'IN_PROCESS' ? 'text-black' : 'text-gray-400'
                    }`}
                    key={seconds}>
                    <div className='flex-1 mr-6 rounded-lg truncate hover:overflow-visible'>{dateTime}</div>
                    <div className='flex-1'>
                      {order.plan === '01'
                        ? 'Single Session'
                        : order.plan === '08'
                          ? '8 Sessions'
                          : order.plan === '10'
                            ? '10 Sessions'
                            : '12 Sessions'}
                    </div>
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
            })}
          {orders.length !== 0 && tag === 'inProcess' && !orders.some((order) => order.status === 'IN_PROCESS') && (
            <div className='text-center mt-[20vh] text-gray-400'>No orders to display.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Order;
