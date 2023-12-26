import axios from "axios";
import Error from "next/error";
import { Assignment, StudentWork } from "../../models";

interface InputStudentGetAllScoreService {
  studentId: string;
  classroomId: string;
}
export interface ResponseStudentGetAllScoreService {
  assignments: {
    id: string;
    createAt: string;
    updateAt: string;
    isDelete: boolean;
    studentId: string;
    assignmentId: string;
    studentWork: StudentWork;
    assignment: Assignment;
  }[];
  speicalScore: number;
  rawSpecialScore: number;
  totalScore: number;
}
export async function StudentGetAllScoreService({
  studentId,
  classroomId,
}: InputStudentGetAllScoreService): Promise<ResponseStudentGetAllScoreService> {
  try {
    const scores = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/score/get`,
      {
        params: {
          studentId: studentId,
          classroomId: classroomId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return scores.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}
