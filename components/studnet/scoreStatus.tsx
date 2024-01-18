import { UseQueryResult } from "@tanstack/react-query";
import React, { useState } from "react";
import { ResponseStudentGetAllScoreService } from "../../service/student/score";
import { Skeleton } from "@mui/material";
import { MdOutlineAssignment } from "react-icons/md";

interface ScoreStatus {
  totalScore: UseQueryResult<ResponseStudentGetAllScoreService, Error>;
}
function ScoreStatus({ totalScore }: ScoreStatus) {
  const calculateAllAssignmentScore = (): string => {
    let total = 0;

    totalScore?.data?.assignments?.forEach((assignment) => {
      let pureMaxScore = "0";

      if (assignment?.assignment?.percentage) {
        pureMaxScore = assignment?.assignment.percentage.replace(/%/g, "");
      } else {
        pureMaxScore = assignment?.assignment?.maxScore.toFixed(2);
      }

      total += parseFloat(pureMaxScore);
    });
    return total.toFixed(2);
  };

  const calculateAssignmentScore = (): string => {
    let total = 0;

    totalScore?.data?.assignments?.forEach((assignment) => {
      let score = 0;

      if (assignment.studentWork) {
        score = assignment.studentWork.score as number;
      }

      total += score;
    });

    return total.toFixed(2);
  };

  return (
    <section className="w-full md:mt-5 flex font-Kanit flex-col items-center gap-5 justify-center">
      {totalScore.isLoading ? (
        <div className="w-24 h-24 ">
          <Skeleton variant="rounded" width={96} height={96} />
        </div>
      ) : (
        <div className="flex flex-row gap-2">
          {/* คะแนนชิ้นงาน */}
          <div className="p-2 bg-[#00B451] rounded-[1.8rem]">
            <div className=" w-24 h-24 text-center flex-col text-white bg-[#00B451] rounded-[1.4rem] flex items-center justify-center border-solid border-2 border-white">
              <span className="text-xs">คะแนนชิ้นงาน</span>
              <span className="text-2xl font-Kanit font-semibold">
                {calculateAssignmentScore()}
              </span>
              <div className="w-10/12 h-[2px] bg-white"></div>
              <span className="text-base font-semibold ">
                {calculateAllAssignmentScore()}
              </span>
            </div>
          </div>

          {/* คะแนนพิเศษ */}
          <div className="p-2 bg-[#EDBA02] rounded-[1.8rem]">
            <div className=" w-24 h-24 text-center flex-col text-white bg-[#EDBA02] rounded-[1.4rem] flex items-center justify-center border-solid border-2 border-white">
              <span className="text-xs">คะแนนพิเศษ</span>
              <span className="text-3xl font-Kanit font-bold">
                {totalScore?.data?.speicalScore.toFixed(2)}
              </span>
            </div>
          </div>

          {/* คะแนนรวม */}
          <div className="p-2 bg-[#9C2CD1] rounded-[1.8rem]">
            <div className=" w-24 h-24 text-center flex-col text-white bg-[#9C2CD1] rounded-[1.4rem] flex items-center justify-center border-solid border-2 border-white">
              <span className="text-xs">คะแนนรวม</span>
              <span className="text-3xl font-Kanit font-bold">
                {totalScore?.data?.totalScore.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
      {totalScore.isLoading ? (
        <ul className="w-11/12 grid grid-cols-3 place-items-center gap-4 ">
          <Skeleton width="100%" height={100} variant="rectangular" />
          <Skeleton width="100%" height={100} variant="rectangular" />
          <Skeleton width="100%" height={100} variant="rectangular" />
          <Skeleton width="100%" height={100} variant="rectangular" />
          <Skeleton width="100%" height={100} variant="rectangular" />
          <Skeleton width="100%" height={100} variant="rectangular" />
          <Skeleton width="100%" height={100} variant="rectangular" />
          <Skeleton width="100%" height={100} variant="rectangular" />
        </ul>
      ) : (
        <section className="flex flex-col items-center justify-center gap-5 mb-5">
          {totalScore?.data?.assignments?.map((assignment, index) => {
            let score: number = 0;
            let pureMaxScore = "0";

            const createDate = new Date(assignment.assignment?.createAt);
            const formattedCreateDate = createDate.toLocaleDateString("th-TH", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            let deadlineDate = new Date(assignment.assignment?.deadline);
            const formatteDeadlineDate = deadlineDate.toLocaleDateString(
              "th-TH",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            );

            if (assignment.studentWork) {
              score = assignment.studentWork.score as number;
            }
            if (assignment?.assignment?.percentage) {
              const stringWithoutPercent =
                assignment?.assignment.percentage.replace(/%/g, "");

              pureMaxScore = stringWithoutPercent;
            } else {
              pureMaxScore = assignment?.assignment?.maxScore.toFixed(2);
            }
            return (
              <li
                key={assignment.id}
                className="w-full no-underline hover:scale-110 transition duration-100 flex gap-5 items-center 
              justify-center bg-white ring overflow-auto ring-[#2C7CD1] rounded-2xl p-3 "
              >
                {/* Assignment Card*/}
                <div className="flex justify-center items-center gap-3">
                  {/* Left hand card */}
                  <div className="w-full pl-2 h-28 flex flex-col justify-start  text-left ">
                    {/* Left : Title */}
                    <div className="pt-2 w-48 md:w-72 text-left truncate scrollbar-hide ">
                      <span className="font-Kanit font-semibold text-xl text-[#2C7CD1]">
                        {assignment.assignment?.title}
                      </span>
                    </div>
                    {/* Left : Date Deadline */}
                    <div className="flex flex-row text-[#F55E00] font-Kanit text-[0.6rem] gap-2">
                      <span className=" ">วันที่: {formattedCreateDate}</span>
                      <span className=" ">
                        วันสิ้นสุด: {formatteDeadlineDate}
                      </span>
                    </div>
                    {/* Left : Description */}
                    <div
                      className="pt-1 text-black font-Kanit text-sm mt-2 leading-4 w-[12.5rem] h-[3.125rem] md:w-[18.75rem] overflow-hidden"
                      dangerouslySetInnerHTML={{
                        __html: assignment.assignment?.description,
                      }}
                    ></div>
                  </div>

                  {/* Right hand */}
                  <div className="w-28 h-28 mr-2 flex items-center justify-center ">
                    <div className="flex flex-col w-24 h-24 bg-[#00B451] rounded-2xl text-white font-Kanit  justify-center items-center">
                      <span className="text-2xl font-semibold">
                        {score.toFixed(2)}
                      </span>
                      <div className="w-10/12 h-[2px] bg-white"></div>
                      <span className="text-base ">{pureMaxScore}</span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </section>
      )}
    </section>
  );
}

export default ScoreStatus;
