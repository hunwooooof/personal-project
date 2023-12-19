import { Tab, Tabs } from '@nextui-org/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight } from '../../components/Icon';
import LoadingAnimation from '../../components/LoadingAnimation';
import { useStore } from '../../store/store';
import { db } from '../../utils/firestore';
import Attendance from './Attendance';
import Credits from './Credits';

function Session() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, kids, isLogin, isLoading, setLoading, setCurrentNav } = useStore();
  const { role } = user;
  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
  }, [id]);

  useEffect(() => {
    if (!isLogin) {
      navigate('/');
      setCurrentNav('schedules');
      setLoading(false);
    } else if (isLogin) {
      if (role === 'user' && kids) {
        if (!kids.some((kid) => kid.id === id)) {
          navigate('/profile');
        }
        setCurrentNav('profile');
        setLoading(false);
      } else if (role === 'admin') {
        kids.pop();
        setCurrentNav('admin-students');
        if (kids.length === 0) {
          getDocs(query(collection(db, 'students'), where('id', '==', id)))
            .then((querySnapshot) => {
              if (querySnapshot.size === 0) {
                navigate('/admin/students');
              } else {
                querySnapshot.forEach((docSnapshot) => {
                  const doc = docSnapshot.data();
                  console.log(doc);
                  kids.push(doc as never);
                });
              }
            })
            .then(() => setLoading(false));
        } else {
          setLoading(false);
        }
      }
    }
  }, [isLogin, kids]);

  const calculate_age = (birthday: string) => {
    const dateOfBirth = new Date(birthday);
    const diff = Date.now() - dateOfBirth.getTime();
    const age = new Date(diff);
    return Math.abs(age.getUTCFullYear() - 1970);
  };

  return (
    <div className='custom-main-container pt-6 lg:pt-14'>
      {isLoading && <LoadingAnimation />}
      <div className='flex flex-col md:flex-row justify-between items-center'>
        <div className='flex items-center gap-3'>
          {role === 'user' && (
            <Link
              to='/profile'
              className='mb-1 font-bold text-2xl sm:text-3xl ml-0 md:ml-12 lg:ml-20 whitespace-nowrap text-gray-400 hover:text-white'>
              Profile
            </Link>
          )}
          {role === 'admin' && (
            <Link
              to='/admin/students'
              className='font-bold text-2xl sm:text-3xl ml-0 md:ml-12 lg:ml-20 whitespace-nowrap text-gray-400 hover:text-white'>
              Students
            </Link>
          )}
          {ArrowRight('w-8 h-8 stroke-[1]')}
          {kids.map((kid) => {
            if (kid.id === id) {
              return (
                <div key={kid.id} className='font-bold text-2xl sm:text-3xl whitespace-nowrap'>
                  {kid.firstName}
                </div>
              );
            }
          })}
        </div>
        {role === 'user' && kids.length > 1 && (
          <div className='min-w-36 flex flex-col mr-0 md:mr-12 lg:mr-20'>
            <Tabs aria-label='kid' selectedKey={id}>
              {kids.map((kid) => (
                <Tab key={kid.id} title={kid.firstName} href={`/session/${kid.id}`} onClick={() => setLoading(true)} />
              ))}
            </Tabs>
          </div>
        )}
      </div>
      {kids.length > 0 &&
        kids.map((kid) => {
          if (kid.id === id) {
            return (
              <div key={kid.id}>
                <div className='border-b border-gray-600 pb-4'>
                  <div className='mx-0 md:mx-12 lg:mx-20 flex items-center py-6 text-black'>
                    <div className='w-full relative pt-10 pb-6 pl-40 flex items-center my-[12px] bg-white rounded-3xl'>
                      <div className='absolute top-0 left-0 rounded-t-3xl bg-gray-300 w-full h-6' />
                      <img src={kid.photoURL} className='w-24 h-24 object-cover rounded-full border bg-white mr-20' />
                      <div className='flex flex-col w-32 gap-2'>
                        <div className='text-gray-500'>Name</div>
                        <div>
                          {kid.firstName} {kid.lastName}
                        </div>
                      </div>
                      <div className='flex flex-col w-32 gap-2'>
                        <div className='text-gray-500'>Age</div>
                        <div>{calculate_age(kid.birthday)}</div>
                      </div>
                      <div className='flex flex-col w-32 gap-2'>
                        <div className='text-gray-500'>School</div>
                        <div>{kid.school}</div>
                      </div>
                      <div className='flex flex-col w-32 gap-2'>
                        <div className='text-gray-500'>ID</div>
                        <div>{kid.id}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Credits currentKidId={kid.docId} />
                <Attendance currentKidId={kid.docId} />
              </div>
            );
          }
        })}
    </div>
  );
}

export default Session;
