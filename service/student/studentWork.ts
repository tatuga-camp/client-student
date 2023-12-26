import axios from "axios";
import Error from "next/error";
import { StudentWork } from "../../models";

interface InputUpdateStudentWorkSheetService {
  studentWorkId: string;
  body: string;
}
type ResponseUpdateStudentWorkSheetService = StudentWork;
export async function UpdateStudentWorkSheetService({
  studentWorkId,
  body,
}: InputUpdateStudentWorkSheetService): Promise<ResponseUpdateStudentWorkSheetService> {
  try {
    const studentWork = await axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/student-assignment/update-worksheet`,
      { studentWorkId, body },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return studentWork.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}
