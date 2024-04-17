import { UseQueryResult } from "@tanstack/react-query";
import { Editor } from "@tinymce/tinymce-react";
import { SlideshowLightbox } from "lightbox.js-react";
import React, { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { CiFaceFrown } from "react-icons/ci";
import { IoDocumentText, IoDocuments } from "react-icons/io5";
import ReactPlayer from "react-player";
import { StudentWorkWithFile } from "../../pages/classroom/student/[studentId]/assignment/[assignmentId]";
import { Student, StudentWork } from "../../models";
import Swal from "sweetalert2";
import { DeleteMyWorkService } from "../../service/student/assignment";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaFileAudio, FaImage, FaRegFilePdf } from "react-icons/fa";
import { BsFileEarmarkCode, BsImageFill } from "react-icons/bs";
import { FcVideoFile } from "react-icons/fc";

type StudentWorkPros = {
  student: UseQueryResult<Student, Error>;
  studentWork: StudentWorkWithFile | undefined;
  fetchStudentWork: UseQueryResult<StudentWork, Error>;
};
function StudnetWorks({
  studentWork,
  student,
  fetchStudentWork,
}: StudentWorkPros) {
  const router = useRouter();
  const [triggerShowFiles, setTiggerShowFiles] = useState(true);
  const [triggerShowWorksheet, setTriggerShowWorksheet] = useState(false);

  const handleDeleteStudentWork = async () => {
    const name = student?.data?.firstName;
    const replacedText = name?.replace(/ /g, "_");
    let content = document.createElement("div");
    content.innerHTML =
      "<div>กรุณาพิมพ์ข้อความนี้</div> <strong>" +
      replacedText +
      "</strong> <div>เพื่อลบงาน</div>";
    const { value } = await Swal.fire({
      title: "ยืนยันการลบชิ้นงาน",
      input: "text",
      html: content,
      showCancelButton: true,
      inputValidator: (value: string) => {
        if (value !== replacedText) {
          return "กรุณาพิมพ์ข้อความยืนยันให้ถูกต้อง";
        }
      },
    });
    if (value) {
      try {
        await DeleteMyWorkService({
          studentId: router.query.studentId as string,
          classroomId: router.query.classroomId as string,
          studentWorkId: studentWork?.id as string,
        });
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        location.reload();
      } catch (err: any) {
        console.error(err);
        Swal.fire(
          "error!",
          err?.props?.response?.data?.message?.toString(),
          "error"
        );
      }
    }
  };
  return (
    <div className="w-11/12 max-w-3xl  flex flex-col gap-2 items-center justify-top">
      {studentWork?.status === "no-work" ? (
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
                  ? "font-medium underline underline-offset-2"
                  : "font-normal"
              }`}
            >
              ไฟล์งาน
            </li>
            <li className="border-r-2 border-black"></li>
            <li
              className={`select-none ${
                triggerShowWorksheet
                  ? "font-medium underline underline-offset-2"
                  : "font-normal"
              }`}
              onClick={() => {
                setTiggerShowFiles(() => false);
                setTriggerShowWorksheet(() => true);
              }}
            >
              ใบงาน
            </li>
          </ul>
          {studentWork?.status === "have-work" && (
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
            <div className="w-full h-max max-h-72 overflow-auto ring-blue-400 p-5 grid-cols-1 md:grid-cols-2  grid gap-5 mt-5">
              {studentWork?.pictures?.map((picture, index) => {
                const fileName = picture.src.split("/").pop();

                return (
                  <div
                    onClick={() => window.open(picture.src, "_blank")}
                    key={index}
                    className="w-full select-none relative flex justify-start px-5 drop-shadow-sm 
                      cursor-pointer  items-center gap-2 h-10 bg-sky-100 hover:scale-105 transition duration-75
                     ring-2 ring-sky-500 rounded-xl"
                  >
                    <div className="flex items-center justify-center text-sky-700">
                      <BsImageFill />
                    </div>
                    <span className="w-max max-w-[10rem] md:max-w-[20rem] truncate text-sm ">
                      {fileName}
                    </span>
                  </div>
                );
              })}
              {studentWork?.files &&
                studentWork?.files.length > 0 &&
                studentWork?.files.map((file, index) => {
                  const fileName = file.url.split("/").pop();

                  if (file.fileType === "pdf") {
                    return (
                      <div
                        onClick={() => window.open(file.url, "_blank")}
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
                          {fileName}
                        </span>
                      </div>
                    );
                  } else if (file.fileType === "docx") {
                    return (
                      <div
                        onClick={() => window.open(file.url, "_blank")}
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
                          {fileName}
                        </span>
                      </div>
                    );
                  } else if (
                    file.fileType === "mp4" ||
                    file.fileType === "mov" ||
                    file.fileType === "MOV"
                  ) {
                    return (
                      <div
                        onClick={() => window.open(file.url, "_blank")}
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
                          {fileName}
                        </span>
                      </div>
                    );
                  } else if (
                    file.fileType === "mp3" ||
                    file.fileType === "aac"
                  ) {
                    return (
                      <div
                        onClick={() => window.open(file.url, "_blank")}
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
                          {fileName}
                        </span>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        onClick={() => window.open(file.url, "_blank")}
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
                          {fileName}
                        </span>
                      </div>
                    );
                  }
                })}
            </div>
          )}

          {triggerShowWorksheet && (
            <div className="w-full h-80 mt-5">
              <Editor
                disabled={true}
                tinymceScriptSrc={"/assets/libs/tinymce/tinymce.min.js"}
                init={{
                  setup: function (editor) {
                    editor.on("init", function () {});
                  },
                  height: "100%",
                  width: "100%",
                  menubar: false,
                  toolbar: false,
                }}
                initialValue={fetchStudentWork?.data?.body}
                value={fetchStudentWork?.data?.body}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StudnetWorks;
