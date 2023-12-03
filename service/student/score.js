import axios from 'axios';
import Error from 'next/error';

export async function StudentGetAllScore({ studentId, classroomId }) {
  try {
    const scores = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/score/get`,
      {
        params: {
          studentId: studentId,
          classroomId: classroomId,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return scores.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
