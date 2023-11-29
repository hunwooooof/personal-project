import { DocumentData, DocumentReference } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { firestore } from '../../utils/firestore';

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
      if (order) orders.push(order);
    }
    setOrders(orders as OrderType[]);
  };

  useEffect(() => {
    if (isLogin && user.ordersRef) {
      getOrders(user.ordersRef);
    } else if (!isLogin) {
      navigate('/login');
      setCurrentNav('');
    }
  }, [isLogin, user]);

  return (
    <div className='custom-main-container pt-16'>
      <div className='w-10/12 mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <div className='custom-page-title'>Orders</div>
          <div className='flex gap-1 text-lg font-bold items-center text-gray-400 bg-white rounded-full p-2'>
            <div
              className={`w-16 text-center rounded-full p-1 cursor-pointer hover:bg-gray-100 ${
                tag === 'all' ? 'text-gray-800 bg-slate-100' : ''
              }`}
              onClick={() => {
                setTag('all');
              }}>
              All
            </div>
            <div
              className={`w-32 text-center rounded-full p-1 cursor-pointer hover:bg-gray-100 ${
                tag === 'inProcess' ? 'text-gray-800 bg-slate-100' : ''
              }`}
              onClick={() => {
                setTag('inProcess');
              }}>
              In Process
            </div>
          </div>
        </div>

        <div className='w-full min-h-[70vh] bg-white rounded-3xl p-8'>
          <div className='flex my-2 mb-8 font-bold text-slate-400 tracking-wider'>
            <div className='w-56 pl-4'>Time</div>
            <div className='w-44'>Plan</div>
            <div className='w-44'>Name</div>
            <div className='w-44'>Method</div>
            <div className='w-28'>Status</div>
          </div>
          <div className='flex flex-col gap-4 h-[60vh] overflow-y-auto'>
            {orders.length === 0 && <div>No Orders</div>}
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
                      className={`flex bg-slate-100 items-center px-2 py-1 rounded-full font-bold text-sm ${
                        order.status === 'IN_PROCESS' ? '' : 'text-slate-400'
                      }`}
                      key={seconds}>
                      <div className='w-56 pl-2'>{dateTime}</div>
                      <div className='w-44'>
                        {order.plan === '01'
                          ? 'Single Session'
                          : order.plan === '08'
                            ? '8 Sessions'
                            : order.plan === '10'
                              ? '10 Sessions'
                              : '12 Sessions'}
                      </div>
                      <div className='w-44'>{order.kid.firstName}</div>
                      <div className='w-44'>{order.method === 'cash' ? 'Cash' : 'Bank transfer'}</div>
                      <div className='w-28'>
                        {order.status === 'SUCCESS'
                          ? 'Success'
                          : order.status === 'IN_PROCESS'
                            ? 'In process'
                            : 'Failed'}
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

export default Order;
