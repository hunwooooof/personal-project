import {
  Avatar,
  Button,
  Card,
  Divider,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Tooltip,
} from '@nextui-org/react';
import dateFormat from 'dateformat';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from '../../components/Icon';
import PageTitle from '../../components/PageTitle';
import { useStore } from '../../store/store';
import email from '../../utils/emailJS';
import { db, doc, firestore, serverTimestamp } from '../../utils/firestore';

function Purchase() {
  const navigate = useNavigate();
  const { setCurrentNav, user, userRef, kids, isLogin, getUserProfile } = useStore();
  const [confirmedEmail, setConfirmedEmail] = useState(user.email as string);
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
      navigate('/');
      setCurrentNav('schedules');
    }
    if (isLogin) {
      setCurrentNav('purchase');
    }
  }, [kids, isLogin]);

  const handleSubmitOrder = () => {
    const userConfirmed = confirm('Confirm Order?');
    if (userRef && userConfirmed) {
      const now = new Date();
      const currentDateTime = dateFormat(now, 'YYYYMMDDHHMMss');
      const showDate = dateFormat(now, 'YYYY/MM/DD');
      const time = dateFormat(now, 'HH:MM:ss');

      const orderId = `${currentDateTime}${order.method}${order.plan}`;
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
        setCurrentNav('order');
        toast.success('Order placed successfully');
      });
      email.notifyNewOrder({ ...order, time: `${showDate} ${time}` }, orderId, user.displayName as string);
      email.orderCreate({ ...order, time: `${showDate} ${time}` }, orderId, user.displayName as string, confirmedEmail);
    }
  };

  const isInvalidEmail = !/^[A-Za-z0-9._%+-]+@[^@\s]+\.[^@\s]+$/.test(confirmedEmail) && confirmedEmail.length > 0;

  return (
    <div className='custom-main-container pt-6 lg:pt-14'>
      <PageTitle title='Purchase' />
      <div className='mx-0 md:mx-12 lg:mx-20 py-8'>
        <div className='flex mb-8'>
          <h4 className='w-28'>Kid</h4>
          <div className='w-60'>
            <Select
              aria-label='Kid'
              className='max-w-md text-black'
              placeholder='Select a kid'
              id='type'
              size='sm'
              onChange={(e) => {
                if (e.target.value === '') {
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
              {kids.map((kid, index) => (
                <SelectItem
                  key={index}
                  startContent={<Avatar alt={kid.firstName} className='w-6 h-6' src={kid.photoURL} />}>
                  {kid.firstName}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Tooltip showArrow={true} content='Add a kid' placement='right'>
            {PlusCircle('w-6 h-6 cursor-pointer text-gray-400 ml-3', () => navigate('/profile'))}
          </Tooltip>
        </div>
        <div className='flex mb-16'>
          <h4 className='w-28'>Plan</h4>
          <div className='w-[736px] overflow-x-auto flex flex-wrap justify-center gap-8'>
            {plans.map((plan) => {
              return (
                <Card
                  isHoverable={true}
                  isPressable={true}
                  onPress={() => {
                    setSelectPlanId(plan.id);
                    setOrder({ ...order, price: plan.price, plan: plan.id });
                  }}
                  className={`w-40 cursor-pointer ${
                    selectPlanId === plan.id && 'border-4 border-blue-500 hover:border-blue-500'
                  }`}
                  key={plan.id}>
                  <div className='w-full text-center py-3 font-bold'>{plan.title}</div>
                  <Divider />
                  <div className='w-full text-center py-5 rounded-b-sm text-3xl'>{plan.priceText}</div>
                </Card>
              );
            })}
          </div>
        </div>
        <div className='flex mb-16'>
          <h4 className='w-28'>Email</h4>
          <Input
            aria-label='email'
            type='email'
            value={confirmedEmail}
            size='sm'
            onChange={(e) => setConfirmedEmail(e.target.value)}
            className='w-80'
            isInvalid={isInvalidEmail}
            color={isInvalidEmail ? 'danger' : 'default'}
            errorMessage={isInvalidEmail && 'Please enter a valid email.'}
            description='Order details will be sent to your email address. Please confirm that your email address is correct.'
          />
        </div>
        <div className='flex mb-16'>
          <h4 className='w-28'>Payment</h4>
          <RadioGroup
            aria-label='Payment'
            defaultValue='cash'
            onChange={(e) => setOrder({ ...order, method: e.target.value })}>
            <Radio
              value='cash'
              className='mb-2'
              description='When selecting cash payment, you can conveniently hand the cash to the coach during the class.'>
              <span className='text-white'>By Cash</span>
            </Radio>
            <Radio value='tran' description='Account: (808) 0624-979-171404'>
              <span className='text-white'>Online Banking Transfer</span>
            </Radio>
          </RadioGroup>
        </div>
        <Button isDisabled={order.kid.docId.length === 0 || isInvalidEmail} color='primary' onClick={handleSubmitOrder}>
          Confirm
        </Button>
      </div>
    </div>
  );
}

export default Purchase;
