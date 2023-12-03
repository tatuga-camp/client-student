import axios from 'axios';
import Error from 'next/error';
export async function GetAssignment({ assignmentId }) {
  try {
    if (!assignmentId) {
      return null;
    }
    const assignment = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/student-assignment/get-assignment`,
      {
        params: {
          assignmentId: assignmentId,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return assignment.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
export async function GetAllAssignment({ studentId, classroomId }) {
  try {
    if (!studentId || !classroomId) {
      return null;
    }
    const assignments = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/student-assignment/get-all`,
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
    return assignments;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function DeleteMyWorkService({
  studentId,
  studentWorkId,
  classroomId,
}) {
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
          'Content-Type': 'application/json',
        },
      },
    );
    return myWork.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function GetMyWork({ studentId, assignmentId }) {
  try {
    const myWork = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/student-assignment/view-my-work`,
      {
        params: {
          studentId: studentId,
          assignmentId: assignmentId,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return myWork;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function SummitWork({ formFiles, assignmentId, studentId }) {
  try {
    const heic2any = (await import('heic2any')).default;
    const filesOld = await formFiles.getAll('files');
    const files = await Promise.all(
      filesOld.map(async (file) => {
        if (file.type === '') {
          const blob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
          });
          file = new File([blob], file.name, { type: 'image/jpeg' });
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
      }),
    );
    const urls = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/student-assignment/summit-work`,
      { files },
      {
        params: {
          assignmentId: assignmentId,
          studentId: studentId,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    for (let i = 0; i < urls.data.urls.length; i++) {
      const response = await fetch(urls.data.urls[i].SignedURL, {
        method: 'PUT',
        headers: {
          'Content-Type': `${urls.data.urls[i].contentType}`,
        },
        body: files[i].file,
      }).catch((err) => {
        throw new Error(err);
      });
    }

    const pictureArrayToString = urls.data.baseUrls.join(', ');
    const createWork = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_STUDENT_URL}/student/student-assignment/create-work-after-signURL`,
      { picture: pictureArrayToString },
      {
        params: {
          assignmentId: assignmentId,
          studentId: studentId,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return createWork;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function SummitWorkWithWorkSheet({
  assignmentId,
  studentId,
  body,
}) {
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
          'Content-Type': 'application/json',
        },
      },
    );
    return createWork;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
