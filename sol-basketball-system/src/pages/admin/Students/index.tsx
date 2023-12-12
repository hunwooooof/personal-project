import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageTitle from '../../../components/PageTitle';
import { useStore } from '../../../store/store';
import { firestore } from '../../../utils/firestore';

interface StudentProfile {
  birthday: string;
  chineseName: string;
  docId: string;
  firstName: string;
  id: string;
  lastName: string;
  photoURL: string;
  school: string;
}

function Student() {
  const { setCurrentNav, isLogin } = useStore();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      navigate('/');
      setCurrentNav('schedules');
    } else if (isLogin) {
      setCurrentNav('admin-students');
    }
  }, [isLogin]);

  const getStudentsProfile = async () => {
    const studentsProfiles = await firestore.getDocs('students');
    setStudents(studentsProfiles as StudentProfile[]);
  };

  useEffect(() => {
    getStudentsProfile();
  }, []);

  return (
    <div className='custom-main-container'>
      <div className='pt-6 lg:pt-14 pb-14'>
        <PageTitle title='Students' />
      </div>
      <div className='mx-0 md:mx-12 lg:mx-20 flex flex-wrap gap-12 justify-center pt-4 pb-20 h-[calc(100vh-150px)] overflow-y-auto'>
        {students &&
          students.map((student) => {
            const calculate_age = (birthday: string) => {
              const dateOfBirth = new Date(birthday);
              const diff = Date.now() - dateOfBirth.getTime();
              const age = new Date(diff);
              return Math.abs(age.getUTCFullYear() - 1970);
            };
            return (
              <div key={student.id} className='kidCard bg-white'>
                <img
                  src={student.photoURL}
                  className='w-24 h-24 object-cover rounded-full my-2 absolute -top-14 border-2 border-white'
                />
                <div className='text-xl text-black mt-14 font-bold'>
                  {student.firstName} {student.lastName}
                </div>
                <div className=' text-black mb-4 font-semibold'>{student.chineseName}</div>
                <div className='flex flex-col w-full items-center text-sm px-8 mt-4 gap-2'>
                  <div className='w-full flex items-center mb-2 text-black justify-start gap-2'>
                    <span className='inline-block w-4/12 mr-2 text-gray-500'>ID</span>
                    {student.id}
                  </div>
                  <div className='w-full flex items-center mb-2 text-black justify-start gap-2'>
                    <span className='inline-block w-4/12 mr-2 text-gray-500'>School</span>
                    {student.school}
                  </div>
                  <div className='w-full flex items-center mb-2 text-black justify-start gap-2'>
                    <span className='inline-block w-4/12 mr-2 text-gray-500'>Birthday</span>
                    {student.birthday}
                  </div>
                  <div className='w-full flex items-center mb-2 text-black justify-start gap-2'>
                    <span className='inline-block w-4/12 mr-2 text-gray-500'>Age</span>
                    {calculate_age(student.birthday)}
                  </div>
                  <Link to={`/session/${student.id}`} className='self-end -mr-4 hover:scale-110 duration-150'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      className='w-5 h-5 stroke-black stroke-[1.5]'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Student;
