import axios from "axios";
import Error from "next/error";
import { Assignment, StudentWork } from "../../models";

interface InputGetAssignmentService {
  assignmentId: string;
}
type ResponseGetAssignmentService = Assignment;
export async function GetAssignmentService({
  assignmentId,
}: InputGetAssignmentService): Promise<ResponseGetAssignmentService> {
  try {
    const assignment = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/student-assignment/get-assignment`,
      {
        params: {
          assignmentId: assignmentId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return assignment.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

interface InputGetAllAssignmentService {
  studentId: string;
  classroomId: string;
}
export interface ResponseGetAllAssignmentService {
  student: StudentWork;
  assignment: Assignment;
}
export async function GetAllAssignmentService({
  studentId,
  classroomId,
}: InputGetAllAssignmentService): Promise<ResponseGetAllAssignmentService[]> {
  try {
    const assignments = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/student-assignment/get-all`,
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
    return assignments.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}
interface InputDeleteMyWorkService {
  studentId: string;
  studentWorkId: string;
  classroomId: string;
}
interface ResponseDeleteMyWorkService {
  message: string;
}
export async function DeleteMyWorkService({
  studentId,
  studentWorkId,
  classroomId,
}: InputDeleteMyWorkService): Promise<ResponseDeleteMyWorkService> {
  try {
    const myWork = await axios.delete(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/student-assignment/studentWork/delete`,
      {
        params: {
          studentId,
          studentWorkId,
          classroomId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return myWork.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

interface InputGetMyWorkService {
  studentId: string;
  assignmentId: string;
}
type ResponseGetMyWorkService = StudentWork;
export async function GetMyWorkService({
  studentId,
  assignmentId,
}: InputGetMyWorkService): Promise<ResponseGetMyWorkService> {
  try {
    const myWork = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/student-assignment/view-my-work`,
      {
        params: {
          studentId: studentId,
          assignmentId: assignmentId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return myWork.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

interface InputSummitWorkService {
  formFiles: FormData;
  assignmentId: string;
  studentId: string;
}
type ResponseSummitWorkService = StudentWork;

interface SignURL {
  urls: {
    SignedURL: string;
    contentType: string;
  }[];
  baseUrls: string[];
}
export async function SummitWorkService({
  formFiles,
  assignmentId,
  studentId,
}: InputSummitWorkService): Promise<ResponseSummitWorkService> {
  try {
    const heic2any = (await import("heic2any")).default;
    const filesOld = formFiles.getAll("files");
    const files = await Promise.all(
      filesOld.map(async (file: any) => {
        if (file.type === "") {
          const blob: any = await heic2any({
            blob: file,
            toType: "image/jpeg",
          });
          file = new File([blob], file.name, { type: "image/jpeg" });
          return {
            file: file,
            fileName: file.name,
            fileType: file.type,
          };
        } else {
          return {
            file: file,
            fileName: file.name,
            fileType: file.type,
          };
        }
      })
    );
    const urls = await axios.post<SignURL>(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/student-assignment/summit-work`,
      { files },
      {
        params: {
          assignmentId: assignmentId,
          studentId: studentId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    for (let i = 0; i < urls.data.urls.length; i++) {
      await fetch(urls.data.urls[i].SignedURL, {
        method: "PUT",
        headers: {
          "Content-Type": `${urls.data.urls[i].contentType}`,
        },
        body: files[i].file,
      }).catch((err) => {
        throw new Error(err);
      });
    }

    const pictureArrayToString = urls.data.baseUrls.join(", ");
    const createWork = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/student-assignment/create-work-after-signURL`,
      { picture: pictureArrayToString },
      {
        params: {
          assignmentId: assignmentId,
          studentId: studentId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return createWork.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

interface InputSummitWorkWithWorkSheetService {
  assignmentId: string;
  studentId: string;
  body: string;
}
type ResponseSummitWorkWithWorkSheetService = StudentWork;
export async function SummitWorkWithWorkSheetService({
  assignmentId,
  studentId,
  body,
}: InputSummitWorkWithWorkSheetService): Promise<ResponseSummitWorkWithWorkSheetService> {
  try {
    const createWork = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/student-assignment/create-work-after-signURL`,
      { body },
      {
        params: {
          assignmentId: assignmentId,
          studentId: studentId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return createWork.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}
