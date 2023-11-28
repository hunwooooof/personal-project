import { useEffect, useState } from 'react';
import { Age, Cake, School } from '../../../components/Icon';
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
  const [students, setStudents] = useState<StudentProfile[]>([]);
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
        <div className='w-full h-[77vh] bg-white rounded-3xl p-6'>
          <div className='flex flex-wrap gap-4 justify-center h-[71vh] overflow-y-auto rounded-md'>
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
                    className='flex flex-col items-center w-56 h-88 p-5 rounded-xl bg-slate-100 font-bold text-gray-500'
                    key={student.id}>
                    <img src={student.photoURL} className='w-24 h-24 object-cover rounded-full mb-5' />
                    <div className='text-xl text-black mb-2'>
                      {student.firstName} {student.lastName}
                    </div>
                    <div className=' text-black mb-5'>{student.chineseName}</div>
                    <div className='flex w-8/12 gap-1 mb-2 items-center'>
                      {Cake()}
                      {student.birthday}
                    </div>
                    <div className='flex w-8/12 gap-1 mb-2 items-center'>
                      {School()}
                      {student.school}
                    </div>
                    <div className='flex w-8/12 gap-1 items-center'>
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
