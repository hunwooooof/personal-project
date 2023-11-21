import { DocumentData, DocumentReference } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { collection, db, doc, getDocs, increment, updateDoc } from '../../../utils/firebase';

interface OrderType {
  id: string;
  userRef: DocumentReference<DocumentData, DocumentData>;
  kid: {
    docId: string;
    firstName: string;
    lastName: string;
  };
  plan: string;
  method: string;
  status: string;
  timestamp: {
    seconds: number;
  };
  price: number;
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
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    const ordersArray: OrderType[] = [];
    ordersSnapshot.forEach((doc) => ordersArray.push(doc.data()));
    setOrders(ordersArray);
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
          updateDoc(doc(db, 'orders', orderId), {
            status: 'SUCCESS',
          }).then(() => getOrders());
          updateDoc(doc(db, 'credits', docId), {
            all: increment(credit),
          });
        }}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='h-6 px-4 rounded-md cursor-pointer hover:bg-gray-100'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
    );
  };

  const renderChecked = (orderId: string, docId: string, plan: string) => {
    const credit = parseInt(plan);
    return (
      <svg
        id={orderId}
        onClick={() => {
          updateDoc(doc(db, 'orders', orderId), {
            status: 'IN_PROCESS',
          }).then(() => getOrders());
          updateDoc(doc(db, 'credits', docId), {
            all: increment(-credit),
          });
        }}
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='currentColor'
        className='h-6 px-4 text-green-500 rounded-md cursor-pointer hover:bg-gray-100'>
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
        <div className='flex gap-4 text-xl border-b border-gray-200'>
          <div
            className={` w-32 text-center rounded-t-md px-3 py-2 cursor-pointer hover:bg-gray-100 ${
              tag === 'all' ? 'shadow-inner bg-gray-200' : ''
            }`}
            onClick={() => {
              setTag('all');
            }}>
            All
          </div>
          <div
            className={` w-32 text-center rounded-t-md px-3 py-2 cursor-pointer hover:bg-gray-100 ${
              tag === 'inProcess' ? 'shadow-inner bg-gray-200' : ''
            }`}
            onClick={() => {
              setTag('inProcess');
            }}>
            In Process
          </div>
        </div>
        <div className='flex ml-8 mt-8 mb-4 px-2'>
          <div className='w-52'>Time</div>
          <div className='w-40'>Plan</div>
          <div className='w-36'>Name</div>
          <div className='w-36'>Method</div>
          <div className='w-36'>Status</div>
          <div className='w-16'>Confirm</div>
        </div>
        <div className=' w-11/12 flex flex-col gap-4 ml-8'>
          {orders.length === 0 && <div>No Orders</div>}
          {orders.length > 0 &&
            orders.map((order) => {
              const { seconds } = order.timestamp;
              const timestamp = new Date(seconds * 1000);
              const yyyy = timestamp.getFullYear();
              const mm = timestamp.getMonth() + 1;
              const dd = timestamp.getDate();
              const hour = timestamp.getHours();
              const min = timestamp.getMinutes();
              const sec = timestamp.getSeconds();
              const dateTime = `${yyyy}/${mm}/${dd} ${hour}:${min}:${sec}`;
              if (tag === 'all' || (tag === 'inProcess' && order.status === 'IN_PROCESS'))
                return (
                  <div className='bg-gray-100 flex items-center px-2 py-1 rounded-md  font-mono text-sm' key={seconds}>
                    <div className='w-52'>{dateTime}</div>
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
                      {order.status === 'SUCCESS' ? 'Success' : order.status === 'IN_PROCESS' ? 'In process' : 'Failed'}
                    </div>
                    <div className='w-16'>
                      {order.status === 'IN_PROCESS'
                        ? renderUncheck(order.id, order.kid.docId, order.plan)
                        : renderChecked(order.id, order.kid.docId, order.plan)}
                    </div>
                  </div>
                );
            })}
        </div>
      </div>
    </div>
  );
}

export default AdminOrder;
