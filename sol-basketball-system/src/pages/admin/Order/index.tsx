import { Tab, Tabs } from '@nextui-org/react';
import { Key, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../../components/PageTitle';
import { useStore } from '../../../store/store';
import { DocumentData, QuerySnapshot, collection, db, onSnapshot } from '../../../utils/firestore';
import { CompleteOrderType } from '../../../utils/types';
import OrderRow from './OrderRow';

function AdminOrder() {
  const navigate = useNavigate();
  const { user, isLogin, setCurrentNav } = useStore();

  const checkUserRoleAndSetNavigation = () => {
    if (user.role === 'user' || !isLogin) {
      navigate('/');
      setCurrentNav('schedules');
    }
    if (user.role === 'admin') {
      setCurrentNav('admin-order');
    }
  };
  useEffect(checkUserRoleAndSetNavigation, [isLogin]);

  const [tag, setTag] = useState('all');
  const [orders, setOrders] = useState<CompleteOrderType[]>([]);

  const handleOrdersSnapshot = (docSnaps: QuerySnapshot<DocumentData, DocumentData>) => {
    const ordersArray: CompleteOrderType[] = [];
    const sortByTimestamp = (a: CompleteOrderType, b: CompleteOrderType) => b.timestamp.seconds - a.timestamp.seconds;
    docSnaps.forEach((docSnap) => {
      const doc = docSnap.data();
      ordersArray.push(doc as CompleteOrderType);
    });
    ordersArray.sort(sortByTimestamp);
    setOrders(ordersArray);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), handleOrdersSnapshot);
    return () => unsubscribe();
  }, []);

  const areOrdersEmpty = orders.length === 0;
  const isTagInProcess = tag === 'inProcess';
  const hasOrdersInProcess = orders.some((order) => order.status === 'IN_PROCESS');

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

export default AdminOrder;
