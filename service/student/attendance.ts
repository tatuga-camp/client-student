import axios from "axios";
import Error from "next/error";
import { Attendance, AttendanceStatistics, Student } from "../../models";

interface InputGetAttendancesService {
  studentId: string;
  classroomId: string;
}
export interface ResponseGetAttendancesService {
  students: Attendance[];
  statistics: AttendanceStatistics;
}
export async function GetAttendancesService({
  studentId,
  classroomId,
}: InputGetAttendancesService): Promise<ResponseGetAttendancesService> {
  try {
    const attendances = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/attendance/get-attendance`,
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
    return attendances.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

interface InputReadQrCodeAttendanceService {
  attendanceQRCodeId: string;
  classroomId: string;
}
type ResponseReadQrCodeAttendanceService = {
  qrCodeAttendance: {
    id: string;
    createAt: string;
    updateAt: string;
    date: string;
    endDate: string;
    exipreAt: string;
    isLimitOneBrowser: boolean;
    headAttendanceId: string;
    classroomId: string;
  };
  students: AttendanceWithStudent[];
};
export type AttendanceWithStudent = Attendance & {
  isCheck: boolean;
  student: Student;
};
export async function ReadQrCodeAttendanceService({
  attendanceQRCodeId,
  classroomId,
}: InputReadQrCodeAttendanceService): Promise<ResponseReadQrCodeAttendanceService> {
  try {
    const attendances = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/attendance/get/qr-code`,
      {
        params: {
          attendanceQRCodeId: attendanceQRCodeId,
          classroomId: classroomId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return attendances.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

interface InputUpdateQrCodeAttendanceService {
  studentId: string;
  attendanceId: string;
  attendanceQRCodeId: string;
  attendance: CheckLists;
}
export interface CheckLists {
  absent: boolean;
  present: boolean;
  holiday: boolean;
  sick: boolean;
  late: boolean;
  warn: boolean;
}
type ResponseUpdateQrCodeAttendanceService = Attendance;
export async function UpdateQrCodeAttendanceService({
  studentId,
  attendanceId,
  attendanceQRCodeId,
  attendance,
}: InputUpdateQrCodeAttendanceService): Promise<ResponseUpdateQrCodeAttendanceService> {
  try {
    const getLocalStoreOnattendanceQRCodeId =
      localStorage.getItem(attendanceQRCodeId);

    if (getLocalStoreOnattendanceQRCodeId === null) {
      const attendances = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/attendance/update`,
        {
          studentId,
          attendanceId,
          attendance,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem(`${attendanceQRCodeId}`, attendanceQRCodeId);
      return attendances.data;
    } else {
      const attendances = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/attendance/update`,
        {
          studentId,
          attendanceId,
          attendanceQRCodeId: getLocalStoreOnattendanceQRCodeId,
          attendance,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem(`${attendanceQRCodeId}`, attendanceQRCodeId);

      return attendances.data;
    }
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}
