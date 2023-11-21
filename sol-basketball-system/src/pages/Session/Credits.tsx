interface PropsType {
  currentKid: string;
}

function Credits({ currentKid }: PropsType) {
  return (
    <div>
      <div className='mt-6  px-3 py-2 text-xl border-b border-gray-200'>Credits</div>
      <div className='flex justify-center gap-11 py-8'>
        <div className='flex flex-col w-52 justify-center items-center'>
          <div className='text-5xl mb-3'>24</div>
          <div className='text-gray-600'>Session Credits Purchased</div>
        </div>
        <div className='flex flex-col w-52 justify-center items-center'>
          <div className='text-5xl mb-3'>17</div>
          <div className='text-gray-600'>Credits Used</div>
        </div>
        <div className='flex flex-col w-52 justify-center items-center'>
          <div className='text-5xl mb-3'>7</div>
          <div className='text-gray-600'>Credits Remaining</div>
        </div>
      </div>
    </div>
  );
}

export default Credits;
