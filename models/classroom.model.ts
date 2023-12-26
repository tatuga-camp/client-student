export interface Classroom {
  id: string;
  createAt: string;
  updateAt: string;
  title: string;
  description: string;
  level: string;
  classroomCode: string;
  color: string;
  isAchieve: boolean;
  isDelete: boolean;
  order: number;
  specialScorePercentage: string;
  maxScore: number;
  allowStudentsToViewScores: boolean;
  allowStudentToDeleteWork: boolean;
  userId: string;
}
