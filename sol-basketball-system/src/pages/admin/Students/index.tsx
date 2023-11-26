import { useEffect, useState } from 'react';
import AgeIcon from '../../../components/AgeIcon';
import CakeIcon from '../../../components/CakeIcon';
import SchoolIcon from '../../../components/SchoolIcon';
import { collection, db, getDocs } from '../../../utils/firebase';

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
    const studentsSnapshot = await getDocs(collection(db, 'students'));
    const studentsProfiles: StudentProfile[] = [];
    studentsSnapshot.forEach((docSnap) => {
      studentsProfiles.push(docSnap.data() as StudentProfile);
    });
    setStudents(studentsProfiles as StudentProfile[]);
  };

  useEffect(() => {
    getStudentsProfile();
  }, []);

  return (
    <div className='custom-main-container mt-28'>
      <div className='w-10/12 mx-auto'>
        <div className='mt-6  px-3 py-2 text-xl border-b border-gray-200 mb-8'>Students</div>
        <div className='flex flex-wrap gap-5 pb-8'>
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
                  className='flex flex-col shrink-0 items-center w-56 h-80 border shadow-md p-4 rounded-md'
                  key={student.id}>
                  <img src={student.photoURL} className='w-24 h-24 object-cover rounded-full mb-5' />
                  <div className='text-xl text-black mb-2'>
                    {student.firstName} {student.lastName}
                  </div>
                  <div className=' text-black mb-5'>{student.chineseName}</div>
                  <div className='flex w-8/12 gap-1 mb-2 items-center'>
                    <CakeIcon />
                    {student.birthday}
                  </div>
                  <div className='flex w-8/12 gap-1 mb-2 items-center'>
                    <SchoolIcon />
                    {student.school}
                  </div>
                  <div className='flex w-8/12 gap-1 items-center'>
                    <AgeIcon />
                    {calculate_age(student.birthday)} y
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Student;