import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { StudentGetClassroomService } from "../../../service/student/classroom";
import {
  AttendanceWithStudent,
  CheckLists,
  ReadQrCodeAttendanceService,
  UpdateQrCodeAttendanceService,
} from "../../../service/student/attendance";
import { Student } from "../../../models";
import Swal from "sweetalert2";
import { Skeleton } from "@mui/material";
import { checkList } from "../../../data/checkLists";
import Loading from "../../../components/loading/loading";
import { AiFillCheckCircle } from "react-icons/ai";
import { Combobox, Transition } from "@headlessui/react";
import { HiChevronUpDown } from "react-icons/hi2";
import { BsCheck2 } from "react-icons/bs";
import { MdOutlineArrowBackIos } from "react-icons/md";
import Image from "next/image";
import Head from "next/head";
import { attendanceOptions } from "../../../data/attendanceOptions";
import Success from "@/components/svg/success";
import { FaCheckCircle } from "react-icons/fa";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
const progressMenus = [{ title: "เลือกชื่อ" }, { title: "เช็คชื่อ" }];
function AttendanceQrCode() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<AttendanceWithStudent[]>([]);
  const [query, setQuery] = useState("");
  const [reCheck, setReCheck] = useState<CheckLists>({
    absent: false,
    present: true,
    holiday: false,
    sick: false,
    late: false,
    warn: false,
  });
  const [activeAttendance, setActiveAttendance] = useState<number>(0);
  const [selected, setSelected] = useState<AttendanceWithStudent>(
    students?.[0]
  );
  const [chooseStudent, setChooseStudent] = useState<boolean>(false);
  const [CheckAlready, setCheckAlready] = useState<boolean>(false);
  const [expireAt, setExpireAt] = useState<string>();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | "Expired">({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [showStatus,setShowStatus] = useState<boolean>(true);
  const [progress, setProgress] = useState(-1);
  const classroom = useQuery({
    queryKey: ["classroom"],
    queryFn: () =>
      StudentGetClassroomService({
        classroomId: router.query.classroomId as string,
      }),
    enabled: false,
  });

  const qrCode = useQuery({
    queryKey: ["qrCode"],
    queryFn: () =>
      ReadQrCodeAttendanceService({
        classroomId: router.query.classroomId as string,
        attendanceQRCodeId: router.query.attendanceQRCodeId as string,
      }),
    enabled: false,
  });

  useEffect(() => {
    setExpireAt(() => qrCode.data?.qrCodeAttendance.exipreAt as string);
  }, [qrCode.data]);

  function countdownTimer({
    expireAt,
  }: {
    expireAt: string;
  }): TimeLeft | "Expired" {
    const targetDate = new Date(expireAt).getTime(); // Convert the expiration time to milliseconds
    const now = new Date().getTime(); // Get the current time in milliseconds
    const timeDifference = targetDate - now;

    // Check if the target date has already passed
    if (timeDifference <= 0) {
      return "Expired"; // Return a message indicating expiration
    }

    // Calculate time units
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    if (expireAt) {
      setTimeLeft(() => countdownTimer({ expireAt }));

      // Update time left every second
      const interval = setInterval(() => {
        setTimeLeft(() => countdownTimer({ expireAt }));
      }, 1000);

      // Clear interval when the countdown reaches 0
      return () => clearInterval(interval);
    }
  }, [expireAt]);

  const date = new Date(qrCode.data?.qrCodeAttendance.date as string);
  const formattedDate = date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Use 24-hour format
  });

  // set students
  useEffect(() => {
    if (qrCode.isError) {
      setStudents(() => []);
    }
    setStudents(() => qrCode.data?.students as AttendanceWithStudent[]);
  }, [qrCode.data]);

  useEffect(() => {
    if (router.isReady) {
      classroom.refetch();
      qrCode.refetch();
      setReCheck(() => {
        return {
          absent: false,
          present: true,
          holiday: false,
          sick: false,
          late: false,
          warn: false,
        };
      });
    }
  }, [router.isReady]);

  const filteredStudents =
    query === ""
      ? students
      : students?.filter((student: AttendanceWithStudent) =>
          student.student.firstName
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  
  const handleCheckAttendance = async () => {
    try {
      setIsLoading(() => true);
      await UpdateQrCodeAttendanceService({
        studentId: selected.studentId,
        attendanceId: selected.id,
        attendanceQRCodeId: qrCode.data?.qrCodeAttendance.id as string,
        attendance: reCheck as CheckLists,
      });
      Swal.fire({
        title: "สำเร็จ",
        html: "เช็คชื่อเรียบร้อย",
        icon: "success",
      });
      setIsLoading(() => false);
      setCheckAlready(()=>true)
    } catch (err: any) {
      Swal.fire(
        "เกิดข้อผิดพลาด",
        err?.props?.response?.data?.message?.toString(),
        "error"
      );
      setIsLoading(() => false);
      console.error(err);
    }
  };
  return (
    <div className="flex font-Kanit flex-col items-center justify-start">
      <Head>
        <title>เช็คชื่อด้วย qr code</title>
      </Head>
      <header className=" bg-cover h-60 w-full relative  flex items-center justify-center">
        <Image
          src="https://storage.googleapis.com/tatugacamp.com/backgroud/sea%20backgroud.png"
          fill
          alt="cover image"
          className="object-cover -z-10"
        />
        {/* Head card */}
        <div className="w-60 flex flex-col p-3 items-center  h-max bg-white rounded-[2.5rem] border-solid border-2 border-[#2C7CD1]">
          <h1 className="text-lg font-bold  border-black ">
            ห้องเรียน
          </h1>

          <h3 className="text-[#F55E00] text-4xl font-semibold">{classroom.data?.classroomCode}</h3>

          <h2 className="text-lg font-semibold text-center text-[#2C7CD1] truncate w-52">
            {classroom.isLoading ? (
              <Skeleton variant="text" />
            ) : (
              classroom.data?.title
            )}
          </h2>
          <h3
            className="text-sm font-normal text-center  px-2  rounded-lg text-[#EDBA02]
       truncate w-fit max-w-[13rem]"
          > M.
            {classroom.isLoading ? (
              <Skeleton variant="text" width={100} />
            ) : (
              classroom?.data?.level
            )}
          </h3>
          <h4 className="text-sm font-normal text-center   text-black  truncate w-52  ">
            {classroom.isLoading ? (
              <Skeleton variant="text" />
            ) : (
              classroom?.data?.description
            
            )}
          </h4>
          {/* <h4
            className={`text-base font-normal text-center ${
              qrCode.isError ? "bg-red-600" : "bg-blue-500"
            }  rounded-md 
         text-white  truncate w-52  `}
          >
            {qrCode.isLoading ? (
              <Skeleton variant="text" />
            ) : qrCode.isError ? (
              `หมดเวลา`
            ) : (
              `วันที่ ${formattedDate}`
            )}
          </h4> */}
        </div>
      </header>
      <main className="mt-4">
        {/* Content : remaing time */}
        <div className="flex flex-col justify-center items-center">
          <span className="mt-2 mb-5 text-[#2C7CD1] text-2xl font-semibold">เช็คชื่อด้วย QR Code</span>
          <h2 className="text-base bg-red-500 text-white py-1 px-2 rounded-[1.25rem] ">เหลือเวลาอีก</h2>
          <ul className="mt-4 flex justify-start items-center gap-2 text-red-500 font-semibold">
            <li>
              <span className="">
                {timeLeft !== "Expired" && timeLeft.days}
              </span>{" "}
              วัน :
            </li>
            <li>
              <span className="">
                {timeLeft !== "Expired" && timeLeft.hours}
              </span>{" "}
              ชั่วโมง :
            </li>
            <li>
              <span className="">
                {timeLeft !== "Expired" && timeLeft.minutes}
              </span>{" "}
              นาที :
            </li>
            <li>
              <span className="">
                {timeLeft !== "Expired" && timeLeft.seconds}
              </span>{" "}
              วินาที 
            </li>
          </ul>
          <span className="mt-3  text-base font-semibold  text-black">
          {chooseStudent
            ? <div className="flex items-center justify-center text-center text-[#2C7CD1] text-3xl my-5">{selected.student.firstName} {selected?.student.lastName} </div> 
            : qrCode.isError
            ? "หมดเวลาการเช็คชื่อ"
            : `โปรดเลือกรายชื่อ`}
        </span>
        </div>

        <div className="flex items-center justify-center">
        {qrCode.isLoading ? (
          <Skeleton variant="rectangular" height={40} />
        ) : chooseStudent ? (
            // {/* Status */}
            // {/* {chooseStudent ? showStatus : showCombobox} */}
              showStatus && (
                <section className="flex flex-col justify-center items-center w-80 ">          
                <div className="grid items-center justify-center md:w-9/12  w-8/12 h-max grid-cols-2 gap-y-2 place-items-center my-2">
                  {checkList.map((attendance, index) => {
                    return (
                      <div
                        onClick={() => {
                          setReCheck(() => attendanceOptions[index]);
                          setActiveAttendance(index);
                        }}
                        key={index}
                        className={`
                 
                  w-max min-w-[6rem] h-10 text-center flex items-center rounded-full justify-center cursor-pointer 
                  border-2 border-solid hover:scale-105 transition duration-150 text-xl
                  ${
                    activeAttendance === index ? ` text-white bg-[${attendance.bgColor}]` : `text-[${attendance.bgColor}] border-[${attendance.bgColor}] bg-white`
                  }
                  
                  `}
                      >
                        {attendance.titleThai}
                      </div>
                    );
                  })}
                </div>
    
                {/* After select status -> checked */}
                {isLoading ? (
                  <Loading />
                ) : (
                  <div className="flex gap-2 ">
                      <button
                      onClick={() => setChooseStudent(() => false)}
                      className="px-4 py-1 mt-5 hover:bg-blue-800 active:scale-110 transition duration-150 bg-[#8d8d8d] rounded-full
                      text-white flex justify-center items-center gap-2 text-xl"
                      >
                      <MdOutlineArrowBackIos />
                      กลับ
                    </button> 
                    <button
                        onClick={() => {
                          handleCheckAttendance(); 
                          setShowStatus(() => false);
                        }}
                        className="px-4 py-1 mt-5 hover:bg-blue-800 active:scale-110 transition duration-150 bg-[#2C7CD1] rounded-full
                        text-white flex justify-center items-center gap-2 text-xl"
                      >
                        เช็คชื่อ 
                      </button>
                     
                  </div>
                  
                )}
              </section>
              )
         
        )
        
        
        
        : qrCode.isError ? (
          <h2>Time is up please contact your teacher</h2>
        ) : (
          <div className="flex flex-col justify-center items-center">
          <Combobox
            value={selected}
            onChange={(student: AttendanceWithStudent) => {
              setProgress(() => 0);
              setSelected(() => student);
            }}
          >
            <div className="relative ">
              <div
                className="mt-4 relative w-80 cursor-default overflow-hidden py-1 rounded-full ring-2 ring-blue-500
                text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white
                 focus-visible:ring-opacity-75 focus-visible:ring-offset-2
                  focus-visible:ring-offset-teal-300 sm:text-sm"
              >
                <Combobox.Input
                  autoComplete="off"
                  className="w-full font-semibold border-none text-xl px-5  py-1  pr-10  leading-5 
                   text-[#2C7CD1] focus:ring-0 focus:border-none outline-none
                  active:border-none"
                  displayValue={(studnet: AttendanceWithStudent) =>
                    `${studnet.student.firstName}  ${studnet.student.lastName}`
                  }
                  onChange={(event) => setQuery(event.target.value)}
                />

                <Combobox.Button
                  role="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-2 bg-transparent border-none"
                >
                  <HiChevronUpDown
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>

              </div>
              
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery("")}
              >
                <Combobox.Options
                  className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md
           list-none pl-0 bg-white py-1 text-base shadow-lg ring-1 ring-black
            ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  {filteredStudents?.length === 0 && query !== "" ? (
                    <div className="relative cursor-default select-none py-2 px-3 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    filteredStudents?.map((student: AttendanceWithStudent) => (
                      <Combobox.Option
                        key={student.id}
                        className={({ active }) =>
                          `relative cursor-pointer w-full select-none text-[0.8rem] z-40 py-2 pl-10 pr-4 ${
                            active
                              ? "bg-[#EDBA02] text-white"
                              : "text-[#2C7CD1] bg-white"
                          }`
                        }
                        value={student}
                      >
                        {({ selected, active }) => (
                          <>
                            <div
                              className={` w-full flex items-center py-1 border-b-[1px] border-black  justify-between  ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              <div>
                                {student.student.firstName}{" "} 
                                {student.student.lastName}{" "}
                              </div>
                              {student.isCheck === true && (
                                <div className="bg-green-400 rounded-lg px-1 text-black text-[0.6rem]">
                                  เช็คชื่อแล้ว
                                </div>
                              )}
                              
                            </div>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? "text-white" : "text-teal-600"
                                }`}
                              >
                                <BsCheck2
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
          <button
               onClick={() => {
                setChooseStudent(() => true);
                setShowStatus(() => true); // Add this line
              }}
              className="px-4 py-1 mt-8 hover:bg-blue-800 active:scale-110 transition duration-150 bg-[#2C7CD1] rounded-full
              text-white flex justify-center items-center gap-2 text-xl"
            >
              เลือก
            
            </button>
          </div>
          
        )}
        </div>
        
        
       
      </main>
      <footer>
        <div className="flex justify-center mb-[5rem] md:mb-[10rem]">
        {CheckAlready && 
            <div className="mt-3 flex flex-col items-center justify-center">
              <FaCheckCircle  className="text-[#00B451] text-[8rem]"/>
              <span className="mt-5 font-semibold text-[#00B451]"> เช็คชื่อเรียบร้อย</span>
              <button
                   onClick={() => {
                    setCheckAlready(() => false);
                    setChooseStudent(() => false);
                    
                  }}
                  className="px-4 py-1 mt-5 hover:bg-blue-800 active:scale-110 transition duration-150 bg-[#2C7CD1] rounded-full
                  text-white flex justify-center items-center gap-2 text-xl"
                  >
                  <MdOutlineArrowBackIos />
                  กลับ
                </button> 
             
            </div>
          }
        </div>
      </footer>
    </div>
  );
}

export default AttendanceQrCode;
