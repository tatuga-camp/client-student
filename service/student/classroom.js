import axios from 'axios';
import Error from 'next/error';

export async function JoinClassroom({ classroomCode }) {
  try {
    if (!classroomCode) {
      return null;
    }
    const classrooms = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/classroom/join-classroom`,
      {
        params: {
          classroomCode: classroomCode,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return classrooms;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function StudentGetClassroom({ classroomId }) {
  try {
    if (!classroomId) {
      return null;
    }
    const classrooms = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/classroom/get-a-classroom`,
      {
        params: {
          classroomId: classroomId,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return classrooms.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
