import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import { Assignment, File } from "../../models";
import { BsFileEarmark, BsFileEarmarkCode, BsImageFill } from "react-icons/bs";
import { FcVideoFile } from "react-icons/fc";
import { FaFileAudio, FaRegFilePdf } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
interface ShowFilesListsOnAssignment {
  assignment: UseQueryResult<Assignment, Error>;
  setSelectFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  setTriggerShowFile: React.Dispatch<React.SetStateAction<boolean>>;
}
function ShowFilesListsOnAssignment({
  assignment,
  setSelectFile,
  setTriggerShowFile,
}: ShowFilesListsOnAssignment) {
  const handleSelectFile = ({ file }: { file: File }) => {
    document.body.style.overflow = "hidden";
    setSelectFile(() => file);
    setTriggerShowFile(() => true);
  };

  return (
    <div className="w-full border-t-2 boder-black my-4">
      <div className="text-xl flex items-center gap-2">
        <span>ไฟล์แนบ</span>
        <BsFileEarmark />
      </div>
      <ul className="w-full h-max max-h-[20rem] grid p-5 gap-5 overflow-auto ">
        {assignment?.data?.files.map((file, index) => {
          if (
            file.type === "image/jpeg" ||
            file.type === "" ||
            file.type === "image/png"
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
            file.type === "video/mp4" ||
            file.type === "video/quicktime"
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
          } else if (file.type === "audio/mpeg" || file.type === "audio/mp3") {
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
          } else if (file.type === "application/pdf") {
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
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
  );
}

export default ShowFilesListsOnAssignment;
