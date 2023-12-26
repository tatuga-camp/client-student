import axios from "axios";
import Error from "next/error";
import { Student } from "../../models";

interface InputGetStudentService {
  studentId: string;
}
type ResponseGetStudentService = Student;
export async function GetStudentService({
  studentId,
}: InputGetStudentService): Promise<ResponseGetStudentService> {
  try {
    const student = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/get-a-student`,
      {
        params: {
          studentId: studentId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return student.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

interface InputUpdateStudentService {
  formData: FormData;
  studentId: string;
}
type ResponseUpdateStudentService = Student;
export async function UpdateStudentService({
  formData,
  studentId,
}: InputUpdateStudentService): Promise<ResponseUpdateStudentService> {
  try {
    const updateStudent = await axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/update`,
      formData,
      {
        params: {
          studentId: studentId,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return updateStudent.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

interface InputSetStudentPasswordForStudentService {
  password: string;
  studentId: string;
  confirmPassword: string;
}
type ResponseSetStudentPasswordForStudentService = Student;
export async function SetStudentPasswordForStudentService({
  password,
  studentId,
  confirmPassword,
}: InputSetStudentPasswordForStudentService): Promise<ResponseSetStudentPasswordForStudentService> {
  try {
    const updateStudent = await axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/set-password`,
      { password, studentId, confirmPassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return updateStudent.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

interface InputVeriflyPasswordForStudentService {
  password: string;
  studentId: string;
}
type ResponseVeriflyPasswordForStudentService = Student;
export async function VeriflyPasswordForStudentService({
  password,
  studentId,
}: InputVeriflyPasswordForStudentService): Promise<ResponseVeriflyPasswordForStudentService> {
  try {
    const verifly = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/verifly-student`,
      {
        params: {
          password,
          studentId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return verifly.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}
