import { Link, useNavigate } from 'react-router-dom';
import logoUrl from '../../assets/sol-logo.png';
import { GoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from 'react';
import { useStore } from '../../store/store';

const emptyAccount = {
  email: 'm1598088703i10@mail.com',
  password: '123456',
};

function Login() {
  const navigate = useNavigate();
  const { nativeLogin, isLogin } = useStore();

  const [account, setAccount] = useState(emptyAccount);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    setAccount({ ...account, [id]: e.target.value });
  };

  useEffect(() => {
    if (isLogin) navigate('/');
  }, [isLogin]);

  //===============
  //  google login
  //===============
  const responseMessage: (response: unknown) => void = (response) => {
    console.log(response);
  };
  // const errorMessage: (error: undefined) => void = (error) => {
  //   console.log(error);
  // };

  return (
    <div className='custom-main-container'>
      <div className='mt-36 mx-auto w-96 flex items-center flex-col'>
        <div>
          <img src={logoUrl} alt='sign-up-icon' className='w-24' />
          <div className=' text-center'>Sign in</div>
        </div>
        <div className='flex flex-col gap-2 w-full'>
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
          />
          <button
            type='submit'
            className='text-white bg-[#1876D1] text-center shadow-md px-4 py-2 rounded-sm'
            onClick={() => nativeLogin(account)}>
            SIGN IN
          </button>
        </div>
        <Link to='/signup' className='self-end text-blue-500 underline'>
          Don't have an account? Sign Up
        </Link>
        <div>or</div>
        <GoogleLogin onSuccess={responseMessage} />
      </div>
    </div>
  );
}

export default Login;
