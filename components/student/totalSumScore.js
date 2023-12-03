import { Skeleton } from '@mui/material';
import React, { useState } from 'react';
import { MdOutlineAssignment } from 'react-icons/md';

function TotalSumScore({ totalScore }) {
  const [activeScore, setActiveScore] = useState();
  return (
    <div className="w-full md:mt-5 flex font-Kanit flex-col items-center gap-5 justify-center">
      {totalScore.isLoading ? (
        <div className="w-24 h-24 ">
          <Skeleton variant="circular" width={96} height={96} />
        </div>
      ) : (
        <div className=" w-24 h-24 text-center flex-col text-pink-900 bg-pink-200 rounded-full flex items-center justify-center">
          <span className="text-3xl font-Kanit font-bold">
            {totalScore?.data?.totalScore.toFixed(2)}
          </span>
          <span className="text-xs">คะแนนรวม</span>
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
        <ul className="w-11/12 grid grid-cols-3 place-items-center gap-4 ">
          {totalScore?.data?.assignments?.map((assignment, index) => {
            let score = 0;
            let pureMaxScore = '0';
            if (assignment.studentWork) {
              score = assignment.studentWork.score;
            }
            if (assignment?.assignment?.percentage) {
              const stringWithoutPercent =
                assignment?.assignment?.percentage.replace(/%/g, '');

              pureMaxScore = stringWithoutPercent;
            } else {
              pureMaxScore = assignment?.assignment?.maxScore.toFixed(2);
            }
            return (
              <li
                onClick={() =>
                  setActiveScore((prev) => {
                    if (prev === index) {
                      return null;
                    } else {
                      return index;
                    }
                  })
                }
                key={assignment.id}
                className={`h-28 select-none w-full group cursor-pointer   p-2 text-center
              ${
                activeScore === index
                  ? 'bg-green-700 text-white col-span-2 '
                  : 'bg-green-500 text-black col-span-1 '
              } rounded-lg ring-2 ring-white flex flex-col items-center
               justify-center `}
              >
                <div className="bg-green-200 w-7 h-7 rounded-full flex items-center justify-center">
                  <MdOutlineAssignment />
                </div>
                {activeScore === index ? (
                  <span className="text-base transition duration-150 font-medium  w-max   ">
                    {assignment.assignment.title}
                  </span>
                ) : (
                  <div className="flex justify-center items-center flex-col">
                    <span className="text-xl font-semibold">
                      {score.toFixed(2)}
                    </span>
                    <div className="w-10/12 h-[2px] bg-white"></div>
                    <span className="text-xl font-semibold">
                      {pureMaxScore}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
          <li
            className={`h-28 select-none w-full group   p-2 text-center
              rounded-lg ring-2 bg-orange-400 font-semibold text-white ring-white flex flex-col items-center
               justify-center `}
          >
            <span>{totalScore?.data?.speicalScore.toFixed(2)}</span>
            <span>คะแนนพิเศษ</span>
          </li>
        </ul>
      )}
    </div>
  );
}

export default TotalSumScore;
