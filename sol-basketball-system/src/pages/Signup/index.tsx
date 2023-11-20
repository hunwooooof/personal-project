import { Link, useNavigate } from 'react-router-dom';
import logoUrl from '../../assets/sol-logo.png';
import { useEffect, useState } from 'react';
import { useStore } from '../../store/store';

const emptyAccount = {
  name: '',
  email: '',
  password: '',
};

function Signup() {
  const navigate = useNavigate();
  const { nativeSignup, googleSignup, isLogin, userRef, getUserProfile } = useStore();

  const [account, setAccount] = useState(emptyAccount);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    setAccount({ ...account, [id]: e.target.value });
  };

  useEffect(() => {
    if (isLogin) {
      getUserProfile(userRef);
      navigate('/schedule');
    }
  }, [isLogin]);

  return (
    <div className='custom-main-container'>
      <div className='mt-36 mx-auto w-96 flex items-center flex-col'>
        <div>
          <img src={logoUrl} alt='sign-up-icon' className='w-24' />
          <div className=' text-center'>Sign up</div>
        </div>
        <div className='flex flex-col gap-2 w-full'>
          <input
            type='text'
            name='name'
            id='name'
            placeholder='Name *'
            className='custom-signin-input'
            onChange={handleInputChange}
          />
          <input
            type='email'
            name='email'
            id='email'
            placeholder='Email Address *'
            className='custom-signin-input'
            onChange={handleInputChange}
          />
          <input
            type='text'
            name='password'
            id='password'
            placeholder='Password *'
            className='custom-signin-input'
            onChange={handleInputChange}
          />
          <button
            type='submit'
            className='text-white bg-[#1876D1] text-center shadow-md px-4 py-2 rounded-sm'
            onClick={() => nativeSignup(account)}>
            SIGN UP
          </button>
        </div>
        <Link to='/login' className='self-end text-blue-500 underline'>
          Already have an account? Sign in
        </Link>
        <div>or</div>
        <button onClick={googleSignup}>使用 Google 帳戶註冊</button>
      </div>
    </div>
  );
}

export default Signup;
