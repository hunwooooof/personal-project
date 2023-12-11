import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Age, Cake, School } from '../../../components/Icon';
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
      <div className='mx-0 md:mx-12 lg:mx-20 flex flex-wrap gap-6 justify-center h-[calc(100vh-150px)] overflow-y-auto'>
        {students &&
          students.map((student) => {
            const calculate_age = (birthday: string) => {
              const dateOfBirth = new Date(birthday);
              const diff = Date.now() - dateOfBirth.getTime();
              const age = new Date(diff);
              return Math.abs(age.getUTCFullYear() - 1970);
            };
            return (
              <div
                className='flex flex-col items-center w-56 h-[350px] shrink-0 rounded-2xl bg-gray-100'
                key={student.id}>
                <div className='w-full h-24 bg-slate-900 rounded-t-2xl relative'>
                  <img
                    src={student.photoURL}
                    className='absolute left-[64px] top-10 bg-white w-24 h-24 object-cover rounded-full mb-5 border-2 border-gray-100'
                  />
                </div>
                <div className='flex flex-col items-center w-full px-5 pt-12 pb-8 text-black'>
                  <div className='text-xl mb-2'>
                    {student.firstName} {student.lastName}
                  </div>
                  <div className='mb-5'>{student.chineseName}</div>
                  <div className='flex w-8/12 gap-1 mb-2 items-center text-gray-500'>
                    {Cake()}
                    {student.birthday}
                  </div>
                  <div className='flex w-8/12 gap-1 mb-2 items-center text-gray-500'>
                    {School()}
                    {student.school}
                  </div>
                  <div className='flex w-8/12 gap-1 items-center text-gray-500'>
                    {Age()}
                    {calculate_age(student.birthday)} years old
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Student;
