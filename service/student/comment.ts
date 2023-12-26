import axios from "axios";
import Error from "next/error";
import { Comment, Student, User } from "../../models";

interface InputGetCommentsService {
  assignmentId: string;
  studentId: string;
}
type ResponseGetCommentsService = Comment & {
  studnet: Student;
  user: User;
};
export async function GetCommentsService({
  assignmentId,
  studentId,
}: InputGetCommentsService): Promise<ResponseGetCommentsService> {
  try {
    const comments = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/comment/get-comment`,
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

    return comments.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

interface InputPostCommentService {
  assignmentId: string;
  studentId: string;
  body: string;
}
type ResponsePostCommentService = Comment;
export async function PostCommentService({
  assignmentId,
  studentId,
  body,
}: InputPostCommentService): Promise<ResponsePostCommentService> {
  try {
    const comments = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/comment/post-comment`,
      {
        body: body,
      },
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

    return comments.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}
