import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { arrayUnion, db, doc, getDoc, serverTimestamp, setDoc, updateDoc } from '../../utils/firebase';

function Purchase() {
  const navigate = useNavigate();
  const { userRef, kids, isLogin, getUserProfile } = useStore();
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
    if (kids.length > 0) {
      setOrder({
        ...order,
        userRef: userRef,
        kid: {
          docId: kids[0].docId,
          firstName: kids[0].firstName,
          lastName: kids[0].lastName,
        },
      });
    }
    if (!isLogin) {
      navigate('/login');
    }
  }, [kids, isLogin]);

  const handleSubmitOrder = () => {
    console.log(order);
    const userConfirmed = confirm('Confirm Order?');
    if (userRef && userConfirmed) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = today.getMonth() + 1;
      const dd = today.getDate();
      const hour = today.getHours();
      const ms = today.getMilliseconds();
      const orderId = `${yyyy}${mm}${dd}${hour}${ms}${order.method}${order.plan}`;
      setDoc(doc(db, 'orders', orderId), { ...order, timestamp: serverTimestamp(), id: orderId });
      getDoc(doc(db, 'credits', order.kid.docId)).then((user) => {
        const data = user.data();
        if (!data) {
          setDoc(doc(db, 'credits', order.kid.docId), {
            all: 0,
            used: 0,
            docId: order.kid.docId,
            name: `${order.kid.firstName}-${order.kid.lastName}`,
          });
        }
      });
      updateDoc(userRef, {
        ordersRef: arrayUnion(doc(db, 'orders', orderId)),
      }).then(() => {
        setOrder(initialOrder);
        getUserProfile(userRef);
        navigate('/order');
      });
    }
  };

  const renderPlusCircle = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
        fill='currentColor'
        className='w-6 h-6 cursor-pointer text-gray-600 ml-3'
        onClick={() => navigate('/profile')}>
        <path
          fillRule='evenodd'
          d='M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z'
          clipRule='evenodd'
        />
      </svg>
    );
  };

  return (
    <div className='custom-main-container mt-28'>
      <div className='w-10/12 mx-auto'>
        <h3 className='mt-6 px-3 py-2 text-xl border-b border-gray-200 mb-8'>Purchase</h3>
        <div className='flex mb-8 items-center'>
          <h4 className='px-8'>Kid</h4>
          {kids.length > 0 && (
            <select
              name='kid'
              id='kid'
              className='ml-2 w-40 px-2 py-1 bg-gray-100 shadow-inner rounded-md'
              onChange={(e) => {
                const id = parseInt(e.target.value);
                setOrder({
                  ...order,
                  kid: {
                    docId: kids[id].docId,
                    firstName: kids[id].firstName,
                    lastName: kids[id].lastName,
                  },
                });
              }}>
              <option value='' disabled>
                Select a kid
              </option>

              {kids.map((kid, index) => (
                <option value={index} key={kid.docId}>
                  {kid.firstName}
                </option>
              ))}
            </select>
          )}
          {kids.length === 0 && <div className='text-gray-600 mx-2'>Add a kid</div>}
          {renderPlusCircle()}
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
                  className={`w-40 border-2 rounded-md cursor-pointer bg-gray-200 hover:border-teal-500 hover:bg-teal-500 ${
                    selectPlanId === plan.id ? 'bg-teal-500 border-teal-500' : ''
                  }`}
                  key={plan.id}>
                  <div className='text-center py-3'>{plan.title}</div>
                  <div className='text-center py-5 rounded-b-md bg-white text-3xl'>{plan.priceText}</div>
                </div>
              );
            })}
          </div>
        </div>
        <h3 className='px-3 py-2 text-xl border-b border-gray-200 mb-8'>Payment Method</h3>
        <div></div>
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
          className='ml-8 mt-8 bg-gray-100 rounded-lg w-28 text-center py-1 shadow-md hover:shadow-inner hover:bg-gray-200'
          onClick={handleSubmitOrder}>
          Confirm
        </button>
      </div>
    </div>
  );
}

export default Purchase;
