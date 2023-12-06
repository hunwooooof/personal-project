import { DocumentData, DocumentReference } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { firestore } from '../../../utils/firestore';

interface OrderType {
  id: string;
  userRef: DocumentReference<DocumentData, DocumentData>;
  kid: {
    docId: string;
    firstName: string;
    lastName: string;
  };
  plan: '01' | '08' | '10' | '12';
  method: 'cash' | 'tran';
  status: 'SUCCESS' | 'IN_PROCESS' | 'FAILED';
  timestamp: {
    seconds: number;
  };
  price: 1000 | 7200 | 8250 | 9000;
}

function AdminOrder() {
  const navigate = useNavigate();
  const { user, isLogin } = useStore();
  useEffect(() => {
    if (user.role === 'user' || !isLogin) {
      navigate('/');
    }
  }, [isLogin]);

  const [tag, setTag] = useState('all');
  const [orders, setOrders] = useState<OrderType[]>([]);
  async function getOrders() {
    const ordersArray = (await firestore.getDocs('orders')) as OrderType[];
    const sortByTimestamp = (a: OrderType, b: OrderType) => b.timestamp.seconds - a.timestamp.seconds;
    if (ordersArray) {
      ordersArray.sort(sortByTimestamp);
      setOrders(ordersArray as OrderType[]);
    }
  }
  useEffect(() => {
    getOrders();
  }, [isLogin]);

  const renderUncheck = (orderId: string, docId: string, plan: string) => {
    const credit = parseInt(plan);
    return (
      <svg
        id={orderId}
        onClick={() => {
          const userConfirm = confirm('Set the order to SUCCESS?');
          if (userConfirm) {
            firestore.updateDoc('orders', orderId, { status: 'SUCCESS' }).then(() => getOrders());
            firestore.updateDocIncrement('credits', docId, 'all', credit);
          }
        }}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='h-6 cursor-pointer text-slate-400 hover:text-green-800'>
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
        strokeWidth={1.5}
        stroke='currentColor'
        fill='none'
        onClick={() => {
          firestore.updateDoc('orders', orderId, { status: 'FAILED' }).then(() => getOrders());
        }}
        className='h-6 cursor-pointer text-slate-400 hover:text-red-800'>
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
        strokeWidth={1.5}
        stroke='currentColor'
        onClick={() => {
          firestore.updateDoc('orders', orderId, { status: 'IN_PROCESS' }).then(() => getOrders());
        }}
        className='h-6 cursor-pointer hover:text-black'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
        />
      </svg>
    );
  };

  return (
    <div className='custom-main-container pt-16'>
      <div className='w-10/12 mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <div className='custom-page-title'>Orders</div>
          <div className='flex border border-gray-600 rounded-sm text-lg font-bold items-center text-gray-400'>
            <div
              className={`w-16 text-center p-1 cursor-pointer text-white ${
                tag === 'all' ? ' bg-slate-600 hover:bg-slate-600' : 'hover:bg-slate-700'
              }`}
              onClick={() => {
                setTag('all');
              }}>
              All
            </div>
            <div
              className={`w-32 text-center p-1 cursor-pointer text-white ${
                tag === 'inProcess' ? ' bg-slate-600 hover:bg-slate-600' : 'hover:bg-slate-700'
              }`}
              onClick={() => {
                setTag('inProcess');
              }}>
              In Process
            </div>
          </div>
        </div>

        <div className='w-full min-h-[70vh] p-8'>
          <div className='flex my-2 mb-8 font-bold text-slate-400 tracking-wider'>
            <div className='w-52 pl-4'>Time</div>
            <div className='w-40 pl-2'>Plan</div>
            <div className='w-36 pl-2'>Name</div>
            <div className='w-36 pl-2'>Method</div>
            <div className='w-36 pl-2'>Status</div>
            <div className='w-16 pl-2'>Confirm</div>
          </div>
          <div className='flex flex-col gap-4 h-[60vh] overflow-y-auto'>
            {orders.length === 0 && <div className='pt-10 text-2xl text-center text-gray-400'>No Orders</div>}
            {orders.length > 0 &&
              orders.map((order) => {
                const { seconds } = order.timestamp;
                const timestamp = new Date(seconds * 1000);
                const yyyy = timestamp.getFullYear();
                const mm = timestamp.getMonth() + 1;
                const formattedMm = mm < 10 ? `0${mm}` : String(mm);
                const dd = timestamp.getDate();
                const formattedDd = dd < 10 ? `0${dd}` : String(dd);
                const hour = timestamp.getHours();
                const formattedHour = hour < 10 ? `0${hour}` : String(hour);
                const min = timestamp.getMinutes();
                const formattedMin = min < 10 ? `0${min}` : String(min);
                const sec = timestamp.getSeconds();
                const formattedSec = sec < 10 ? `0${sec}` : String(sec);
                const dateTime = `${yyyy}/${formattedMm}/${formattedDd} ${formattedHour}:${formattedMin}:${formattedSec}`;
                if (tag === 'all' || (tag === 'inProcess' && order.status === 'IN_PROCESS'))
                  return (
                    <div
                      className={`flex border border-gray-600 items-center px-2 py-1 rounded-sm font-bold text-sm ${
                        order.status === 'IN_PROCESS' ? '' : 'text-slate-400'
                      }`}
                      key={seconds}>
                      <div className='w-52 pl-2'>{dateTime}</div>
                      <div className='w-40'>
                        {order.plan === '01'
                          ? 'Single Session'
                          : order.plan === '08'
                            ? '8 Sessions'
                            : order.plan === '10'
                              ? '10 Sessions'
                              : '12 Sessions'}
                      </div>
                      <div className='w-36'>{order.kid.firstName}</div>
                      <div className='w-36'>{order.method === 'cash' ? 'Cash' : 'Bank transfer'}</div>
                      <div className='w-36'>
                        {order.status === 'SUCCESS'
                          ? 'Success'
                          : order.status === 'IN_PROCESS'
                            ? 'In process'
                            : 'Failed'}
                      </div>
                      <div className='w-16 flex items-center gap-4'>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrder;
