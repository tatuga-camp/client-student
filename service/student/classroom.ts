import axios from "axios";
import Error from "next/error";
import { Classroom, Student, User } from "../../models";

interface InputJoinClassroomService {
  classroomCode: string;
}
export interface ResponseJoinClassroomService {
  teacher: User;
  classroom: Classroom;
  students: Student[];
}
export async function JoinClassroomService({
  classroomCode,
}: InputJoinClassroomService): Promise<ResponseJoinClassroomService> {
  try {
    console.log(classroomCode);
    const classrooms = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/classroom/join-classroom`,
      {
        params: {
          classroomCode: classroomCode,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return classrooms.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

interface InputStudentGetClassroomService {
  classroomId: string;
}
type ResponseStudentGetClassroomService = Classroom;
export async function StudentGetClassroomService({
  classroomId,
}: InputStudentGetClassroomService): Promise<ResponseStudentGetClassroomService> {
  try {
    const classrooms = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/classroom/get-a-classroom`,
      {
        params: {
          classroomId: classroomId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return classrooms.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}
