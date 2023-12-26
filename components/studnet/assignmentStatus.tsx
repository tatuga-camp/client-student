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
    <section className="flex flex-col gap-5 mb-5">
      {assignments?.data?.map((assignment) => {
        const createDate = new Date(assignment.assignment?.createAt);
        const formattedCreateDate = createDate.toLocaleDateString("th-TH", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        let IsDue = false;
        const currentTime = new Date();
        let deadlineDate = new Date(assignment.assignment?.deadline);
        deadlineDate.setHours(23);
        deadlineDate.setMinutes(59);
        deadlineDate.setSeconds(0);
        if (currentTime > deadlineDate) {
          IsDue = true;
        } else if (currentTime < deadlineDate) {
          IsDue = false;
        }
        const formatteDeadlineDate = deadlineDate.toLocaleDateString("th-TH", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        return (
          <Link
            href={`/classroom/student/${student?.data?.id}/assignment/${assignment?.assignment?.id}?classroomId=${router?.query?.classroomId}`}
            key={assignment.assignment?.id}
            className="w-full no-underline hover:scale-110 transition duration-100 flex gap-5 
             justify-between bg-white ring-2  overflow-auto ring-blue-600 rounded-2xl p-3"
          >
            <div className="w-full h-28 flex flex-col justify-center  text-left   ">
              <div className="w-48 md:w-72 text-left truncate scrollbar-hide">
                <span className="font-Kanit font-semibold md:text-xl text-blue-500">
                  {assignment.assignment?.title}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-Kanit text-xs md:text-base font-normal text-black">
                  มอบหมายเมื่อ {formattedCreateDate}
                </span>
                <span className="font-Kanit text-xs md:text-base font-normal text-black">
                  กำหนดส่ง {formatteDeadlineDate}
                </span>
              </div>
            </div>
            <div className="w-20  h-full flex items-center justify-center">
              <div className=" font-Kanit flex-col font-semibold flex justify-center items-center">
                {assignment?.student.status === "no-work" && IsDue && (
                  <div
                    className="w-20 h-20 bg-red-600 rounded-2xl p-2 text-center text-sm text-white font-Kanit font-semibold
                     flex justify-center items-center"
                  >
                    <span className="">เลยกำหนดส่ง</span>
                  </div>
                )}
                {assignment?.student.status === "no-work" && !IsDue && (
                  <div
                    className="w-20 h-20 bg-orange-500 rounded-2xl text-base text-white font-Kanit font-semibold
                     flex justify-center items-center"
                  >
                    <span className="w-10/12">ไม่ส่งงาน</span>
                  </div>
                )}
                {assignment?.student?.status === "have-work" &&
                  assignment?.student?.isSummited === false && (
                    <div className="w-20 h-20 bg-yellow-400 rounded-2xl text-white font-Kanit font-semibold flex justify-center items-center">
                      <span>รอตรวจ</span>
                    </div>
                  )}
                {assignment?.student?.status === "have-work" &&
                  assignment?.student?.isSummited === true && (
                    <div className="w-20 h-20 bg-green-600 rounded-2xl text-white font-Kanit font-semibold flex justify-center items-center">
                      <span>ตรวจแล้ว</span>
                    </div>
                  )}
                สถานะ
              </div>
            </div>
          </Link>
        );
      })}
    </section>
  );
}

export default AssignmentStatus;
