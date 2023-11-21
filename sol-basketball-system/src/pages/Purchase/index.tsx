function Purchase() {
  const plans = [
    { id: '12s', title: '12 Sessions', price: '$ 9,000' },
    { id: '10s', title: '10 Sessions', price: '$ 8,250' },
    { id: '8s', title: '8 Sessions', price: '$ 7,200' },
    { id: '1s', title: 'Single Session', price: '$ 1,000' },
  ];
  return (
    <div className='custom-main-container mt-28'>
      <div className='w-10/12 mx-auto'>
        <h3 className='mt-6 px-3 py-2 text-xl border-b border-gray-200 mb-8'>Purchase</h3>
        <div className='flex mb-8 items-center'>
          <h4 className='px-8'>Kid</h4>
          <select name='kid' id='kid' className='ml-2 w-40 px-2 py-1 bg-gray-100 shadow-inner rounded-md'>
            <option value='' disabled>
              Select a kid
            </option>
            <option value=''>Jolina</option>
            <option value=''>Grace</option>
          </select>
        </div>
        <div className='flex mb-16'>
          <h4 className='px-8'>Plan</h4>
          <div className='flex justify-center gap-8'>
            {plans.map((plan) => {
              return (
                <div
                  className='w-40 border rounded-md cursor-pointer bg-gray-200 hover:border-teal-500 hover:bg-teal-500'
                  key={plan.id}>
                  <div className='text-center py-3'>{plan.title}</div>
                  <div className='text-center py-5 rounded-b-md bg-white text-3xl'>{plan.price}</div>
                </div>
              );
            })}
          </div>
        </div>
        <h3 className='px-3 py-2 text-xl border-b border-gray-200 mb-8'>Payment Method</h3>
        <div></div>
        <div id='payment-selection' className='pl-8 flex flex-col gap-3'>
          <div className='flex items-center'>
            <input type='radio' name='payment' id='cash' className='mr-3' />
            By Cash
          </div>
          <div className='flex items-center'>
            <input type='radio' name='payment' id='transfer' className='mr-3' />
            Online Banking Transfer
            <span>Account: (808) 0624-979-171404</span>
          </div>
        </div>
        <button
          type='submit'
          className='ml-8 mt-8 bg-gray-100 rounded-lg w-28 text-center py-1 shadow-md hover:shadow-inner hover:bg-gray-200'>
          Confirm
        </button>
      </div>
    </div>
  );
}

export default Purchase;
