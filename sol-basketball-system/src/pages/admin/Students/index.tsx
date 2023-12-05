import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Age, Cake, School } from '../../../components/Icon';
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
      navigate('/login');
      setCurrentNav('');
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
    <div className='custom-main-container pt-16'>
      <div className='w-11/12 mx-auto'>
        <div className='custom-page-title mb-6'>Students</div>
        <div className='w-full h-[77vh] p-6'>
          <div className='flex flex-wrap gap-4 justify-center max-h-[71vh] overflow-y-auto rounded-md'>
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
                    className='flex flex-col items-center w-56 h-88 shrink-0 p-5 rounded-md border border-gray-600'
                    key={student.id}>
                    <img src={student.photoURL} className='w-24 h-24 object-cover rounded-full mb-5' />
                    <div className='text-xl mb-2'>
                      {student.firstName} {student.lastName}
                    </div>
                    <div className='mb-5'>{student.chineseName}</div>
                    <div className='flex w-8/12 gap-1 mb-2 items-center text-gray-400'>
                      {Cake()}
                      {student.birthday}
                    </div>
                    <div className='flex w-8/12 gap-1 mb-2 items-center text-gray-400'>
                      {School()}
                      {student.school}
                    </div>
                    <div className='flex w-8/12 gap-1 items-center text-gray-400'>
                      {Age()}
                      {calculate_age(student.birthday)} years old
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Student;
