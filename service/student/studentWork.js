import axios from 'axios';
import Error from 'next/error';

export async function UpdateStudentWorkSheetService({ studentWorkId, body }) {
  try {
    const studentWork = await axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/student-assignment/update-worksheet`,
      { studentWorkId, body },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return studentWork.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
