import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Editor } from '@tinymce/tinymce-react';
import { IoCaretBackOutline, IoDocumentText } from 'react-icons/io5';
import { Box, Skeleton, TextField } from '@mui/material';
import {
  DeleteMyWorkService,
  GetAssignment,
  GetMyWork,
  SummitWork,
} from '../../../../../../service/student/assignment';
import { SlideshowLightbox, initLightboxJS } from 'lightbox.js-react';
import Image from 'next/image';
import 'lightbox.js-react/dist/index.css';
import { CiFaceFrown } from 'react-icons/ci';
import Swal from 'sweetalert2';
import SendIcon from '@mui/icons-material/Send';
import {
  GetComments,
  PostComment,
} from '../../../../../../service/student/comment';
import Head from 'next/head';
import { GetStudent } from '../../../../../../service/student/student';
import Loading from '../../../../../../components/loading/loading';
import {
  BsFileEarmark,
  BsFileEarmarkCode,
  BsFillChatDotsFill,
  BsImageFill,
} from 'react-icons/bs';
import { FcVideoFile } from 'react-icons/fc';
import { FaFileAudio, FaRegFilePdf } from 'react-icons/fa';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { MdOutlineInventory2 } from 'react-icons/md';
import {
  AiFillDelete,
  AiOutlineCloudUpload,
  AiOutlinePlus,
} from 'react-icons/ai';
import { useSpring, animated } from '@react-spring/web';
import { FiRefreshCw } from 'react-icons/fi';
import ReactPlayer from 'react-player';
import { HiOutlineNewspaper } from 'react-icons/hi2';
import CreateStudentWork from '../../../../../../components/form/createStudentWork';
import { StudentGetClassroom } from '../../../../../../service/student/classroom';
import ShowSelectFile from '../../../../../../components/assignment/showSelectFile';

function Index() {
  const router = useRouter();
  const [springs, api] = useSpring(() => ({
    from: { y: 400 },
  }));

  const [loadingTiny, setLoadingTiny] = useState(true);
  const [triggerCreateStudentWork, setTriggerCreateStudentWork] =
    useState(false);
  const [teacher, setTeacher] = useState();
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(0);
  const [studentWork, setStudnetWork] = useState();
  const [deadline, setDeadline] = useState();
  const [fileSize, setFilesSize] = useState(0);
  const [isDue, setIsDue] = useState(false);
  const currentTime = new Date();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [studentSummit, setStudentSummit] = useState({
    body: '',
  });
  const [triggerShowFiles, setTiggerShowFiles] = useState(true);
  const [triggerShowWorksheet, setTriggerShowWorksheet] = useState(false);
  const [triggerMenu, setTriggerMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [triggerShowFile, setTriggerShowFile] = useState(false);
  const [selectFile, setSelectFile] = useState();
  const classroom = useQuery(
    ['classroom'],
    () => StudentGetClassroom({ classroomId: router?.query?.classroomId }),
    {
      enabled: router.isReady,
    },
  );
  const assignment = useQuery(
    ['assignment'],
    () => GetAssignment({ assignmentId: router.query.assignmentId }),
    {
      enabled: false,
    },
  );

  const comments = useQuery(
    ['comments'],
    () =>
      GetComments({
        assignmentId: assignment.data.id,
        studentId: router?.query?.studentId,
      }),
    {
      enabled: assignment.isSuccess,
    },
  );

  useEffect(() => {
    let deadlineSet = new Date(assignment?.data?.deadline);
    deadlineSet.setHours(23);
    deadlineSet.setMinutes(59);
    deadlineSet.setSeconds(0);
    if (currentTime > deadlineSet) {
      setIsDue(() => true);
    } else if (currentTime < deadlineSet) {
      setIsDue(() => false);
    }
    setDeadline(() => {
      const date = new Date(assignment?.data?.deadline);

      const formattedDate = date.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      return formattedDate;
    });
  }, [assignment.data]);

  const student = useQuery(
    ['student'],
    () => GetStudent({ studentId: router.query.studentId }),
    {
      enabled: false,
    },
  );

  const fetchStudentWork = useQuery(
    ['student-work'],
    () =>
      GetMyWork({
        studentId: router.query.studentId,
        assignmentId: router.query.assignmentId,
      }),
    {
      enabled: false,
    },
  );

  const handleSelectFile = ({ file }) => {
    document.body.style.overflow = 'hidden';
    setSelectFile(() => file);
    setTriggerShowFile(() => true);
  };

  useEffect(() => {
    setStudnetWork(() => {
      let pictures = [];
      let files = [];
      if (fetchStudentWork?.data?.data.status === 'have-work') {
        if (fetchStudentWork?.data?.data.picture) {
          const arrayPictures =
            fetchStudentWork?.data?.data.picture.split(', ');
          for (const arrayPicture of arrayPictures) {
            const fileType = get_url_extension(arrayPicture);
            if (
              fileType === 'jpg' ||
              fileType === 'jpeg' ||
              fileType === 'png' ||
              fileType === 'HEIC' ||
              fileType === 'JPEG' ||
              fileType === 'PNG' ||
              fileType === 'JPG' ||
              fileType === 'heic'
            ) {
              pictures.push({ src: arrayPicture, alt: "student's work" });
            } else {
              files.push({ fileType: fileType, url: arrayPicture });
            }
          }
          return {
            ...fetchStudentWork?.data?.data,
            picture: pictures,
            files: files,
          };
        } else if (!fetchStudentWork?.data?.data.picture) {
          return fetchStudentWork?.data?.data;
        }
      } else if (fetchStudentWork?.data?.data.status === 'no-work') {
        return fetchStudentWork?.data?.data;
      }
    });
  }, [fetchStudentWork.data]);

  const handleSummitWork = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      Swal.fire({
        title: 'ยืนยันการส่งงาน',
        text: 'คุณยังไม่ได้แนบไฟล์งาน แน่ใจใช่ไหมว่าจะส่ง?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const formFiles = new FormData();
            selectedFiles.forEach((file) => {
              formFiles.append('files', file);
            });
            formFiles.append('body', studentSummit.body);
            formFiles.getAll('body');
            await SummitWork({
              formFiles,
              studentId: router.query.studentId,
              assignmentId: assignment.data.id,
            });

            await fetchStudentWork.refetch();
            Swal.fire('success', 'ส่งงานแล้ว', 'success');
          } catch (err) {
            if (
              err?.props?.response?.data?.message ===
              "student's already summit their work"
            ) {
              Swal.fire(
                'error',
                'นักเรียนได้ส่งงานแล้ว ถ้าจะส่งใหม่ให้ติดต่อครูผู้สอนเพื่อลบงานเดิม',
                'error',
              );
            } else {
              Swal.fire(
                'error',
                err?.props?.response?.data?.message.toString(),
                'error',
              );
            }
            console.log(err);
          }
        }
      });
    } else if (selectedFiles.length > 0) {
      Swal.fire({
        title: 'ยืนยันการส่งงาน',
        text: 'นักเรียนแน่ใจหรือไม่ว่าจะส่งงาน? เนื่องจากส่งงานแล้วจะไม่สามารถลบงานได้ต้องติดต่อครูผู้สอน',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            setLoading(() => true);
            const formFiles = new FormData();
            selectedFiles.forEach((file) => {
              formFiles.append('files', file);
            });
            formFiles.append('body', studentSummit.body);
            formFiles.getAll('body');
            await SummitWork({
              formFiles,
              studentId: router.query.studentId,
              assignmentId: assignment.data.id,
            });
            setLoading(() => false);
            fetchStudentWork.refetch();
            Swal.fire('success', 'ส่งงานแล้ว', 'success');
          } catch (err) {
            setLoading(() => false);
            if (
              err?.props?.response?.data?.message ===
              "student's already summit their work"
            ) {
              Swal.fire(
                'error',
                'นักเรียนได้ส่งงานแล้ว ถ้าจะส่งใหม่ให้ติดต่อครูผู้สอนเพื่อลบงานเดิม',
                'error',
              );
            } else {
              Swal.fire('error', err?.props?.response?.data?.message, 'error');
            }
            console.log(err);
          }
        }
      });
    }
  };
  //set files to array
  const handleFileEvent = (e) => {
    const newFiles = Array.prototype.slice.call(e.target.files);
    let totalSize = 0;

    // Combine the existing selected files with the newly selected files
    const updatedSelectedFiles = [...selectedFiles, ...newFiles];

    for (let i = 0; i < updatedSelectedFiles.length; i++) {
      totalSize += updatedSelectedFiles[i].size;
    }

    const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
    setFilesSize(totalSizeInMB);

    setSelectedFiles(updatedSelectedFiles);
  };

  useEffect(() => {
    if (router.isReady) {
      student.refetch();
      fetchStudentWork.refetch();
      comments.refetch();
      assignment.refetch();
    }
  }, [router.isReady]);

  useEffect(() => {
    setTeacher(() => {
      const teacher = localStorage.getItem('teacher');
      return JSON.parse(teacher);
    });
    initLightboxJS(process.env.NEXT_PUBLIC_LIGHTBOX_KEY, 'individual');
  }, []);

  const handleSumitComment = async (e) => {
    try {
      e.preventDefault();
      await PostComment({
        assignmentId: assignment.data.id,
        studentId: router.query.studentId,
        body: studentSummit.body,
      });
      setStudentSummit((prev) => {
        return {
          ...prev,
          body: '',
        };
      });
      comments.refetch();
    } catch (err) {
      Swal.fire('error', err?.props?.response?.data?.message, 'error');
    }
  };

  // check file type
  function get_url_extension(url) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
  }

  const handleOpenTrigerMenu = () => {
    setTriggerMenu(() => true);
    api.start({
      from: {
        y: 400,
      },
      to: {
        y: 0,
      },
    });
  };

  const handleCloseTrigerMenu = () => {
    document.body.style.overflow = 'auto';
    setTriggerMenu(() => false);
    setActiveMenu(() => 4);
    api.start({
      from: {
        y: 0,
      },
      to: {
        y: 400,
      },
    });
  };

  const handleDeleteStudentWork = async ({ studentWorkId }) => {
    const name = student?.data?.data?.firstName;
    const replacedText = name.replace(/ /g, '_');
    let content = document.createElement('div');
    content.innerHTML =
      '<div>กรุณาพิมพ์ข้อความนี้</div> <strong>' +
      replacedText +
      '</strong> <div>เพื่อลบงาน</div>';
    const { value } = await Swal.fire({
      title: 'ยืนยันการลบชิ้นงาน',
      input: 'text',
      html: content,
      showCancelButton: true,
      inputValidator: (value) => {
        if (value !== replacedText) {
          return 'กรุณาพิมพ์ข้อความยืนยันให้ถูกต้อง';
        }
      },
    });
    if (value) {
      try {
        setIsLoading(() => true);
        await DeleteMyWorkService({
          studentId: router.query.studentId,
          classroomId: router.query.classroomId,
          studentWorkId: studentWork.id,
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        setIsLoading(() => false);
        location.reload();
      } catch (err) {
        setIsLoading(() => false);
        console.log(err);
        Swal.fire(
          'error!',
          err?.props?.response?.data?.message?.toString(),
          'error',
        );
      }
    }
  };

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
          file={selectFile}
        />
      )}
      {triggerCreateStudentWork && (
        <CreateStudentWork
          fetchStudentWork={fetchStudentWork}
          body={assignment?.data?.description}
          setTriggerCreateStudentWork={setTriggerCreateStudentWork}
        />
      )}
      <nav className="w-full fixed z-10 top-5 flex justify-between items-center ">
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
      <main className="w-full flex flex-col items-center justify-start pt-28 md:pt-40 gap-2">
        <div className="w-60 md:w-96 lg:w-3/4 flex gap-2 items-center justify-center mb-5">
          <div className="  text-center w-60 md:w-96 lg:w-3/4">
            <span className="font-Kanit text-2xl  break-words  font-bold text-black ">
              {assignment?.data?.title}
            </span>
          </div>
        </div>
        <div
          className="w-11/12 relative max-w-2xl mt-10 grid gap-2 p-4 rounded-lg ring-2 ring-blue-500 
          bg-white  "
        >
          <div className="absolute w-full  flex flex-col -top-6 items-center justify-center">
            {student?.data?.data?.picture ? (
              <div className="w-28   h-28 ring-4 ring-white rounded-full overflow-hidden relative bg-orange-400">
                <Image
                  sizes="(max-width: 768px) 100vw"
                  src={student?.data?.data?.picture}
                  fill
                  objectFit="cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full overflow-hidden relative bg-blue-400 flex items-center justify-center">
                <div className="font-Kanit font-bold text-2xl uppercase text-center text-white ">
                  {student?.data?.data?.firstName.charAt(0)}
                </div>
              </div>
            )}
          </div>
          <div className="mt-20 w-full text-center">
            <div className="font-Kanit font-medium text-lg mt-1">
              เลขที่ {student?.data?.data?.number}
            </div>
            <div className="font-Kanit font-medium text-lg mt-1">
              {student?.data?.data?.firstName} {student?.data?.data?.lastName}
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
                    {studentWork?.status === 'no-work' && isDue && (
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
                    {studentWork?.status === 'no-work' && !isDue && (
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
                    {studentWork?.status === 'have-work' &&
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
                    {studentWork?.status === 'have-work' &&
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
          <div className="w-full border-t-2 boder-black my-4">
            <div className="text-xl flex items-center gap-2">
              <span>ไฟล์แนบ</span>
              <BsFileEarmark />
            </div>
            <ul className="w-full h-max max-h-[20rem] grid p-5 gap-5 overflow-auto ">
              {assignment?.data?.files.map((file, index) => {
                if (
                  file.type === 'image/jpeg' ||
                  file.type === '' ||
                  file.type === 'image/png'
                ) {
                  return (
                    <div
                      onClick={() => handleSelectFile({ file: file })}
                      key={index}
                      className="w-full  select-none relative flex justify-start px-5 drop-shadow-sm 
                                  cursor-pointer  items-center gap-2 h-10 bg-sky-100 hover:scale-105 transition duration-75
                                 ring-2 ring-sky-500 rounded-xl"
                    >
                      <div className="flex items-center justify-center text-sky-700">
                        <BsImageFill />
                      </div>
                      <span className="w-max max-w-[10rem] md:max-w-[20rem] truncate text-sm ">
                        {file.name}
                      </span>
                    </div>
                  );
                } else if (
                  file.type === 'video/mp4' ||
                  file.type === 'video/quicktime'
                ) {
                  return (
                    <div
                      onClick={() => handleSelectFile({ file: file })}
                      key={index}
                      className="w-full select-none relative flex justify-start px-5
                                  drop-shadow-sm cursor-pointer  items-center gap-2 h-10 bg-red-100 
                                  hover:scale-105 transition duration-75
                               ring-2 ring-red-500 rounded-xl"
                    >
                      <div className="flex items-center justify-center text-red-700">
                        <FcVideoFile />
                      </div>
                      <span className="w-max max-w-[10rem] md:max-w-[20rem] truncate text-sm ">
                        {file.name}
                      </span>
                    </div>
                  );
                } else if (
                  file.type === 'audio/mpeg' ||
                  file.type === 'audio/mp3'
                ) {
                  return (
                    <div
                      onClick={() => handleSelectFile({ file: file })}
                      key={index}
                      className="w-full select-none relative flex justify-start px-5
                                drop-shadow-sm cursor-pointer  items-center gap-2 h-10 bg-pink-100 
                                hover:scale-105 transition duration-75
                             ring-2 ring-pink-500 rounded-xl"
                    >
                      <div className="flex items-center justify-center text-pink-700">
                        <FaFileAudio />
                      </div>
                      <span className="w-max max-w-[10rem] md:max-w-[20rem] truncate text-sm ">
                        {file.name}
                      </span>
                    </div>
                  );
                } else if (file.type === 'application/pdf') {
                  return (
                    <div
                      onClick={() => handleSelectFile({ file: file })}
                      key={index}
                      className="w-full select-none relative flex justify-start px-5 
                                  drop-shadow-sm cursor-pointer  
                                  items-center gap-2 h-10 bg-sky-100 hover:scale-105 transition duration-75
                                 ring-2 ring-green-500 rounded-xl"
                    >
                      <div className="flex items-center justify-center text-green-700">
                        <FaRegFilePdf />
                      </div>
                      <span className="w-max max-w-[10rem] md:max-w-[20rem] truncate text-sm ">
                        {file.name}
                      </span>
                    </div>
                  );
                } else if (
                  file.type ===
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ) {
                  return (
                    <div
                      onClick={() => handleSelectFile({ file: file })}
                      key={index}
                      className="w-full  select-none relative flex justify-start px-5
                              drop-shadow-sm cursor-pointer  items-center gap-2 h-10 bg-blue-100 
                              hover:scale-105 transition duration-75
                           ring-2 ring-blue-500 rounded-xl"
                    >
                      <div className="flex items-center justify-center text-blue-700">
                        <IoDocumentText />
                      </div>
                      <span className="w-max max-w-[10rem] md:max-w-[20rem] truncate text-sm ">
                        {file.name}
                      </span>
                    </div>
                  );
                } else {
                  return (
                    <div
                      onClick={() => handleSelectFile({ file: file })}
                      key={index}
                      className="w-full select-none relative flex justify-start px-5
                              drop-shadow-sm cursor-pointer  items-center gap-2 h-10 bg-purple-100 
                              hover:scale-105 transition duration-75
                           ring-2 ring-purple-500 rounded-xl"
                    >
                      <div className="flex items-center justify-center text-purple-700">
                        <BsFileEarmarkCode />
                      </div>
                      <span className="w-max max-w-[10rem] md:max-w-[20rem] truncate text-sm ">
                        {file.name}
                      </span>
                    </div>
                  );
                }
              })}
            </ul>
          </div>
          <div
            className={` ${
              loadingTiny
                ? 'w-0 h-0 opacity-0'
                : 'h-96 max-h-96  w-full opacity-100 '
            }  lg:text-lg rounded-md max-w-4xl overflow-auto`}
          >
            <Editor
              disabled={true}
              apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
              init={{
                setup: function (editor) {
                  editor.on('init', function () {
                    setLoadingTiny(() => false);
                  });
                },
                height: '100%',
                width: '100%',
                menubar: false,
                toolbar: false,
                selector: 'textarea', // change this value according to your HTML
              }}
              initialValue={assignment?.data?.description}
              value={assignment?.data?.description}
            />
          </div>
          {loadingTiny && (
            <Skeleton variant="rectangular" width="100%" height={400} />
          )}
        </div>
      </main>
      <animated.div
        style={{ ...springs }}
        className={`w-full z-20  ${
          triggerMenu ? 'h-screen' : 'h-min'
        }    fixed bottom-0 flex   items-end`}
      >
        <div className="bg-white w-full h-[30rem] flex-col flex justify-start items-center relative">
          <div className=" w-full  flex justify-around md:justify-center md:gap-20 items-start relative">
            <button
              onClick={() => {
                if (triggerMenu === false) {
                  handleOpenTrigerMenu();
                  setActiveMenu(() => 1);
                } else if (triggerMenu === true) {
                  setActiveMenu(() => 1);
                }
              }}
              className="flex flex-col  relative -top-5 font-Kanit font-semibold text-blue-600 justify-center items-center"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-xl drop-shadow-md text-white flex items-center justify-center text-3xl">
                <MdOutlineInventory2 />
              </div>
              <span>งานของฉัน</span>
            </button>
            <button
              onClick={() => {
                if (triggerMenu === false) {
                  handleOpenTrigerMenu();
                  setActiveMenu(() => 0);
                } else if (triggerMenu === true) {
                  setActiveMenu(() => 0);
                }
              }}
              className="flex relative -top-7 flex-col font-Kanit font-semibold text-blue-600 justify-center items-center"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-full drop-shadow-md text-white flex items-center justify-center text-3xl">
                <AiOutlinePlus />
              </div>
              <span>ส่งงาน</span>
            </button>
            <button
              onClick={() => {
                comments.refetch();
                if (triggerMenu === false) {
                  handleOpenTrigerMenu();
                  setActiveMenu(() => 2);
                } else if (triggerMenu === true) {
                  setActiveMenu(() => 2);
                }
              }}
              className="flex flex-col  relative -top-5 font-Kanit font-semibold text-blue-600 justify-center items-center"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-xl drop-shadow-md text-white flex items-center justify-center text-3xl">
                <BsFillChatDotsFill />
              </div>
              <span>คอมเมนต์</span>
            </button>
          </div>
          {activeMenu === 4 && <div className=""></div>}
          {activeMenu === 0 && (
            <form
              onSubmit={handleSummitWork}
              className="w-11/12 max-w-3xl h-full  flex flex-col gap-2 items-center justify-top"
            >
              <div
                className="w-11/12  max-w-3xl h-max border-b-2 pb-5 border-slate-500
                flex flex-col gap-2 items-center justify-top"
              >
                <span className="text-sm text-red-500 w-8/12 text-center">
                  สามารส่งไฟล์ mp4, mp3, docx, pdf,jpge, png ได้แล้ว ขนาดไม่เกิน
                  100 MB
                </span>
                <div className="flex justify-center gap-5 w-full">
                  {fetchStudentWork.isLoading ? (
                    <Skeleton variant="rounded" width={200} height={50} />
                  ) : loading ? (
                    <div>
                      <Loading />
                    </div>
                  ) : (
                    <label
                      htmlFor="dropzone-file"
                      className="w-max flex flex-col h-max gap-1 justify-center items-center"
                    >
                      <div
                        className="w-20 h-8 hover:scale-105 transition duration-150
                   bg-white drop-shadow-xl ring-2 ring-black text-black text-2xl flex justify-center items-center rounded-2xl"
                      >
                        <AiOutlineCloudUpload />
                      </div>

                      <input
                        id="dropzone-file"
                        onChange={handleFileEvent}
                        name="files"
                        aria-label="upload image"
                        type="file"
                        multiple="multiple"
                        accept="
application/pdf,
    image/jpeg,
    image/png,
    image/gif,
    application/msword,
    application/vnd.openxmlformats-officedocument.wordprocessingml.document,
    video/mp4,
    audio/mpeg"
                        className="text-sm text-grey-500 hidden  ring-2 appearance-none
            file:mr-5 md:file:w-40 file:w-40 w-max file:py-2
            file:rounded-full file:border-0
            file:text-sm file:font-Kanit file:font-normal file:text-white
             bg-white rounded-full
            file:bg-blue-400 file:drop-shadow-lg
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
          "
                      />
                      <span>อัพโหลดไฟล์</span>
                    </label>
                  )}
                  <div className="flex flex-col justify-center gap-1 items-center">
                    <button
                      onClick={() => {
                        setTriggerCreateStudentWork(() => true);
                      }}
                      type="button"
                      className="w-20 h-8 rounded-xl ring-2 ring-black text-2xl flex 
                  flex-col items-center justify-center"
                    >
                      <HiOutlineNewspaper />
                    </button>
                    <span>ใบงาน</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span>ไฟล์ที่คุณเลือกมีขนาด</span>
                  <span>{fileSize}MB</span>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="relative">
                    <div
                      onClick={() => {
                        setFilesSize(() => 0);
                        setSelectedFiles(() => []);
                      }}
                      className=" absolute -top-2 z-20 -right-2 "
                    >
                      <div className="flex justify-center items-center w-8 h-8 text-xl text-white bg-blue-500 rounded-full p-2">
                        <FiRefreshCw />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 place-items-center gap-5 relative h-32  overflow-y-auto ring-2 p-3 rounded-xl">
                      {selectedFiles.map((file, index) => {
                        if (
                          file.type === 'image/jpeg' ||
                          file.type === '' ||
                          file.type === 'image/png'
                        )
                          return (
                            <div
                              key={index}
                              className="w-full px-1 flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl"
                            >
                              <div className="flex items-center justify-center text-green-700">
                                <BsImageFill />
                              </div>
                              <span className="w-20 truncate">{file.name}</span>
                            </div>
                          );
                        if (
                          file.type === 'video/mp4' ||
                          file.type === 'video/quicktime'
                        )
                          return (
                            <div className="w-full  px-1 flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl">
                              <div className="flex items-center justify-center text-green-700">
                                <FcVideoFile />
                              </div>
                              <span className="w-20 truncate">{file.name}</span>
                            </div>
                          );
                        if (
                          file.type === 'audio/mpeg' ||
                          file.type === 'audio/mp3'
                        )
                          return (
                            <div className="w-full px-1 flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl">
                              <div className="flex items-center justify-center text-red-700">
                                <FaFileAudio />
                              </div>
                              <span className="w-20 truncate">{file.name}</span>
                            </div>
                          );
                        if (file.type === 'application/pdf')
                          return (
                            <div className="w-full px-1 flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl">
                              <div className="flex items-center justify-center text-gray-700">
                                <FaRegFilePdf />
                              </div>
                              <span className="w-20 truncate">{file.name}</span>
                            </div>
                          );
                        if (
                          file.type ===
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                        )
                          return (
                            <div className="w-full px-1 flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl">
                              <div className="flex items-center justify-center text-blue-700">
                                <IoDocumentText />
                              </div>
                              <span className="w-20 truncate">{file.name}</span>
                            </div>
                          );
                      })}
                    </div>
                  </div>
                )}
                {loading ? (
                  <div
                    className="w-40 h-10 mt-5   bg-gray-500 drop-shadow-md text-white rounded-xl
           flex items-center justify-center"
                  >
                    โปรดรอสักครู่
                  </div>
                ) : fileSize > 100 ? (
                  <div
                    className="w-40 h-10 mt-5  bg-red-500 drop-shadow-md text-white rounded-xl
           flex items-center justify-center"
                  >
                    ขนาดไฟล์เกิน
                  </div>
                ) : selectedFiles.length > 0 ? (
                  <button
                    type="submit"
                    className="w-40 h-10 mt-5  bg-green-500 drop-shadow-md text-white rounded-xl
       flex items-center justify-center"
                  >
                    ส่งงาน
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-40 h-10 mt-5  bg-red-500 drop-shadow-md text-white rounded-xl
   flex items-center justify-center"
                  >
                    ส่งงานโดยไม่แนบไฟล์
                  </button>
                )}
              </div>
            </form>
          )}

          {activeMenu === 1 && (
            <div className="w-11/12 max-w-3xl  flex flex-col gap-2 items-center justify-top">
              {studentWork?.status === 'no-work' ? (
                <div
                  className="font-Kanit text-2xl text-red-400 font-light h-20 flex items-center 
                justify-center gap-2"
                >
                  <span>คุณยังไม่ส่งงาน</span>
                  <div className="flex items-center justify-center ">
                    <CiFaceFrown />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full">
                  <ul className="flex w-full justify-center gap-2 font-Kanit">
                    <li
                      onClick={() => {
                        setTiggerShowFiles(() => true);
                        setTriggerShowWorksheet(() => false);
                      }}
                      className={` select-none ${
                        triggerShowFiles
                          ? 'font-medium underline underline-offset-2'
                          : 'font-normal'
                      }`}
                    >
                      ไฟล์งาน
                    </li>
                    <li className="border-r-2 border-black"></li>
                    <li
                      className={`select-none ${
                        triggerShowWorksheet
                          ? 'font-medium underline underline-offset-2'
                          : 'font-normal'
                      }`}
                      onClick={() => {
                        setTiggerShowFiles(() => false);
                        setTriggerShowWorksheet(() => true);
                      }}
                    >
                      ใบงาน
                    </li>
                  </ul>
                  {studentWork?.status !== 'no-work' && (
                    <div className="w-full flex justify-end">
                      <button
                        onClick={handleDeleteStudentWork}
                        className="flex items-center justify-center   gap-1 text-red-800  p-2 bg-red-300 rounded-full"
                      >
                        <AiFillDelete />
                        ลบงาน
                      </button>
                    </div>
                  )}
                  {triggerShowFiles && (
                    <div className="w-full h-80 overflow-auto ring-2 ring-blue-400 rounded-2xl  flex flex-col   gap-5 mt-5">
                      {studentWork?.picture && (
                        <SlideshowLightbox
                          downloadImages={true}
                          lightboxIdentifier="lightbox1"
                          showThumbnails={true}
                          framework="next"
                          images={studentWork.picture}
                          theme="day"
                          className={`container grid w-full  h-max items-center place-items-center
                       ${
                         studentWork?.picture.length === 1
                           ? 'grid-cols-1'
                           : 'grid-cols-2 md:grid-cols-3 '
                       }  gap-2  `}
                        >
                          {studentWork?.picture?.map((image, index) => {
                            return (
                              <Image
                                key={index}
                                src={image.src}
                                alt={image.alt}
                                width={240}
                                height={160}
                                className="object-cover "
                                data-lightboxjs="lightbox1"
                                quality={80}
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAYAAACMo1E1AAAACXBIWXMAAAWJAAAFiQFtaJ36AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAhxSURBVHgBzVhbbFxXFV3nvmc8fo4d2/FDiUkc0TYCIUCp2kJKq6blJWg/+OH5A1KFhPgBfnhERaoQQggkBEgUCQlUUKl4VFT0Aym0gChIlWhD0qZpkzhO4viV+Dlz79x7T9fZ987EjjseT5qPHif2fZx7ztpr7732vldpDrQxNH8Uf+pnaBzf9HHUQZtDbQJTP06RmUjgyrru3o2PtsFlbBk8Nf5bQFo9j7RyDjq+wlsJYHfA8odgF/ZC8a+yOohT3RDgtsHpJCKYV1Cbfwa1xWM8fhVptEiwUba38qDsIgEOw+5+L7zy/fx7CJZXbhuc2nnMaaThRUSXf49o5nEkq/8HrE64vbeTvYuIl18ggAG4uz4OTUajuacFsPIHCfA++Lu/QJDvI5NefblWWHcYczpFsn4K1XM/ILg/cPMr4ipv4CEU9z+CZOVFrJ18GE7PIRTe8U2yOYVk+UXEay9DhRcQXvy1zPH3fJXPfIwASzsicQfgUm52GpXXv4to9o88DXPAXN/pphf7YZduhRWMk7kRXuuBctck9hQNyBxTE2bT09+W573BT9H1hZY7Wy2hRXOonP2RALO8QfjDn4bd+a4syJMlgoxpYofEmKJbjb3Kos3mvzJ/vRwgjVx/DdWzP0R89bksedoGpzchQ23uKQJ7Uo7d8r0o7H8Uhb3fgO2PIo2XJGtNRtqFPQRX5rFZ0oVlFYitD3ZxH1lyG4snaydRPf9TEngB7YPbEAtp5SyiS78R9jQtTddf58Uq3P4jcIcelOM0rQg7VnE/LLc3W4CMGbdZ/oBcV5a/YdmEWf53RPNMGF1De+AaDMaoXXlWAtmwaZiIV4/z2jGRCn/4s7AKE8YCbmyT1cOwu94j4JRFppwSsZ+jC/9FDzJOGZ/mmtJZONRmn0ISzmG74TTHtoLYgKst0WWj8Ec+x+w7QTc/DbfvbibBO+GPPUy2BoQsq7Ave05OyJRbJigDXJPp++AOfIJ5MYfq1I+hwxka/RI9cQJ2sBttM2dcmaye5OIJmSgS0BEUJh6BCkbolmcFhFO6hR7sQq6+GWvmDt3s9NwJp/dOeLs/j+Lk9xHQOKf3MLO4SzxhtDBl/BmZap+52jwDfkHwJ3RPNPsEwX0LwfiXka6eyCqCcd8Wvcpizht8kAL9AR52CqA0nKbe/ZKunpYpmvGWmLKnKdQqaA8czaJRlQwo3RPNPMmwOcRNH6IrxgWASAQtz4q9QaklHCQBTLYGY8JSGi8inPoJwpnf8WQ9t56MRfPmZlP/NbmsZWMJXuk0FIm6hOr0L1gpXsuACbuMHaNZhkXZr8pA/xPnvIJMk4xSs7pceQ7Vy48DBC7z8tJFYTEsoNnYAq5Rao2Ci4DWDU2o8v8RMdZUeRNdillo3KSN9TKob6XbmAz9qMegjq7yGZa86qXc7LxJoeHK6Zc9dgxO5e2NRQFV1K16tyPXk3V2I3+VbJNBt7n9H4XRLrYFhBLT5SPcb1djvTSaZp19IQ98hbq1JmmswhjXbR5ZTe4o6ckcCmiy+pKwll1NReHjpefhBWMSa2mywuz9GwENM96uivg65SOyqRFuU1MTVgMJE5MrfEYTqEXdszsOZCVup8w14DHDbJNtFFzDWsaocdMiO5PfSvbJAh6NMOKbMhE8lque2zMRNg40LdbsnxmbS7kH6jFsCTCbIbDdaF4huIHbdxhWxy2o64Wx2LgvZpMZXniMZXVRCrxdOkiR/SSl455MlLmsjteYnU8gWWTCNII+dyk7FmfgIzRmCG2B0xt+Wyza/hDbG7e7AVBZAS0vMXMfQ3T+Z5SZ1eyess3N7GnGpmEsnP45EspIZlieWZzjmA5Z+jqvPXBq428CMWLqlR8QJo1rLYdZHAxJwxnO/YVunt9sHNk19bRy5lGRHVVvc/KwsNi9eKNfouETaDWaS0l9gj+GgB2s2/tBru1K/CTscE1HYQejEpvXrcAkOk6JYQcjb2W6YbbFJArGv0LW6FLlolU73FRKrl1g8Ha+G8V936FsfDjTP7qNO7FW3pXX1g3T2c3oaIHam+SqQe6MK4uTCPZ+jd3MZ2hQqWHIdqN1my6qafPl5P0oHvgeogu/QsiXHPqH4O7I6uvG6WQ0jWb4WCyNp2nbHWZwMPpFOH0fkmTYYAreGriGBBAgdS+Y+Dqc/nsoJfPSSG4ZLGWmmJsO2O64lVl8P7P+XnHpVk3b/hWs5athnGiEcQrHtuDZmU5lcJMsQ+sykx9FUQULM/9GwQ/Q1TtBYsub5l2Dpa/7erBlbP9qaHC/ejnEP08v48BwgMnBApJUo1JLMdzlEV4W8AlxOgReoyGnZmKcWbgNB0c6sCf1UatoeA7VkZNsGmgRD5dA4CqoFq+HLd3aVWA/x8Xml2P849QsRnp9rEcpRnocLFUSsqqxUk3R4VlYCxO4joW7JksYJPhnji9hajFEueTg0tUaugs2BrpcRPTEAwd70FN0bhycydxOghvrdeG7Fnq52GC3i7BGUGQrIjCXjM2tRCj1043c3CMj/z2zhl1dbCZZGEq+TbaUPJfQyuPT6+jpsOVeq9GSuZKncPceygk3uGOcLyjKuMjKGwwfUwtVDLsahyZ9smajRsAzKwkKfK6/VGS1qEr10pYtbn/+TIL9wyX0FXeQi60SQldZns7/j5uwZ/P4Fm+z26gs0yxX3kejqtmc7nTtrArE7PWCriwJOAfLC9JUKjdAymcjxqvXPwq7PIIWUnK09Ycc82ZeC68tZOqnzgRWPjfENdEzbYDVezYra9vlPoEryU1zLf9+Z16y7ZbM7eBDjmHAK269XP/rFTadN52H9kfLbyXtjfy9oX6m9cazN5m7/biBL5vbjc38bK7Tatu5bzZuMnM3dxjmjuLtOY69AczUjTdbN6QuAAAAAElFTkSuQmCC"
                              />
                            );
                          })}
                        </SlideshowLightbox>
                      )}
                      <div className="flex flex-col gap-5 justify-start items-center">
                        {studentWork?.files?.length > 0 &&
                          studentWork?.files.map((file, index) => {
                            if (file.fileType === 'pdf') {
                              return (
                                <div
                                  key={index}
                                  className="w-full flex justify-center"
                                >
                                  <embed
                                    src={file.url}
                                    type="application/pdf"
                                    frameBorder="0"
                                    scrolling="auto"
                                    height="500px"
                                    width="80%"
                                  ></embed>
                                </div>
                              );
                            }
                            if (file.fileType === 'docx') {
                              return (
                                <div
                                  key={index}
                                  className="w-full flex  justify-center"
                                >
                                  <iframe
                                    width="80%"
                                    height="500px"
                                    src={`https://docs.google.com/gview?url=${file.url}&embedded=true`}
                                  ></iframe>
                                </div>
                              );
                            }
                            if (
                              file.fileType === 'mp4' ||
                              file.fileType === 'mov' ||
                              file.fileType === 'MOV'
                            ) {
                              return (
                                <div
                                  key={index}
                                  className="w-full flex  justify-center"
                                >
                                  <ReactPlayer
                                    playsinline
                                    controls
                                    width="100%"
                                    height="100%"
                                    url={file.url}
                                  />
                                </div>
                              );
                            }
                            if (
                              file.fileType === 'mp3' ||
                              file.fileType === 'aac'
                            ) {
                              return (
                                <div
                                  key={index}
                                  className="w-full flex  justify-center"
                                >
                                  <audio
                                    src={file.url}
                                    controls={true}
                                    autoPlay={false}
                                  />
                                </div>
                              );
                            }
                          })}
                      </div>
                    </div>
                  )}

                  {triggerShowWorksheet && (
                    <div className="w-full h-80 mt-5">
                      <Editor
                        disabled={true}
                        apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
                        init={{
                          setup: function (editor) {
                            editor.on('init', function () {
                              setLoadingTiny(() => false);
                            });
                          },
                          height: '100%',
                          width: '100%',
                          menubar: false,
                          toolbar: false,
                          selector: 'textarea', // change this value according to your HTML
                        }}
                        initialValue={fetchStudentWork?.data?.data?.body}
                        value={fetchStudentWork?.data?.data?.body}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {activeMenu === 2 && (
            <form
              onSubmit={handleSumitComment}
              className="w-11/12 max-w-3xl h-full mt-1 flex flex-col gap-2"
            >
              <div className="w-full h-44 overflow-auto">
                {comments?.data?.data?.map((comment, index) => {
                  if (comment.user) {
                    return (
                      <div
                        key={index}
                        className=" w-full h-max mt-5 flex items-start justify-start relative "
                      >
                        <div className="flex gap-2 ml-2">
                          {comment.user.picture ? (
                            <div className="w-12 h-12 rounded-full overflow-hidden relative">
                              <Image
                                src={comment.user.picture}
                                alt="profile"
                                sizes="(max-width: 768px) 100vw"
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex justify-center items-center">
                              <span className="uppercase font-sans font-black text-3xl text-white">
                                {comment.user.firstName.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="w-max max-w-[15rem] md:max-w-md h-max pr-10  bg-green-100 rounded-3xl relative  p-2">
                            <div className="text-md ml-4 font-bold first-letter:uppercase">
                              {comment.user.firstName}
                              {comment.user?.lastName}
                            </div>
                            <div
                              className="pl-4 "
                              style={{
                                wordWrap: 'break-word',
                                maxHeight: '200px',
                                overflowY: 'auto',
                              }}
                              dangerouslySetInnerHTML={{
                                __html: comment.body,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  } else if (comment.student) {
                    return (
                      <div
                        key={index}
                        className=" w-full h-max mt-5 flex items-start justify-start relative "
                      >
                        <div className="flex gap-2 ml-2">
                          {comment.student.picture ? (
                            <div className="w-12 h-12 rounded-full overflow-hidden relative">
                              <Image
                                sizes="(max-width: 768px) 100vw"
                                src={comment.student.picture}
                                alt="profile"
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex justify-center items-center">
                              <span className="uppercase font-sans font-black text-3xl text-white">
                                {comment.student.firstName.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div
                            className="w-full max-w-[15rem] md:max-w-md pr-10 
                       bg-blue-100 rounded-3xl h-full relative  p-2"
                          >
                            <div className="text-md ml-4 font-bold first-letter:uppercase">
                              {comment.student.firstName}
                              {comment.student?.lastName}
                            </div>
                            <div
                              className="pl-4 "
                              style={{
                                wordWrap: 'break-word',
                                overflowY: 'auto',
                              }}
                              dangerouslySetInnerHTML={{
                                __html: comment.body,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
              {fetchStudentWork.isLoading || loading ? (
                <Skeleton variant="rounded" width="100%" height={300} />
              ) : (
                <div className="h-28 w-full ">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
                    textareaName="body"
                    init={{
                      link_context_toolbar: true,
                      height: '100%',
                      width: '100%',
                      menubar: false,
                      paste_data_images: false,
                      plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'charmap',
                        'preview',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'code',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table',
                        'help',
                        'wordcount',
                      ],
                      toolbar: '',
                      content_style:
                        'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                    }}
                    initialValue=""
                    value={studentSummit.body}
                    onEditorChange={(newText) => {
                      setStudentSummit((prevState) => {
                        return {
                          ...prevState,
                          body: newText,
                        };
                      });
                    }}
                  />
                </div>
              )}
              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  className="w-20 h-10 bg-green-500 drop-shadow-md text-white rounded-xl
           flex items-center justify-center"
                >
                  <SendIcon />
                </button>
              </div>
            </form>
          )}
        </div>
        {triggerMenu && (
          <div
            onClick={handleCloseTrigerMenu}
            className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-20 bg-black/30 "
          ></div>
        )}
      </animated.div>
    </div>
  );
}

export default Index;
