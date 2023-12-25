import Lottie from 'lottie-react';
import animationData from '../assets/loading-animation.json';

function LoadingAnimation() {
  return (
    <div className='w-full h-screen flex items-center justify-center pb-12'>
      <Lottie animationData={animationData} loop={true} className='w-40 h-40' />
    </div>
  );
}

export default LoadingAnimation;
