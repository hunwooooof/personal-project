import { DocumentData, DocumentReference } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { getDoc } from '../../utils/firebase';

interface OrderType {
  id?: string;
  userRef?: DocumentReference<DocumentData, DocumentData>;
  kid: {
    docId?: string;
    firstName?: string;
    lastName?: string;
  };
  plan?: string;
  method?: string;
  status?: string;
  timestamp: {
    seconds: number;
  };
  price?: number;
}

function Order() {
  const navigate = useNavigate();
  const { user, isLogin } = useStore();
  const [tag, setTag] = useState('all');
  const [orders, setOrders] = useState<OrderType[]>([]);

  const getOrders = async (ordersRef: DocumentReference<DocumentData, DocumentData>[]) => {
    const orders = [];
    for (const orderRef of ordersRef) {
      const orderSnap = await getDoc(orderRef);
      if (orderSnap.exists()) {
        const order = orderSnap.data();
        orders.push(order);
      }
    }
    setOrders(orders as OrderType[]);
  };

  useEffect(() => {
    if (isLogin && user.ordersRef) {
      getOrders(user.ordersRef);
    } else if (!isLogin) {
      navigate('/login');
    }
  }, [isLogin, user]);

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
          <div className='w-56'>Time</div>
          <div className='w-44'>Plan</div>
          <div className='w-44'>Name</div>
          <div className='w-44'>Method</div>
          <div className='w-44'>Status</div>
        </div>
        <div className='flex flex-col gap-4 ml-8'>
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
                  <div className='bg-gray-100 flex px-2 py-1 rounded-md  font-mono text-sm' key={seconds}>
                    <div className='w-56'>{dateTime}</div>
                    <div className='w-44'>
                      {order.plan === '01'
                        ? 'Single Session'
                        : order.plan === '08'
                          ? '8 Sessions'
                          : order.plan === '10'
                            ? '10 Sessions'
                            : '12 Sessions'}
                    </div>
                    <div className='w-44 '>{order.kid.firstName}</div>
                    <div className='w-44 '>{order.method === 'cash' ? 'Cash' : 'Bank transfer'}</div>
                    <div className='w-44 '>
                      {order.status === 'SUCCESS' ? 'Success' : order.status === 'IN_PROCESS' ? 'In process' : 'Failed'}
                    </div>
                  </div>
                );
            })}
        </div>
      </div>
    </div>
  );
}

export default Order;
