export interface Assignment {
  id: string;
  createAt: string;
  updateAt: string;
  title: string;
  picture: string | null;
  description: string;
  deadline: string;
  maxScore: number;
  percentage: string | null;
  isDelete: boolean;
  classroomId: string;
  userId: string;
  files: File[];
}

export interface File {
  id: string;
  createAt: string;
  updateAt: string;
  name: string;
  file: string;
  type: string;
  assignmentId: string;
}
