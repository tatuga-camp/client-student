export interface Attendance {
  id: string;
  createAt: string;
  updateAt: string;
  date: string;
  endDate: string;
  absent: boolean;
  present: boolean;
  holiday: boolean;
  sick: boolean;
  late: boolean;
  warn: boolean;
  note: string | null;
  groupId: string;
  userId: string;
  studentId: string;
  classroomId: string;
}

export interface AttendanceStatistics {
  sum: number;
  percent: {
    present: number;
    absent: number;
    holiday: number;
    sick: number;
    noData: number;
    late: number;
  };
  number: {
    present: number;
    absent: number;
    holiday: number;
    sick: number;
    noData: number;
    late: number;
  };
}
export interface QrCodeAttendance {
  id: string;
  createAt: string;
  updateAt: string;
  firstName: string;
  lastName: string;
  number: string;
  picture: string;
  nationality: string;
  password: string;
  resetPassword: boolean;
  isDelete: boolean;
  classroomId: string;
  userId: string;
  studentClassId: string | null;
}
