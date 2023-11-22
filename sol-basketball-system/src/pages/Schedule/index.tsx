function Schedule() {
  return (
    <div className='custom-main-container mt-28'>
      <div className='w-10/12 flex mx-auto'>
        <div className='w-full mr-5'>
          <div className='bg-teal-600 flex rounded-lg text-white font-bold font-serif tracking-wider py-2'>
            <div className='flex flex-col justify-center items-center w-4/12'>
              <div>Friday</div>
              <div>19:00-21:00</div>
            </div>
            <div className='w-4/12 flex justify-center items-center'>Saturday</div>
            <div className='flex flex-col justify-center items-center w-4/12'>
              <div>Sunday</div>
              <div>16:30-18:30</div>
            </div>
          </div>
        </div>
        {true && (
          <div className='w-80 p-6 border rounded-lg'>
            <div className='border-b'>Team Practice</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Schedule;
