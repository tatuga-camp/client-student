import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { StudentGetAllScoreService } from "../../../../service/student/score";
import { StudentGetClassroomService } from "../../../../service/student/classroom";
import {
  GetStudentService,
  UpdateStudentService,
} from "../../../../service/student/student";
import { GetAllAssignmentService } from "../../../../service/student/assignment";
import { GetAttendancesService } from "../../../../service/student/attendance";
import { MdWork } from "react-icons/md";
import { HiOutlineHandRaised } from "react-icons/hi2";
import { GrScorecard } from "react-icons/gr";
import Swal from "sweetalert2";
import AdBannerStudent from "../../../../components/ads/adBannerStudent";
import Head from "next/head";
import { IoHome } from "react-icons/io5";
import Image from "next/image";
import { Skeleton } from "@mui/material";
import { BsImageFill } from "react-icons/bs";
import AttendanceStatus from "../../../../components/studnet/attendanceStatus";
import Link from "next/link";
import ScoreStatus from "../../../../components/studnet/scoreStatus";
import AssignmentStatus from "../../../../components/studnet/assignmentStatus";

interface Menu {
  title: string;
  icon: React.ReactNode;
  color: string;
}

function Index() {
  const router = useRouter();
  const [classroomCode, setClassroomCode] = useState();
  const [activeMenu, setActiveMenu] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File>();
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null | undefined
  >();
  const [menus, setMenus] = useState<Menu[]>();

  const totalScore = useQuery({
    queryKey: ["student-totalScore"],
    queryFn: () =>
      StudentGetAllScoreService({
        studentId: router.query.studentId as string,
        classroomId: router.query.classroomId as string,
      }),
    enabled: false,
  });
  const classroom = useQuery({
    queryKey: ["classroom"],
    queryFn: () =>
      StudentGetClassroomService({
        classroomId: router?.query?.classroomId as string,
      }),
    enabled: false,
  });

  const student = useQuery({
    queryKey: ["student"],
    queryFn: () =>
      GetStudentService({ studentId: router.query.studentId as string }),
    enabled: false,
  });

  const assignments = useQuery({
    queryKey: ["assignments-student"],
    queryFn: () =>
      GetAllAssignmentService({
        studentId: router.query.studentId as string,
        classroomId: router.query.classroomId as string,
      }),
    enabled: false,
  });
  const attendances = useQuery({
    queryKey: ["attendances"],
    queryFn: () =>
      GetAttendancesService({
        studentId: router.query.studentId as string,
        classroomId: router.query.classroomId as string,
      }),
    enabled: false,
  });

  useEffect(() => {
    setMenus(() => {
      if (classroom?.data?.allowStudentsToViewScores) {
        totalScore.refetch();
        return [
          {
            title: "ชิ้นงาน",
            icon: <MdWork />,
            color: "#EDBA02",
          },
          {
            title: "มาเรียน",
            icon: <HiOutlineHandRaised />,
            color: "#00B451",
          },
          {
            title: "คะแนนรวม",
            icon: <GrScorecard />,
            color: "#9C2CD1",
          },
        ];
      } else {
        return [
          {
            title: "ชิ้นงาน",
            icon: <MdWork />,
            color: "bg-yellow-400",
          },
          {
            title: "การมาเรียน",
            icon: <HiOutlineHandRaised />,
            color: "bg-gray-400",
          },
        ];
      }
    });
  }, [classroom.isSuccess]);

  useEffect(() => {
    setClassroomCode(() => {
      const rawClassroomCode = localStorage.getItem("classroomCode");
      const classroomCode = JSON.parse(rawClassroomCode as string);
      return classroomCode;
    });
    if (router.isReady) {
      student.refetch();
      assignments.refetch();
      attendances.refetch();
      classroom.refetch();
    }
  }, [router.isReady]);

  //handle sumit to update student data
  const handleSummitEditStudentData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      return Swal.fire(
        "No file chosen❗",
        "please select one image to be your avatar",
        "error"
      );
    }
    try {
      setLoading(() => true);
      const formData = new FormData();
      formData.append("file", file);
      await UpdateStudentService({
        formData,
        studentId: student.data?.id as string,
      });
      await student.refetch();
      Swal.fire("success", "เปลี่ยนรูปโปรไฟล์สำเร็จ", "success");
      document.body.style.overflow = "auto";
      setSelectedImage(() => null);
    } catch (err: any) {
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
      document.body.style.overflow = "auto";
      setSelectedImage(() => null);
    }
  };

  //handle profile update
  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    setFile(() => file);
    const reader = new FileReader();
    reader.onload = function (e: ProgressEvent<FileReader>) {
      const result = e.target?.result;
      document.body.style.overflow = "hidden";
      setSelectedImage(() => e.target?.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  return (
    <div
      className={` w-full bg-white  ${
        assignments?.data?.length && assignments?.data?.length > 2
          ? "h-full min-h-screen"
          : "h-screen"
      }  md:h-full md:pb-40 lg:pb-96 lg:h-full`}
    >
      <AdBannerStudent
        data_ad_slot="1866874180"
        data_ad_format="auto"
        data_full_width_responsive="true"
      />
      <Head>
        <title>student - homepage</title>
        <meta
          name="viewport"
          content="width=device-width; initial-scale=1.0;"
        />
        <meta charSet="UTF-8" />
      </Head>
      <header className="relative h-60">
        <Image
          fill
          alt="image cover"
          quality={50}
          className="object-cover"
          src="https://storage.googleapis.com/tatugacamp.com/backgroud/sea%20backgroud.png"
        />

        <nav className="fixed z-20 top-3  flex justify-between md:top-10 items-center w-full ">
          <div
            role="button"
            aria-label="button go back to classroom"
            onClick={() =>
              router.push({
                pathname: `/classroom/student`,
                query: {
                  classroomCode: classroomCode,
                },
              })
            }
            className="w-10 ml-5 h-10 md:w-12 md:h-12 bg-orange-500 border-2 border-solid border-white cursor-pointer rounded-lg 
    flex items-center justify-center active:bg-orange-500 hover:scale-110 transition duration-150"
          >
            <div className="text-2xl text-white flex items-center justify-center ">
              <IoHome />
            </div>
          </div>
          <div
            className="w-40 md:w-60 bg-white md:h-20 border-b-2 border-t-2 border-r-0
     border-blue-500 rounded-l-2xl flex flex-col py-2 pl-2 md:pl-10 gap-0 
     truncate font-Kanit h-max  border-l-2 border-solid"
          >
            <span className="font-semibold  text-blue-500 md:text-2xl truncate">
              {classroom?.data?.title}
            </span>
            <span className="text-xs md:text-sm truncate">
              {classroom?.data?.level}
            </span>
            <span className="text-xs md:text-sm  truncate">
              {classroom?.data?.description}
            </span>
          </div>
        </nav>
      </header>
      <main className="mt-[-4.5rem] w-full h-max flex   items-center justify-start flex-col  gap-3 relative ">
        <header className="flex flex-col justify-center items-center gap-5 md:w-96">
          <div className=" flex items-center justify-center relative ">
            {student?.data?.picture && (
              <div
                className="w-40 h-40 md:w-52 md:h-52 relative rounded-full
           overflow-hidden ring-4 ring-white bg-[#EDBA02]"
              >
                {student.isFetching ? (
                  <Skeleton variant="rectangular" width="100%" height="100%" />
                ) : (
                  <Image
                    sizes="(max-width: 768px) 100vw"
                    priority={true}
                    alt="student picture profile"
                    src={student?.data?.picture}
                    fill
                    className="object-cover  "
                  />
                )}
              </div>
            )}
            <label
              htmlFor="dropzone-file"
              className="absolute w-8 h-8 bg-white text-xl flex items-center justify-center rounded-md bottom-0 right-0"
            >
              <BsImageFill />
              <input
                id="dropzone-file"
                onChange={handleFileInputChange}
                type="file"
                accept="image/png, image/gif, image/jpeg"
                className="hidden"
              />
            </label>
          </div>
          {selectedImage && (
            <div className="">
              <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-40 flex flex-col justify-center items-center gap-5">
                <div className="w-28 h-28 relative">
                  <Image
                    fill
                    sizes="(max-width: 768px) 100vw"
                    src={selectedImage as string}
                    alt="Selected Image"
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-5">
                  <button
                    onClick={handleSummitEditStudentData}
                    className="w-40 bg-green-500  font-Kanit py-2 rounded-lg hover:scale-105 transition
              active:ring-2 ring-black text-white"
                  >
                    ยืนยัน
                  </button>
                  <button
                    onClick={() => {
                      document.body.style.overflow = "auto";
                      setSelectedImage(() => null);
                    }}
                    className="w-40 bg-red-700  font-Kanit py-2 rounded-lg hover:scale-105 transition
              active:ring-2  ring-black text-white"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>

              <div
                onClick={() => {
                  setSelectedImage(() => null);
                  document.body.style.overflow = "auto";
                }}
                className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto z-10 bg-black/80 "
              ></div>
            </div>
          )}

          <div className="w-full justify-center flex flex-col items-center  text-center ">
            <div className=" font-Kanit font-normal flex gap-2">
              {student.isFetching ? (
                <Skeleton variant="text" width={100} />
              ) : (
                <span className="text-black text-xl">
                  เลขที่ {student?.data?.number}
                </span>
              )}
            </div>
            <div className="text-white font-Kanit font-normal flex gap-2">
              {student.isFetching ? (
                <Skeleton variant="text" width={200} />
              ) : (
                <div className="flex gap-4 text-2xl md:text-xl font-semibold text-[#2C7CD1]">
                  <span>
                    {student?.data?.firstName} {student?.data?.lastName}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-1 flex-wrap  w-full font-Kanit  justify-center  ">
            {menus?.map((menu, index) => {
              return (
                //Menu btn
                <button
                  key={index}
                  onClick={() => setActiveMenu(() => index)}
                  className={`w-max px-2 h-10 rounded-md  ${
                    activeMenu === index
                      ? ` drop-shadow-lg  rounded-[1.344rem] bg-[${menu.color}]  text-white  `
                      : `rounded-[1.344rem] bg-white text-[${menu.color}] border-solid border-2 border-[${menu.color}] `
                  }  items-center  flex justify-center hover:scale-110 
             gap-2 transition duration-150 `}
                >
                  
                  <div className="w-8 h-8  flex items-center justify-center">
                    {menu.icon}
                  </div>
                  <span className="mr-3 -ml-2">
                    {menu.title}
                  </span>
                </button>
              );
            })}
          </div>
        </header>

        {!student && (
          <div className="text-xl text-white font-Kanit">
            ไม่พบผู้เรียนโปรดกลับสู่หน้าหลัก
          </div>
        )}

        <div className="flex flex-col justify-center items-center  w-full mt-8 max-w-xl">
          {activeMenu === 1 && <AttendanceStatus attendances={attendances} />}
          {assignments.isLoading && (
            <div className="flex flex-col justify-center items-center gap-5">
              <Skeleton variant="rectangular" width={300} height={100} />
              <Skeleton variant="rectangular" width={300} height={100} />
              <Skeleton variant="rectangular" width={300} height={100} />
              <Skeleton variant="rectangular" width={300} height={100} />
            </div>
          )}
          {activeMenu === 0 && (
            <AssignmentStatus assignments={assignments} student={student} />
          )}
          {activeMenu === 2 && <ScoreStatus totalScore={totalScore} />}
        </div>
      </main>
    </div>
  );
}

export default Index;
