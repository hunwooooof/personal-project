import { Tab, Tabs } from '@nextui-org/react';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import { Key, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { setCurrentNav, user, isLogin } = useStore();
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
          <div className=''>STATUS</div>
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
                    <div className=''>
                      {order.status === 'SUCCESS' ? 'Success' : order.status === 'IN_PROCESS' ? 'In process' : 'Failed'}
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
