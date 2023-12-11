import { Tab, Tabs } from '@nextui-org/react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingAnimation from '../../components/LoadingAnimation';
import PageTitle from '../../components/PageTitle';
import { useStore } from '../../store/store';
import Attendance from './Attendance';
import Credits from './Credits';

function Session() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { kids, isLogin, isLoading, setLoading, setCurrentNav } = useStore();

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
  }, [id]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 400);
    if (!isLogin) {
      navigate('/');
      setCurrentNav('schedules');
    } else if (isLogin) {
      setCurrentNav('profile');
    }
  }, [isLogin]);

  const calculate_age = (birthday: string) => {
    const dateOfBirth = new Date(birthday);
    const diff = Date.now() - dateOfBirth.getTime();
    const age = new Date(diff);
    return Math.abs(age.getUTCFullYear() - 1970);
  };

  return (
    <div className='custom-main-container'>
      {isLoading && <LoadingAnimation />}
      <div className='flex flex-col md:flex-row justify-between items-center pt-6 lg:pt-14'>
        <PageTitle title='Student' />
        <div className='w-36 flex flex-col mr-0 md:mr-12 lg:mr-20'>
          <Tabs aria-label='kid' selectedKey={id}>
            {kids.map((kid) => (
              <Tab key={kid.id} title={kid.firstName} href={`/session/${kid.id}`} onClick={() => setLoading(true)} />
            ))}
          </Tabs>
        </div>
      </div>
      {kids.map((kid) => {
        if (kid.id === id) {
          return (
            <div key={kid.id}>
              <div className='border-b border-gray-600 pb-4'>
                <div className='mx-0 md:mx-12 lg:mx-20 flex items-center py-6 text-black'>
                  <div className='w-full relative pt-10 pb-6 pl-40 flex items-center my-4 bg-white rounded-3xl'>
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
