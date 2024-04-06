import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import { ResponseGetAllAssignmentService } from "../../service/student/assignment";
import Link from "next/link";
import { Student } from "../../models";
import { useRouter } from "next/router";

interface AssignmentStatus {
  assignments: UseQueryResult<ResponseGetAllAssignmentService[], Error>;
  student: UseQueryResult<Student, Error>;
}
function AssignmentStatus({ assignments, student }: AssignmentStatus) {
  const router = useRouter();

  return (
    <section className="flex flex-col items-center justify-center gap-5 mb-5">
      {assignments?.data?.map((assignment) => {
        const createDate = new Date(assignment.assignment?.createAt);
        const formattedCreateDate = createDate.toLocaleDateString("th-TH", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        let IsDue = false;
        const currentTime = new Date();
        let deadlineDate = new Date(assignment.assignment?.deadline);
        if (currentTime > deadlineDate) {
          IsDue = true;
        } else if (currentTime < deadlineDate) {
          IsDue = false;
        }
        const formatteDeadlineDate = deadlineDate.toLocaleDateString("th-TH", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <Link
            href={`/classroom/student/${student?.data?.id}/assignment/${assignment?.assignment?.id}?classroomId=${router?.query?.classroomId}`}
            key={assignment.assignment?.id}
            className="w-full no-underline hover:scale-110 transition duration-100 flex gap-5 items-center 
             justify-center bg-white ring overflow-auto ring-[#2C7CD1] rounded-2xl p-3 "
          >
            {/* Left hand */}
            <div className="w-full pl-2 h-28 flex flex-col justify-start  text-left ">
              <div className="pt-2 w-48 md:w-72 text-left truncate scrollbar-hide ">
                <span className="font-Kanit font-semibold text-xl text-[#2C7CD1]">
                  {assignment.assignment?.title}
                </span>
              </div>
              <div className="flex flex-row text-[#F55E00] font-Kanit text-[0.6rem] gap-2">
                <span className=" ">วันที่: {formattedCreateDate}</span>
                <span className=" ">วันสิ้นสุด: {formatteDeadlineDate}</span>
              </div>
              {/* Assignment description */}
              <div
                className="pt-1 text-black font-Kanit text-sm mt-2 leading-4 w-[12.5rem] h-[3.125rem] md:w-[18.75rem] overflow-hidden"
                dangerouslySetInnerHTML={{
                  __html: assignment.assignment?.description,
                }}
              ></div>
            </div>
            {/* Right hand */}
            <div className="w-20 h-28 mr-3 flex items-center justify-center ">
              <div className=" font-Kanit flex-col font-semibold flex justify-center items-center">
                {assignment?.student.status === "no-work" && IsDue && (
                  <div
                    className="w-24 h-24 bg-[#929292] rounded-2xl p-2 text-center text-sm text-white font-Kanit font-semibold
                     flex justify-center items-center"
                  >
                    <span className="">เลยกำหนดส่ง</span>
                  </div>
                )}
                {assignment?.student.status === "no-work" && !IsDue && (
                  <div
                    className="w-24 h-24 bg-[#ED0202]  rounded-2xl text-center text-base text-white font-Kanit font-semibold
                     flex justify-center items-center"
                  >
                    <span className="w-10/12">ยังไม่ส่ง</span>
                  </div>
                )}
                {assignment?.student?.status === "have-work" &&
                  assignment?.student?.isSummited === false && (
                    <div className="w-24 h-24 bg-[#EDBA02] rounded-2xl text-white font-Kanit font-semibold flex justify-center items-center">
                      <span>รอตรวจ</span>
                    </div>
                  )}
                {assignment?.student?.status === "have-work" &&
                  assignment?.student?.isSummited === true && (
                    <div className="w-24 h-24 bg-[#47AC2D] rounded-2xl text-white font-Kanit font-semibold flex justify-center items-center">
                      <span>ตรวจแล้ว</span>
                    </div>
                  )}
              </div>
            </div>
          </Link>
        );
      })}
    </section>
  );
}

export default AssignmentStatus;
