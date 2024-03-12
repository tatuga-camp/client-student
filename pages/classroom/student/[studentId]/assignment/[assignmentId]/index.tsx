import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { StudentGetClassroomService } from "../../../../../../service/student/classroom";
import {
  GetAssignmentService,
  GetMyWorkService,
} from "../../../../../../service/student/assignment";
import { GetStudentService } from "../../../../../../service/student/student";
import { SlideshowLightbox, initLightboxJS } from "lightbox.js-react";
import { File, StudentWork, User } from "../../../../../../models";
import Head from "next/head";
import ShowSelectFile from "../../../../../../components/forms/showSelectFile";
import CreateStudentWork from "../../../../../../components/forms/createStudentWork";
import { RiArrowGoBackFill } from "react-icons/ri";
import Image from "next/image";
import { Skeleton } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import ShowFilesListsOnAssignment from "../../../../../../components/assignment/showFilesListsOnAssignment";
import FooterAssignment from "../../../../../../components/assignment/footerAssignment";

export type StudentWorkWithFile = StudentWork & {
  pictures?: {
    src: string;
    alt: string;
  }[];
  files?: {
    fileType: string;
    url: string;
  }[];
};
function Index() {
  const router = useRouter();
  const [loadingTiny, setLoadingTiny] = useState(true);
  const [triggerCreateStudentWork, setTriggerCreateStudentWork] =
    useState(false);
  const [teacher, setTeacher] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [studentWork, setStudnetWork] = useState<StudentWorkWithFile>();
  const [deadline, setDeadline] = useState<string>();
  const [isDue, setIsDue] = useState(false);
  const currentTime = new Date();
  const [triggerShowFile, setTriggerShowFile] = useState(false);
  const [selectFile, setSelectFile] = useState<File>();
  const classroom = useQuery({
    queryKey: ["classroom", router.query.classroomId as string],
    queryFn: () =>
      StudentGetClassroomService({
        classroomId: router?.query?.classroomId as string,
      }),
  });
  const assignment = useQuery({
    queryKey: ["assignment", router.query.assignmentId as string],
    queryFn: () =>
      GetAssignmentService({
        assignmentId: router.query.assignmentId as string,
      }),
  });

  const student = useQuery({
    queryKey: ["student", router.query.studentId as string],
    queryFn: () =>
      GetStudentService({ studentId: router.query.studentId as string }),
  });

  const fetchStudentWork = useQuery({
    queryKey: [
      "student-work",
      {
        studentId: router.query.studentId as string,
        assignmentId: router.query.assignmentId as string,
      },
    ],
    queryFn: () =>
      GetMyWorkService({
        studentId: router.query.studentId as string,
        assignmentId: router.query.assignmentId as string,
      }),
    staleTime: 1000 * 6,
    refetchInterval: 1000 * 6,
  });

  useEffect(() => {
    let deadlineSet = new Date(assignment?.data?.deadline as string);
    deadlineSet.setHours(23);
    deadlineSet.setMinutes(59);
    deadlineSet.setSeconds(0);
    if (currentTime > deadlineSet) {
      setIsDue(() => true);
    } else if (currentTime < deadlineSet) {
      setIsDue(() => false);
    }
    setDeadline(() => {
      const date = new Date(assignment?.data?.deadline as string);

      const formattedDate = date.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return formattedDate;
    });
  }, [assignment.data]);

  useEffect(() => {
    setStudnetWork(() => {
      let pictures = [];
      let files = [];
      if (fetchStudentWork?.data?.status === "have-work") {
        if (fetchStudentWork?.data?.picture) {
          const arrayPictures = fetchStudentWork?.data?.picture.split(", ");
          for (const arrayPicture of arrayPictures) {
            const fileType = get_url_extension({ url: arrayPicture });
            if (
              fileType === "jpg" ||
              fileType === "jpeg" ||
              fileType === "png" ||
              fileType === "HEIC" ||
              fileType === "JPEG" ||
              fileType === "PNG" ||
              fileType === "JPG" ||
              fileType === "heic"
            ) {
              pictures.push({ src: arrayPicture, alt: "student's work" });
            } else {
              files.push({ fileType: fileType, url: arrayPicture });
            }
          }
          return {
            ...fetchStudentWork?.data,
            pictures: pictures,
            files: files,
          };
        } else if (!fetchStudentWork?.data.picture) {
          return fetchStudentWork?.data;
        }
      } else if (fetchStudentWork?.data?.status === "no-work") {
        return fetchStudentWork?.data;
      }
    });
  }, [fetchStudentWork.data]);

  useEffect(() => {
    setTeacher(() => {
      const teacher = localStorage.getItem("teacher");
      if (teacher) {
        return JSON.parse(teacher);
      }
    });
    initLightboxJS(
      process.env.NEXT_PUBLIC_LIGHTBOX_KEY as string,
      "individual"
    );
  }, []);

  // check file type
  function get_url_extension({ url }: { url?: any }): string {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  }

  return (
    <div
      className="  w-full h-full font-Kanit relative pb-96 bg-no-repeat bg-cover bg-top 
bg-[url('https://storage.googleapis.com/tatugacamp.com/backgroud/sea%20backgroud.png')]  "
    >
      <Head>
        <title>students - assignment</title>
        <meta
          name="viewport"
          content="width=device-width; initial-scale=1.0;"
        />
        <meta charSet="UTF-8" />
      </Head>
      {triggerShowFile && (
        <ShowSelectFile
          setTriggerShowFile={setTriggerShowFile}
          file={selectFile as File}
        />
      )}
      {triggerCreateStudentWork && (
        <CreateStudentWork
          fetchStudentWork={fetchStudentWork}
          body={assignment?.data?.description as string}
          setTriggerCreateStudentWork={setTriggerCreateStudentWork}
        />
      )}
      <header className="w-full fixed z-10 top-5 flex justify-between items-center ">
        <button
          aria-label="button go back to classroom"
          onClick={() => {
            setLoading(true);
            router.push({
              pathname: `/classroom/student/${router.query.studentId}`,
              query: {
                classroomId: router.query.classroomId,
              },
            });
          }}
          className="w-10 h-10  bg-orange-500  ring-2 ring-white rounded-lg mt-2 ml-5 cursor-pointer group
    flex items-center justify-center active:scale-110 hover:scale-110 transition duration-150"
        >
          <div className="text-2xl text-white flex items-center justify-center group-hover:scale-110 transition duration-150 ">
            <RiArrowGoBackFill />
          </div>
        </button>
        <div
          className="w-40 md:w-60 bg-white h-max md:h-20 border-b-2 border-t-2 border-r-0
     border-blue-500 rounded-l-2xl flex flex-col py-2 pl-2 md:pl-10 gap-0 truncate font-Kanit  border-l-2 border-solid"
        >
          <span className="font-semibold text-blue-500 md:text-2xl truncate">
            {classroom.data?.title}
          </span>
          <span className="text-xs md:text-sm truncate">
            {classroom?.data?.level}
          </span>
          <span className="text-xs md:text-sm  truncate">
            {classroom?.data?.description}
          </span>
        </div>
      </header>
      <main className="w-full flex flex-col items-center justify-start pt-28 md:pt-40 gap-2">
        <section className="w-60 md:w-96 lg:w-3/4 flex gap-2 items-center justify-center mb-5">
          <div className="  text-center w-60 md:w-96 lg:w-3/4">
            <span className="font-Kanit text-2xl  break-words  font-bold text-black ">
              {assignment?.data?.title}
            </span>
          </div>
        </section>
        <section
          className="w-full relative max-w-2xl mt-10 grid gap-2 p-2 ring-2 ring-blue-500 
      bg-white  "
        >
          <div className="absolute w-full  flex flex-col -top-6 items-center justify-center">
            {student?.data?.picture ? (
              <div className="w-28   h-28 ring-4 ring-white rounded-full overflow-hidden relative bg-orange-400">
                <Image
                  sizes="(max-width: 768px) 100vw"
                  src={student?.data?.picture}
                  fill
                  alt="student image"
                  objectFit="cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full overflow-hidden relative bg-blue-400 flex items-center justify-center">
                <div className="font-Kanit font-bold text-2xl uppercase text-center text-white ">
                  {student?.data?.firstName.charAt(0)}
                </div>
              </div>
            )}
          </div>
          <div className="mt-20 w-full text-center">
            <div className="font-Kanit font-medium text-lg mt-1">
              เลขที่ {student?.data?.number}
            </div>
            <div className="font-Kanit font-medium text-lg mt-1">
              {student?.data?.firstName} {student?.data?.lastName}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-80">
              <div className="flex gap-4 w-full justify-start items-center ">
                <div className="text-right">มอบหมายโดย</div>
                <div className="flex gap-2 justify-start items-center">
                  <span className="font-semibold text-blue-500 text-lg">
                    {teacher?.firstName} {teacher?.lastName}
                  </span>
                </div>
              </div>
              <div className="flex gap-4 w-full justify-start items-center ">
                <div className="text-right">กำหนดส่ง</div>
                <div>
                  {fetchStudentWork.isLoading || loading ? (
                    <Skeleton variant="rounded" width="100%" height={20} />
                  ) : (
                    <div className="col-span-2 font-semibold">{deadline}</div>
                  )}
                </div>
              </div>
              <div className="flex gap-4 w-full justify-start items-center ">
                <div className="text-right">คะแนน</div>
                <div>
                  {fetchStudentWork.isFetching || loading ? (
                    <Skeleton variant="rounded" width="100%" height={20} />
                  ) : (
                    <div className="text-lg">
                      <span>{!studentWork?.score ? 0 : studentWork.score}</span>
                      <span>/</span>
                      <span>{assignment?.data?.maxScore}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-4 w-full justify-start items-center ">
                <div className="text-right">สถานะ</div>
                {fetchStudentWork.isFetching ? (
                  <div>
                    <Skeleton width="100%" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {studentWork?.status === "no-work" && isDue && (
                      <div
                        className="w-max px-2 py-1 bg-red-500  rounded-lg border-2 border-solid border-white
      flex items-center justify-center"
                      >
                        <span className="flex items-center justify-center font-Kanit text-white flex-col">
                          <div className="text-sm">
                            <span>เลยกำหนดส่ง</span>
                          </div>
                        </span>
                      </div>
                    )}
                    {studentWork?.status === "no-work" && !isDue && (
                      <div
                        className="w-max px-2 py-1 bg-orange-500  rounded-lg border-2 border-solid border-white
      flex items-center justify-center"
                      >
                        <span className="flex items-center justify-center font-Kanit text-white flex-col">
                          <div className="text-sm">
                            <span>ไม่ส่งงาน</span>
                          </div>
                        </span>
                      </div>
                    )}
                    {studentWork?.status === "have-work" &&
                      studentWork.isSummited === false && (
                        <div
                          className="w-max px-2 bg-yellow-500 py-1 rounded-lg border-2 border-solid border-white
      flex items-center justify-center"
                        >
                          <span className="flex items-center justify-center font-Kanit text-white flex-col">
                            <div className="text-sm">
                              <span>รอตรวจ</span>
                            </div>
                          </span>
                        </div>
                      )}
                    {studentWork?.status === "have-work" &&
                      studentWork.isSummited === true && (
                        <div
                          className="w-max px-2 bg-green-500 py-1 rounded-lg border-2 border-solid border-white
      flex items-center justify-center"
                        >
                          <span className="flex items-center justify-center font-Kanit text-white flex-col">
                            <div className="text-sm">
                              <span>ตรวจแล้ว</span>
                            </div>
                          </span>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <ShowFilesListsOnAssignment
            assignment={assignment}
            setSelectFile={setSelectFile}
            setTriggerShowFile={setTriggerShowFile}
          />
          <div
            className={` ${
              loadingTiny
                ? "w-0 h-0 opacity-0"
                : "h-96 max-h-96  w-full opacity-100 "
            }  lg:text-lg rounded-md max-w-2xl overflow-auto`}
          >
            <Editor
              disabled={true}
              apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
              init={{
                setup: function (editor) {
                  editor.on("init", function () {
                    setLoadingTiny(() => false);
                  });
                },
                height: "100%",
                width: "100%",
                menubar: false,
                toolbar: false,
              }}
              initialValue={assignment?.data?.description}
              value={assignment?.data?.description}
            />
          </div>
          {loadingTiny && (
            <Skeleton variant="rectangular" width="100%" height={400} />
          )}
        </section>
      </main>
      <footer>
        <FooterAssignment
          student={student}
          studentWork={studentWork}
          assignment={assignment}
          fetchStudentWork={fetchStudentWork}
          setTriggerCreateStudentWork={setTriggerCreateStudentWork}
        />
      </footer>
    </div>
  );
}

export default Index;
