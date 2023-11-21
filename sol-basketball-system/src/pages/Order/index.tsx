import { useStore } from '../../store/store';

function Order() {
  const { user, userRef, kids, setUser, isLogin, getUserProfile, getKidsProfile } = useStore();
  console.log(kids);
  const orders = [
    {
      id: 'uyhiu215',
      date: '2023-07-30',
      time: '16:25',
      plan: '12 Sessions',
      name: 'Jolina',
      method: 'cash',
      status: 'success',
    },
    {
      id: 'oijk35lo',
      date: '2023-07-31',
      time: '21:37',
      plan: '8 Sessions',
      name: 'Grace',
      method: 'cash',
      status: 'in_process',
    },
    {
      id: 'oi12top',
      date: '2023-07-31',
      time: '21:37',
      plan: '8 Sessions',
      name: 'Grace',
      method: 'transfer',
      status: 'failed',
    },
  ];

  return (
    <div className='custom-main-container mt-28'>
      <div className='w-10/12 mx-auto'>
        <div className='flex gap-10 text-xl border-b border-gray-200'>
          <div className='rounded-md px-3 py-2 cursor-pointer hover:bg-gray-100'>History</div>
          <div className='rounded-md px-3 py-2 cursor-pointer hover:bg-gray-100'>In Process</div>
        </div>
        <div className='flex ml-8 mt-8 mb-4 px-2'>
          <div className='w-52'>Time</div>
          <div className='w-52'>Plan</div>
          <div className='w-44'>Name</div>
          <div className='w-44'>Method</div>
          <div className='w-44'>Status</div>
        </div>
        <div className='flex flex-col gap-4 ml-8'>
          {orders.map((order) => {
            return (
              <div className='bg-gray-100 flex px-2 py-1 rounded-md' key={order.id}>
                <div className='w-52'>
                  {order.date} {order.time}
                </div>
                <div className='w-52'>{order.plan}</div>
                <div className='w-44'>{order.name}</div>
                <div className='w-44'>{order.method}</div>
                <div className='w-44'>
                  {order.status === 'success' ? 'Success' : order.status === 'in_process' ? 'In process' : 'Failed'}
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
