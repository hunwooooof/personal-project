import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../../components/PageTitle';
import { useStore } from '../../../store/store';
import { firestore } from '../../../utils/firestore';
import { KidType } from '../../../utils/types';
import StudentCard from './StudentCard';

function Student() {
  const { setCurrentNav, isLogin } = useStore();
  const [students, setStudents] = useState<KidType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      navigate('/');
      setCurrentNav('schedules');
    }
    if (isLogin) {
      setCurrentNav('admin-students');
    }
  }, [isLogin]);

  const getStudentsProfile = async () => {
    const studentsProfiles = await firestore.getDocs('students');
    setStudents(studentsProfiles as KidType[]);
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
        {students && students.map((student) => <StudentCard key={student.id} student={student} />)}
      </div>
    </div>
  );
}

export default Student;
