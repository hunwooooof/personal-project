import { Tab, Tabs } from '@nextui-org/react';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import { Key, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '../../components/LoadingAnimation';
import PageTitle from '../../components/PageTitle';
import { useStore } from '../../store/store';
import { firestore } from '../../utils/firestore';
import { CompleteOrderType } from '../../utils/types';
import OrderRow from './OrderRow';

function Order() {
  const navigate = useNavigate();
  const { setCurrentNav, user, isLogin, isLoading, setLoading } = useStore();
  const [tag, setTag] = useState('all');
  const [orders, setOrders] = useState<CompleteOrderType[]>([]);

  const getOrders = async (ordersRef: DocumentReference<DocumentData, DocumentData>[]) => {
    const orders = [];
    for (const orderRef of ordersRef) {
      const order = await firestore.getDocByRef(orderRef);
      if (order) orders.push(order as CompleteOrderType);
    }
    const sortByTimestamp = (a: CompleteOrderType, b: CompleteOrderType) => b.timestamp.seconds - a.timestamp.seconds;
    orders.sort(sortByTimestamp);
    setOrders(orders as CompleteOrderType[]);
    setLoading(false);
  };

  useEffect(() => {
    if (isLogin) {
      setCurrentNav('order');
    }
    if (!isLogin) {
      navigate('/');
      setCurrentNav('schedules');
    }
    if (user.ordersRef) {
      getOrders(user.ordersRef);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [isLogin, user]);

  const areOrdersEmpty = orders.length === 0;
  const isTagInProcess = tag === 'inProcess';
  const hasOrdersInProcess = orders.some((order) => order.status === 'IN_PROCESS');

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
          {areOrdersEmpty && <div className='text-center mt-[20vh] text-gray-400'>No orders to display.</div>}
          {!areOrdersEmpty && orders.map((order) => <OrderRow order={order} tag={tag} key={order.id} />)}
          {!areOrdersEmpty && !hasOrdersInProcess && isTagInProcess && (
            <div className='text-center mt-[20vh] text-gray-400'>No orders to display.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Order;
