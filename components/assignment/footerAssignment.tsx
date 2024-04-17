import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Assignment, Student, StudentWork } from "../../models";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  DeleteMyWorkService,
  SummitWorkService,
} from "../../service/student/assignment";
import { useRouter } from "next/router";
import { StudentWorkWithFile } from "../../pages/classroom/student/[studentId]/assignment/[assignmentId]";
import { MdOutlineInventory2 } from "react-icons/md";
import {
  AiFillDelete,
  AiOutlineCloudUpload,
  AiOutlinePlus,
} from "react-icons/ai";
import {
  GetCommentsService,
  PostCommentService,
} from "../../service/student/comment";
import { BsFillChatDotsFill, BsImageFill } from "react-icons/bs";
import { Skeleton } from "@mui/material";
import Loading from "../loading/loading";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { FiRefreshCw } from "react-icons/fi";
import { FcVideoFile } from "react-icons/fc";
import { FaFileAudio, FaRegFilePdf } from "react-icons/fa";
import {
  IoDocumentText,
  IoDocumentTextSharp,
  IoDocuments,
} from "react-icons/io5";
import { CiFaceFrown } from "react-icons/ci";
import Image from "next/image";
import ReactPlayer from "react-player";
import { Editor } from "@tinymce/tinymce-react";
import SendIcon from "@mui/icons-material/Send";
import { BiDownload } from "react-icons/bi";
import StudnetWorks from "./studnetWorks";

interface FooterAssignment {
  student: UseQueryResult<Student, Error>;
  studentWork: StudentWorkWithFile | undefined;
  assignment: UseQueryResult<Assignment, Error>;
  fetchStudentWork: UseQueryResult<StudentWork, Error>;
  setTriggerCreateStudentWork: React.Dispatch<React.SetStateAction<boolean>>;
}
function FooterAssignment({
  student,
  studentWork,
  assignment,
  fetchStudentWork,
  setTriggerCreateStudentWork,
}: FooterAssignment) {
  const [springs, api] = useSpring(() => ({
    from: { y: 400 },
  }));
  const router = useRouter();
  const [studentSummit, setStudentSummit] = useState({
    body: "",
  });
  const [activeMenu, setActiveMenu] = useState<number>(0);
  const [triggerMenu, setTriggerMenu] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileSize, setFilesSize] = useState<number>(0);

  const comments = useQuery({
    queryKey: [
      "comments",
      {
        assignmentId: assignment.data?.id as string,
        studentId: router?.query?.studentId as string,
      },
    ],
    queryFn: () =>
      GetCommentsService({
        assignmentId: assignment.data?.id as string,
        studentId: router?.query?.studentId as string,
      }),
    staleTime: 1000 * 6,
    refetchInterval: 1000 * 6,
  });

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
    document.body.style.overflow = "auto";
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

  const handleSumitComment = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      await PostCommentService({
        assignmentId: assignment.data?.id as string,
        studentId: router.query.studentId as string,
        body: studentSummit.body,
      });
      setStudentSummit((prev) => {
        return {
          ...prev,
          body: "",
        };
      });
      await comments.refetch();
    } catch (err: any) {
      Swal.fire("error", err?.props?.response?.data?.message, "error");
    }
  };

  const handleSummitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      Swal.fire({
        title: "ยืนยันการส่งงาน",
        text: "คุณยังไม่ได้แนบไฟล์งาน แน่ใจใช่ไหมว่าจะส่ง?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const formFiles = new FormData();
            selectedFiles.forEach((file) => {
              formFiles.append("files", file);
            });
            formFiles.append("body", studentSummit.body);
            formFiles.getAll("body");
            await SummitWorkService({
              formFiles,
              studentId: router.query.studentId as string,
              assignmentId: assignment.data?.id as string,
            });

            await fetchStudentWork.refetch();
            Swal.fire("success", "ส่งงานแล้ว", "success");
          } catch (err: any) {
            if (
              err?.props?.response?.data?.message ===
              "student's already summit their work"
            ) {
              Swal.fire(
                "error",
                "นักเรียนได้ส่งงานแล้ว ถ้าจะส่งใหม่ให้ติดต่อครูผู้สอนเพื่อลบงานเดิม",
                "error"
              );
            } else {
              Swal.fire(
                "error",
                err?.props?.response?.data?.message.toString(),
                "error"
              );
            }
            console.error(err);
          }
        }
      });
    } else if (selectedFiles.length > 0) {
      Swal.fire({
        title: "ยืนยันการส่งงาน",
        text: "นักเรียนแน่ใจหรือไม่ว่าจะส่งงาน? เนื่องจากส่งงานแล้วจะไม่สามารถลบงานได้ต้องติดต่อครูผู้สอน",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            setLoading(() => true);
            const formFiles = new FormData();
            selectedFiles.forEach((file) => {
              formFiles.append("files", file);
            });
            formFiles.append("body", studentSummit.body);
            formFiles.getAll("body");
            await SummitWorkService({
              formFiles,
              studentId: router.query.studentId as string,
              assignmentId: assignment.data?.id as string,
            });
            setLoading(() => false);
            fetchStudentWork.refetch();
            Swal.fire("success", "ส่งงานแล้ว", "success");
          } catch (err: any) {
            setLoading(() => false);
            if (
              err?.props?.response?.data?.message ===
              "student's already summit their work"
            ) {
              Swal.fire(
                "error",
                "นักเรียนได้ส่งงานแล้ว ถ้าจะส่งใหม่ให้ติดต่อครูผู้สอนเพื่อลบงานเดิม",
                "error"
              );
            } else {
              Swal.fire("error", err?.props?.response?.data?.message, "error");
            }
            console.error(err);
          }
        }
      });
    }
  };

  //set files to array
  const handleFileEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles: File[] = Array.prototype.slice.call(e.target.files);
    let totalSize = 0;

    // Combine the existing selected files with the newly selected files
    const updatedSelectedFiles = [...selectedFiles, ...newFiles];

    for (let i = 0; i < updatedSelectedFiles.length; i++) {
      totalSize += updatedSelectedFiles[i].size;
    }

    const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
    const convertNumber = Number(totalSizeInMB);
    setFilesSize(() => convertNumber);

    setSelectedFiles(() => updatedSelectedFiles);
  };

  return (
    <animated.div
      style={{ ...springs }}
      className={`w-full z-20  ${
        triggerMenu ? "h-screen" : "h-min"
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
                สามารส่งไฟล์ ขนาดไม่เกิน 400 MB
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
                      multiple={true}
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
                        file.type === "image/jpeg" ||
                        file.type === "" ||
                        file.type === "image/png"
                      ) {
                        return (
                          <div
                            key={index}
                            className="w-full px-1 flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl"
                          >
                            <div className="flex items-center justify-center text-green-700">
                              <BsImageFill />
                            </div>
                            <span className="w-max truncate">{file.name}</span>
                          </div>
                        );
                      } else if (
                        file.type === "video/mp4" ||
                        file.type === "video/quicktime"
                      ) {
                        return (
                          <div
                            key={index}
                            className="w-full  px-1 flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl"
                          >
                            <div className="flex items-center justify-center text-green-700">
                              <FcVideoFile />
                            </div>
                            <span className="w-max truncate">{file.name}</span>
                          </div>
                        );
                      } else if (
                        file.type === "audio/mpeg" ||
                        file.type === "audio/mp3"
                      ) {
                        return (
                          <div
                            key={index}
                            className="w-full px-1 flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl"
                          >
                            <div className="flex items-center justify-center text-red-700">
                              <FaFileAudio />
                            </div>
                            <span className="w-max truncate">{file.name}</span>
                          </div>
                        );
                      } else if (file.type === "application/pdf") {
                        return (
                          <div
                            key={index}
                            className="w-full px-1 flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl"
                          >
                            <div className="flex items-center justify-center text-gray-700">
                              <FaRegFilePdf />
                            </div>
                            <span className="w-max truncate">{file.name}</span>
                          </div>
                        );
                      } else if (
                        file.type ===
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      ) {
                        return (
                          <div
                            key={index}
                            className="w-full px-1 flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl"
                          >
                            <div className="flex items-center justify-center text-blue-700">
                              <IoDocumentText />
                            </div>
                            <span className="w-max truncate">{file.name}</span>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={index}
                            className="w-full px-1 flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl"
                          >
                            <div className="flex items-center justify-center text-slate-700">
                              <IoDocumentTextSharp />
                            </div>
                            <span className="w-max truncate">{file.name}</span>
                          </div>
                        );
                      }
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
              ) : fileSize > 400 ? (
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
          <StudnetWorks
            studentWork={studentWork}
            student={student}
            fetchStudentWork={fetchStudentWork}
          />
        )}
        {activeMenu === 2 && (
          <form
            onSubmit={handleSumitComment}
            className="w-11/12 max-w-3xl h-full mt-1 flex flex-col gap-2"
          >
            <div className="w-full h-44 overflow-auto">
              {comments?.data?.map((comment, index) => {
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
                              wordWrap: "break-word",
                              maxHeight: "200px",
                              overflowY: "auto",
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
                              wordWrap: "break-word",
                              overflowY: "auto",
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
                  tinymceScriptSrc={"/assets/libs/tinymce/tinymce.min.js"}
                  textareaName="body"
                  init={{
                    link_context_toolbar: true,
                    height: "100%",
                    width: "100%",
                    menubar: false,
                    paste_data_images: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "help",
                      "wordcount",
                    ],
                    toolbar: "",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
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
  );
}

export default FooterAssignment;
