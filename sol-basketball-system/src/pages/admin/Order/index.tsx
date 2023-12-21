import { Tab, Tabs } from '@nextui-org/react';
import { Key, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../../components/PageTitle';
import { useStore } from '../../../store/store';
import { collection, db, firestore, onSnapshot } from '../../../utils/firestore';
import { formatTimestampToTime, formatTimestampToYYYYslashMMslashDD } from '../../../utils/helpers';
import { AdminOrderType } from '../../../utils/types';

function AdminOrder() {
  const navigate = useNavigate();
  const { user, isLogin, setCurrentNav } = useStore();
  useEffect(() => {
    if (user.role === 'user' || !isLogin) {
      navigate('/');
      setCurrentNav('schedules');
    } else if (isLogin) {
      setCurrentNav('admin-order');
    }
  }, [isLogin]);

  const [tag, setTag] = useState('all');
  const [orders, setOrders] = useState<AdminOrderType[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (docSnaps) => {
      const ordersArray: AdminOrderType[] = [];
      const sortByTimestamp = (a: AdminOrderType, b: AdminOrderType) => b.timestamp.seconds - a.timestamp.seconds;
      docSnaps.forEach((docSnap) => {
        const doc = docSnap.data();
        ordersArray.push(doc as AdminOrderType);
      });
      ordersArray.sort(sortByTimestamp);
      setOrders(ordersArray);
    });
    return () => unsubscribe();
  }, []);

  const renderUncheck = (orderId: string, docId: string, plan: string) => {
    const credit = parseInt(plan);
    return (
      <svg
        id={orderId}
        onClick={() => {
          const userConfirm = confirm('Set the order to SUCCESS?');
          if (userConfirm) {
            firestore.updateDoc('orders', orderId, { status: 'SUCCESS' });
            firestore.updateDocIncrement('credits', docId, 'all', credit);
          }
        }}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        className='stroke-[1.5] stroke-current h-6 cursor-pointer text-slate-400 hover:text-green-500 hover:scale-125 duration-150'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
    );
  };

  const renderRemoveIcon = (orderId: string) => {
    return (
      <svg
        id={orderId}
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        onClick={() => {
          firestore.updateDoc('orders', orderId, { status: 'FAILED' });
        }}
        className='stroke-[1.5] stroke-current h-6 cursor-pointer text-slate-400 hover:text-red-500 hover:scale-125 duration-150'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
    );
  };

  const renderReset = (orderId: string) => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        id={orderId}
        viewBox='0 0 24 24'
        onClick={() => {
          firestore.updateDoc('orders', orderId, { status: 'IN_PROCESS' });
        }}
        className='stroke-[1.5] stroke-current h-5 cursor-pointer text-slate-400 hover:text-black hover:scale-125 duration-150'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
        />
      </svg>
    );
  };

  return (
    <div className='custom-main-container'>
      <div className='flex flex-col md:flex-row justify-between items-center pt-6 lg:pt-14 pb-14'>
        <PageTitle title='Orders' />
        <div className='flex flex-col mr-0 md:mr-12 lg:mr-20 h-[36px]'>
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
          <div className='flex-1'>STATUS</div>
          <div className='w-20'>CONFIRM</div>
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
              if (tag === 'all' || (tag === 'inProcess' && order.status === 'IN_PROCESS'))
                return (
                  <div
                    className={`flex items-center px-4 py-1 rounded-sm ${
                      order.status === 'IN_PROCESS' ? 'text-black' : 'text-gray-400'
                    }`}
                    key={seconds}>
                    <div className='flex-1 mr-6'>{dateTime}</div>
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
                    <div className='flex-1'>
                      {order.status === 'SUCCESS' ? 'Success' : order.status === 'IN_PROCESS' ? 'In process' : 'Failed'}
                    </div>
                    <div className='flex w-20 items-center justify-center gap-4'>
                      {order.status === 'IN_PROCESS'
                        ? renderUncheck(order.id, order.kid.docId, order.plan)
                        : order.status === 'SUCCESS'
                          ? ''
                          : renderReset(order.id)}
                      {order.status === 'IN_PROCESS' && renderRemoveIcon(order.id)}
                    </div>
                  </div>
                );
            })}
          {orders.length !== 0 && tag === 'inProcess' && !orders.some((order) => order.status === 'IN_PROCESS') && (
            <div className='text-center mt-[20vh] text-gray-400'>No orders to display.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrder;
