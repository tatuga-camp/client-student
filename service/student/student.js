import axios from 'axios';
import Error from 'next/error';

export async function GetStudent({ studentId }) {
  try {
    const student = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/get-a-student`,
      {
        params: {
          studentId: studentId,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return student;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function UpdateStudent({ formData, studentId }) {
  try {
    const updateStudent = await axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/update`,
      formData,
      {
        params: {
          studentId: studentId,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return updateStudent;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function setStudentPasswordForStudentService({
  password,
  studentId,
  confirmPassword,
}) {
  try {
    const updateStudent = await axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/set-password`,
      { password, studentId, confirmPassword },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return updateStudent.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
export async function VeriflyPasswordForStudentService({
  password,
  studentId,
}) {
  try {
    const verifly = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/verifly-student`,
      {
        params: {
          password,
          studentId,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return verifly.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
