import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import { StudentGetClassroom } from '../../../service/student/classroom';
import { Skeleton } from '@mui/material';
import {
  ReadQrCodeAttendance,
  UpdateQrCodeAttendance,
} from '../../../service/student/attendance';
import { Combobox, Transition } from '@headlessui/react';
import { BsCheck2 } from 'react-icons/bs';
import { HiChevronUpDown } from 'react-icons/hi2';
import { AiFillCheckCircle } from 'react-icons/ai';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import Loading from '../../../components/loading/loading';
import Swal from 'sweetalert2';
const progressMenus = [{ title: 'เลือกชื่อ' }, { title: 'เช็คชื่อ' }];
const checkList = [
  {
    titleThai: 'เข้าเรียน',
    titleEnglish: 'Present',
    bgColor: 'bg-green-500',
  },
  {
    titleThai: 'ลา',
    titleEnglish: 'Take a leave',
    bgColor: 'bg-yellow-500',
  },
  {
    titleThai: 'ป่วย',
    titleEnglish: 'sick',
    bgColor: 'bg-blue-500',
  },
  {
    titleThai: 'ขาด',
    titleEnglish: 'Absent',
    bgColor: 'bg-red-500',
  },
  {
    titleThai: 'สาย',
    titleEnglish: 'late',
    bgColor: 'bg-orange-500',
  },
];
function AttendanceQrCode() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [people, setPeople] = useState();
  const [query, setQuery] = useState('');
  const [reCheck, setReCheck] = useState();
  const [activeAttendance, setActiveAttendance] = useState(0);
  const [selected, setSelected] = useState(people?.[0]);
  const [chooseStudent, setChooseStudent] = useState(false);
  const [expireAt, setExpireAt] = useState();
  const [timeLeft, setTimeLeft] = useState();
  const [progress, setProgress] = useState(-1);
  const classroom = useQuery(
    ['classroom'],
    () => StudentGetClassroom({ classroomId: router.query.classroomId }),
    {
      enabled: false,
    },
  );
  const qrCode = useQuery(
    ['qrCode'],
    () =>
      ReadQrCodeAttendance({
        classroomId: router.query.classroomId,
        attendanceQRCodeId: router.query.attendanceQRCodeId,
      }),
    {
      enabled: false,
    },
  );
  useEffect(() => {
    setExpireAt(() => qrCode?.data?.qrCodeAttendance?.exipreAt);
  }, [qrCode.data]);
  console.log(expireAt);
  function countdownTimer(expireAt) {
    const targetDate = new Date(expireAt).getTime(); // Convert the expiration time to milliseconds
    const now = new Date().getTime(); // Get the current time in milliseconds
    const timeDifference = targetDate - now;

    // Check if the target date has already passed
    if (timeDifference <= 0) {
      return 'Expired'; // Return a message indicating expiration
    }

    // Calculate time units
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    if (expireAt) {
      setTimeLeft(countdownTimer(expireAt));

      // Update time left every second
      const interval = setInterval(() => {
        setTimeLeft(countdownTimer(expireAt));
      }, 1000);

      // Clear interval when the countdown reaches 0
      return () => clearInterval(interval);
    }
  }, [expireAt]);

  const date = new Date(qrCode?.data?.qrCodeAttendance?.date);
  const formattedDate = date.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format
  });

  // set people
  useEffect(() => {
    if (qrCode.isError) {
      setPeople('');
    }
    setPeople(() => qrCode?.data?.student);
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

  const filteredPeople =
    query === ''
      ? people
      : people?.filter((person) =>
          person.student.firstName
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, '')),
        );

  const handleCheckAttendance = async () => {
    try {
      setIsLoading(() => true);
      await UpdateQrCodeAttendance({
        studentId: selected.student.id,
        attendanceId: selected.id,
        attendanceQRCodeId: qrCode.data.qrCodeAttendance.id,
        attendance: reCheck,
      });
      Swal.fire('สำเร็จ', 'เช็คชื่อเรีนยร้อย', 'success');
      setIsLoading(() => false);
    } catch (err) {
      Swal.fire(
        'เกิดข้อผิดพลาด',
        err?.props?.response?.data?.message?.toString(),
        'error',
      );
      setIsLoading(() => false);
      console.log(err);
    }
  };

  return (
    <div className="flex font-Kanit flex-col items-center justify-start">
      <Head>
        <title>เช็คชื่อด้วย qr code</title>
      </Head>
      <header
        className=" bg-cover h-60 w-full  flex items-center justify-center   bg-center bg-no-repeat 
  bg-[url('https://storage.googleapis.com/tatugacamp.com/backgroud/sea%20backgroud.png')]"
      >
        <div className="w-60 flex flex-col p-3 items-center  h-max bg-white rounded-md">
          <h1 className="text-lg font-semibold border-b-2 border-black ">
            เช็คชื่อด้วย Qr code
          </h1>

          <h2 className="text-lg font-semibold text-center text-blue-700 truncate w-52">
            {classroom.isLoading ? (
              <Skeleton variant="text" />
            ) : (
              classroom?.data?.title
            )}
          </h2>
          <h3
            className="text-sm font-normal text-center  px-2  rounded-lg text-black 
           truncate w-fit max-w-[13rem]"
          >
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
          <h4
            className={`text-base font-normal text-center ${
              qrCode.isError ? 'bg-red-600' : 'bg-blue-500'
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
          </h4>
        </div>
      </header>
      <main className="mt-4">
        <span className="text-xl font-semibold text-blue-700">
          {chooseStudent
            ? `${selected.student.firstName} ${selected.student?.lastName}`
            : qrCode.isError
            ? 'หมดเวลาการเช็คชื่อ'
            : `โปรดเลือกชื่อของตัวเอง`}
        </span>
        {qrCode.isLoading ? (
          <Skeleton variant="rectangular" height={40} />
        ) : chooseStudent ? (
          <section className="w-80">
            <h1>เลขที่ {selected.student.number}</h1>
            <div className="grid items-center w-10/12 md:w-full h-max grid-cols-3 place-items-center my-2">
              {checkList.map((attendance, index) => {
                return (
                  <div
                    onClick={() => {
                      setReCheck(() => {
                        if (index === 0) {
                          return {
                            absent: false,
                            present: true,
                            holiday: false,
                            sick: false,
                            late: false,
                            warn: false,
                          };
                        } else if (index === 1) {
                          return {
                            absent: false,
                            present: false,
                            holiday: true,
                            sick: false,
                            late: false,
                            warn: false,
                          };
                        } else if (index === 2) {
                          return {
                            absent: false,
                            present: false,
                            holiday: false,
                            sick: true,
                            late: false,
                            warn: false,
                          };
                        } else if (index === 3) {
                          return {
                            absent: true,
                            present: false,
                            holiday: false,
                            sick: false,
                            late: false,
                            warn: false,
                          };
                        } else if (index === 4) {
                          return {
                            absent: false,
                            present: false,
                            holiday: false,
                            sick: false,
                            late: true,
                            warn: false,
                          };
                        }
                      });
                      setActiveAttendance(index);
                    }}
                    key={index}
                    className={`
                  
                  ${attendance.bgColor}
                  w-max min-w-[5rem] h-8 text-center flex items-center justify-center text-white rounded-lg cursor-pointer 
                  border-2 border-solid hover:scale-105 transition duration-150 ${
                    activeAttendance === index ? 'border-black' : 'border-white'
                  }
                  
                  `}
                  >
                    {attendance.titleThai}
                  </div>
                );
              })}
            </div>
            {isLoading ? (
              <Loading />
            ) : (
              <button
                onClick={handleCheckAttendance}
                className="px-4 py-1 mt-5 hover:bg-green-800 active:scale-110 transition duration-150 bg-green-600 rounded-full
         text-green-200 flex justify-center items-center gap-2 ring-2 ring-green-400 drop-shadow-md"
              >
                เช็คชื่อ <AiFillCheckCircle />
              </button>
            )}
          </section>
        ) : qrCode.isError ? (
          <h2>Time is up please contact your teacher</h2>
        ) : (
          <Combobox
            value={selected}
            onChange={(e) => {
              setProgress(() => 0);
              setSelected(() => e);
            }}
          >
            <div className="relative ">
              <div
                className="relative w-80 cursor-default overflow-hidden rounded-lg ring-2 ring-blue-500
                    text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white
                     focus-visible:ring-opacity-75 focus-visible:ring-offset-2
                      focus-visible:ring-offset-teal-300 sm:text-sm"
              >
                <Combobox.Input
                  autoComplete="off"
                  className="w-full border-none  py-2 pl-3 pr-10 text-sm leading-5 
                       text-gray-900 focus:ring-0 focus:border-none outline-none
                      active:border-none"
                  displayValue={(person) =>
                    `${person.student.firstName}  ${person?.student.lastName}`
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
                afterLeave={() => setQuery('')}
              >
                <Combobox.Options
                  className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md
               list-none pl-0 bg-white py-1 text-base shadow-lg ring-1 ring-black
                ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  {filteredPeople?.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    filteredPeople?.map((person) => (
                      <Combobox.Option
                        key={person.student.id}
                        className={({ active }) =>
                          `relative cursor-pointer w-full select-none z-40 py-2 pl-10 pr-4 ${
                            active
                              ? 'bg-[#EDBA02] text-white'
                              : 'text-gray-900 bg-white'
                          }`
                        }
                        value={person}
                      >
                        {({ selected, active }) => (
                          <>
                            <div
                              className={` w-full flex border-b-[1px] border-black py-1 justify-between ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              <div>
                                {person.student.firstName}{' '}
                                {person?.student.lastName}{' '}
                              </div>
                              {person.isCheck === true && (
                                <div className="bg-green-400 rounded-lg p-1">
                                  เช็คชื่อแล้ว
                                </div>
                              )}
                            </div>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-white' : 'text-teal-600'
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
        )}
      </main>
      <footer>
        <ul className="list-none flex justify-center gap-2 items-center pl-0 w-80 mt-10">
          {progressMenus.map((list, index) => {
            return (
              <li key={index}>
                <span>{list.title}</span>
                <div
                  className={`w-40 h-[2px]  ${
                    progress >= index ? 'bg-green-600' : 'bg-gray-400'
                  }`}
                ></div>
              </li>
            );
          })}
        </ul>
        {selected &&
          (chooseStudent ? (
            <button
              onClick={() => setChooseStudent(() => false)}
              className="px-4 py-1 mt-5 hover:bg-blue-800 active:scale-110 transition duration-150 bg-blue-600 rounded-full
         text-blue-200 flex justify-center items-center gap-2 ring-2 ring-blue-400 drop-shadow-md"
            >
              <MdOutlineArrowBackIos />
              กลับ
            </button>
          ) : (
            <button
              onClick={() => setChooseStudent(() => true)}
              className="px-4 py-1 mt-5 hover:bg-green-800 active:scale-110 transition duration-150 bg-green-600 rounded-full
         text-green-200 flex justify-center items-center gap-2 ring-2 ring-green-400 drop-shadow-md"
            >
              เลือกชื่อ
              <AiFillCheckCircle />
            </button>
          ))}
        <div className="mt-5">
          <h2 className="font-bold text-lg text-red-500">เหลือเวลาอีก</h2>
          <ul className="flex justify-start items-center gap-2">
            <li>
              <span className="font-bold">{timeLeft?.days}</span> วัน
            </li>
            <li>
              <span className="font-bold">{timeLeft?.hours}</span> ชั่วโมง
            </li>
            <li>
              <span className="font-bold">{timeLeft?.minutes}</span> นาที
            </li>
            <li>
              <span className="font-bold">{timeLeft?.seconds}</span> วินาที
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default AttendanceQrCode;
