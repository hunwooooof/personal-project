import { Button, Input, Spinner } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import googleLogoUrl from '../../assets/google-logo.png';
import logoUrl from '../../assets/sol-logo.png';
import { EyeFilledIcon } from '../../components/EyeFilledIcon';
import { EyeSlashFilledIcon } from '../../components/EyeSlashFilledIcon';
import { useStore } from '../../store/store';
const emptyAccount = {
  name: 'Susan',
  email: 'susan0708@gmail.com',
  password: '123456',
};

function Signup() {
  const navigate = useNavigate();
  const { setCurrentNav, nativeSignup, googleLogin, isLogin, userRef, getUserProfile, isLoading, setLoading } =
    useStore();
  const [account, setAccount] = useState(emptyAccount);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    setAccount({ ...account, [id]: e.target.value });
  };

  useEffect(() => {
    if (isLogin) {
      getUserProfile(userRef);
      navigate('/profile');
      setCurrentNav('/profile');
    }
    setLoading(false);
  }, [isLogin]);

  const isInvalidName = account.name.length > 26;
  const isInvalidEmail = !/^[A-Za-z0-9._%+-]+@[^@\s]+\.[^@\s]+$/.test(account.email) && account.email.length > 0;
  const isInvalidPassword = account.password.length < 6 && account.password.length > 0;

  return (
    <div className='custom-main-container pt-14'>
      <div className='mt-10 mx-auto w-5/12 flex items-center flex-col'>
        <img src={logoUrl} alt='sign-up-icon' className='w-20 mb-5 rounded-full bg-white' />
        <div className='flex flex-col gap-5 w-full p-8 rounded-3xl mb-8 text-black'>
          <div className='text-2xl text-gray-300 text-center'>Sign up</div>
          <Input
            isRequired
            type='text'
            label='Full name'
            id='name'
            placeholder='Enter your name'
            isInvalid={isInvalidName}
            color={isInvalidName ? 'danger' : 'default'}
            errorMessage={isInvalidName && 'Exceeded the word limit.'}
            className='mx-auto max-w-sm'
            classNames={{ errorMessage: 'text-red-400' }}
            value={account.name}
            onChange={handleInputChange}
          />
          <Input
            isRequired
            type='email'
            label='Email'
            id='email'
            placeholder='Enter your email'
            isInvalid={isInvalidEmail}
            color={isInvalidEmail ? 'danger' : 'default'}
            errorMessage={isInvalidEmail && 'Please enter a valid email.'}
            className='mx-auto max-w-sm'
            classNames={{ errorMessage: 'text-red-400' }}
            value={account.email}
            onChange={handleInputChange}
          />
          <Input
            isRequired
            id='password'
            label='Password'
            placeholder='Enter your password'
            isInvalid={isInvalidPassword}
            color={isInvalidPassword ? 'danger' : 'default'}
            errorMessage={isInvalidPassword && 'Password should be at least 6 characters.'}
            value={account.password}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              const pressedKey = e.key.toUpperCase();
              if (pressedKey === 'ENTER') {
                setLoading(true);
                nativeSignup(account);
              }
            }}
            type={isVisible ? 'text' : 'password'}
            className='mx-auto max-w-sm'
            classNames={{ errorMessage: 'text-red-400' }}
            endContent={
              <button className='focus:outline-none' type='button' onClick={toggleVisibility}>
                {isVisible ? (
                  <EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                ) : (
                  <EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                )}
              </button>
            }
          />
          <Button
            color='primary'
            className='disabled:cursor-auto disabled:bg-gray-300 disabled:scale-100 mx-auto'
            disabled={
              Object.values(account).some((item) => item.length === 0) ||
              isInvalidName ||
              isInvalidEmail ||
              isInvalidPassword
            }
            onClick={() => nativeSignup(account)}>
            {isLoading && <Spinner color='default' size='sm' />}
            SIGN UP
          </Button>
          <Link to='/login' className='text-sm mx-auto underline mt-2 text-blue-400 hover:scale-105 duration-150'>
            Already have an account? Sign in
          </Link>
        </div>
        <button
          onClick={googleLogin}
          className='flex items-center gap-3 rounded-md px-5 py-3 text-blue-400 hover:scale-105 duration-150 mb-10'>
          <img src={googleLogoUrl} alt='google logo' className='w-6' />
          使用 Google 帳戶註冊
        </button>
      </div>
    </div>
  );
}

export default Signup;
