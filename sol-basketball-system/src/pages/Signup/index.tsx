import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import googleLogoUrl from '../../assets/google-logo.png';
import logoUrl from '../../assets/sol-logo.png';
import { useStore } from '../../store/store';

const emptyAccount = {
  name: '',
  email: '',
  password: '',
};

function Signup() {
  const navigate = useNavigate();
  const { nativeSignup, googleLogin, isLogin, userRef, getUserProfile } = useStore();

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
    <div className='custom-main-container pt-14'>
      <div className='mt-10 mx-auto w-5/12 flex items-center flex-col'>
        <img src={logoUrl} alt='sign-up-icon' className='w-20 mb-5' />
        <div className='flex flex-col gap-5 w-full bg-white p-8 rounded-3xl mb-8'>
          <div className='text-2xl text-gray-500 text-center'>Sign up</div>
          <input
            type='text'
            name='name'
            id='name'
            placeholder='Name *'
            className='custom-signin-input'
            value={account.name}
            onChange={handleInputChange}
          />
          <input
            type='email'
            name='email'
            id='email'
            placeholder='Email Address *'
            className='custom-signin-input'
            value={account.email}
            onChange={handleInputChange}
          />
          <input
            type='text'
            name='password'
            id='password'
            placeholder='Password *'
            className='custom-signin-input'
            value={account.password}
            onChange={handleInputChange}
          />{' '}
          <div className='flex flex-col'>
            <button
              type='submit'
              className='text-white bg-slate-500 text-center p-2 rounded-3xl hover:bg-slate-800'
              onClick={() => nativeSignup(account)}>
              SIGN UP
            </button>
            <Link to='/login' className='text-sm self-end underline mt-2 text-gray-400 hover:text-blue-500'>
              Already have an account? Sign in
            </Link>
          </div>
        </div>
        <button
          onClick={googleLogin}
          className='flex items-center gap-3 bg-white rounded-full px-5 py-3 text-gray-400 hover:text-black'>
          <img src={googleLogoUrl} alt='google logo' className='w-6' />
          使用 Google 帳戶註冊
        </button>
      </div>
    </div>
  );
}

export default Signup;
