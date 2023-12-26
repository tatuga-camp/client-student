export interface Student {
  id: string;
  createAt: string;
  updateAt: string;
  firstName: string;
  lastName: string;
  number: string;
  picture: string;
  nationality: string;
  password: string | null;
  resetPassword: boolean;
  isDelete: boolean;
  classroomId: string;
  userId: string;
  studentClassId: string | null;
  isCheck?: boolean;
}
