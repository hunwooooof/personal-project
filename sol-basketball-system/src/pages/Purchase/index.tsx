import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from '../../components/Icon';
import { useStore } from '../../store/store';
import email from '../../utils/emailJS';
import { db, doc, firestore, serverTimestamp } from '../../utils/firestore';

function Purchase() {
  const navigate = useNavigate();
  const { user, userRef, kids, isLogin, getUserProfile } = useStore();
  const [selectPlanId, setSelectPlanId] = useState('01');
  const plans = [
    { id: '01', title: 'Single Session', price: 1000, priceText: '$ 1,000' },
    { id: '08', title: '8 Sessions', price: 7200, priceText: '$ 7,200' },
    { id: '10', title: '10 Sessions', price: 8250, priceText: '$ 8,250' },
    { id: '12', title: '12 Sessions', price: 9000, priceText: '$ 9,000' },
  ];
  const initialOrder = {
    userRef,
    kid: {
      docId: '',
      firstName: '',
      lastName: '',
    },
    plan: '01',
    method: 'cash',
    status: 'IN_PROCESS',
    timestamp: '',
    price: 1000,
  };
  const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
    }
  }, [kids, isLogin]);

  const handleSubmitOrder = () => {
    const userConfirmed = confirm('Confirm Order?');
    if (userRef && userConfirmed) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = today.getMonth() + 1;
      const dd = today.getDate();
      const hour = today.getHours();
      const min = today.getMinutes();
      const ms = today.getMilliseconds();
      const orderId = `${yyyy}${mm}${dd}${hour}${ms}${order.method}${order.plan}`;
      firestore.setDoc('orders', orderId, { ...order, timestamp: serverTimestamp(), id: orderId });
      firestore.getDoc('credits', order.kid.docId).then((user) => {
        if (!user) {
          firestore.setDoc('credits', order.kid.docId, {
            all: 0,
            used: 0,
            docId: order.kid.docId,
            name: `${order.kid.firstName}-${order.kid.lastName}`,
          });
        }
      });
      firestore.updateDocArrayUnionByRef(userRef, 'ordersRef', doc(db, 'orders', orderId)).then(() => {
        setOrder(initialOrder);
        getUserProfile(userRef);
        navigate('/order');
      });
      email.notifyNewOrder(
        { ...order, time: `${yyyy}/${mm}/${dd} ${hour}:${min}` },
        orderId,
        user as { displayName: string },
      );
      email.orderCreate(
        { ...order, time: `${yyyy}/${mm}/${dd} ${hour}:${min}` },
        orderId,
        user as { displayName: string; email: string },
      );
    }
  };

  return (
    <div className='custom-main-container pt-16'>
      <div className='w-10/12 mx-auto'>
        <div className='custom-page-title mb-6'>Purchase</div>
        <div className='bg-white rounded-3xl p-10'>
          <div className='flex mb-8 items-center'>
            <label className='px-8'>Kid</label>
            {kids.length > 0 && (
              <select
                name='kid'
                id='kid'
                className='ml-2 w-40 px-2 py-1 bg-slate-100 rounded-full'
                onChange={(e) => {
                  if (e.target.value === '-1') {
                    setOrder({
                      ...order,
                      kid: {
                        docId: '',
                        firstName: '',
                        lastName: '',
                      },
                    });
                  } else {
                    const id = parseInt(e.target.value);
                    setOrder({
                      ...order,
                      kid: {
                        docId: kids[id].docId,
                        firstName: kids[id].firstName,
                        lastName: kids[id].lastName,
                      },
                    });
                  }
                }}>
                <option value='-1'>Select a kid</option>
                {kids.map((kid, index) => (
                  <option value={index} key={kid.docId}>
                    {kid.firstName}
                  </option>
                ))}
              </select>
            )}
            {kids.length === 0 && <div className='text-gray-600 mx-2'>Add a kid</div>}
            {PlusCircle('w-6 h-6 cursor-pointer text-gray-500 ml-3', () => navigate('/profile'))}
          </div>
          <div className='flex mb-16'>
            <h4 className='px-8'>Plan</h4>
            <div className='flex justify-center gap-8'>
              {plans.map((plan) => {
                return (
                  <div
                    onClick={() => {
                      setSelectPlanId(plan.id);
                      setOrder({ ...order, price: plan.price, plan: plan.id });
                    }}
                    className={`w-40 border rounded-xl cursor-pointer bg-slate-100 hover:border-slate-400 hover:bg-slate-400 ${
                      selectPlanId === plan.id ? 'bg-slate-400' : ''
                    }`}
                    key={plan.id}>
                    <div className='text-center py-3 font-bold'>{plan.title}</div>
                    <div className='text-center py-5 rounded-b-xl bg-white text-3xl'>{plan.priceText}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className='text-xl text-gray-600 font-bold mb-8'>Payment Method</div>
          <div id='payment-selection' className='pl-8 flex flex-col gap-3'>
            <div className='flex items-center'>
              <input
                type='radio'
                name='payment'
                className='mr-3'
                defaultChecked
                onClick={() => setOrder({ ...order, method: 'cash' })}
              />
              By Cash
            </div>
            <div className='flex items-center'>
              <input
                type='radio'
                name='payment'
                className='mr-3'
                onClick={() => setOrder({ ...order, method: 'tran' })}
              />
              Online Banking Transfer
              <span>Account: (808) 0624-979-171404</span>
            </div>
          </div>
          <button
            type='submit'
            className='ml-8 mt-8 bg-slate-500 text-white rounded-full w-28 text-center py-1 hover:bg-slate-800 disabled:bg-gray-200'
            disabled={order.kid.docId.length === 0}
            onClick={handleSubmitOrder}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default Purchase;
