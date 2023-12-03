import axios from 'axios';
import Error from 'next/error';
export async function GetAttendances({ studentId, classroomId }) {
  try {
    const attendances = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/attendance/get-attendance`,
      {
        params: {
          studentId: studentId,
          classroomId: classroomId,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return attendances;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function ReadQrCodeAttendance({
  attendanceQRCodeId,
  classroomId,
}) {
  try {
    const attendances = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/attendance/get/qr-code`,
      {
        params: {
          attendanceQRCodeId: attendanceQRCodeId,
          classroomId: classroomId,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return attendances.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function UpdateQrCodeAttendance({
  studentId,
  attendanceId,
  attendanceQRCodeId,
  attendance,
}) {
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
            'Content-Type': 'application/json',
          },
        },
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
            'Content-Type': 'application/json',
          },
        },
      );

      localStorage.setItem(`${attendanceQRCodeId}`, attendanceQRCodeId);

      return attendances.data;
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
