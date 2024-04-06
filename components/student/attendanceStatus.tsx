import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import { ResponseGetAttendancesService } from "../../service/student/attendance";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import type { ChartData, ChartOptions } from "chart.js";

interface AttendanceStatus {
  attendances: UseQueryResult<ResponseGetAttendancesService, Error>;
}
function AttendanceStatus({ attendances }: AttendanceStatus) {
  const data: ChartData<"pie"> = {
    datasets: [
      {
        data: [
          attendances?.data?.statistics?.number?.present || 0,
          attendances?.data?.statistics?.number?.holiday || 0,
          attendances?.data?.statistics?.number?.sick || 0,
          attendances?.data?.statistics?.number?.absent || 0,
          attendances?.data?.statistics?.number?.late || 0,
        ],
        backgroundColor: [
          //green yellow blue red orange
          "rgba(0, 180, 81, 1)",
          "rgba(237, 186, 2, 1)",
          "rgba(44, 124, 209, 1)",
          "rgba(237, 2, 2, 1)",
          "rgba(245, 94, 0, 1)",
        ],
      },
    ],
  };
  const option = {
    tooltips: {
      enabled: false,
    },
    plugins: {
      datalabels: {
        formatter: (value: any, ctx: any) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;

          dataArr.forEach((data: any) => {
            sum += data;
          });

          let percentage =
            value > 0 ? ((value * 100) / sum).toFixed() + "%" : "";

          return percentage;
        },
        color: "#fff",
      },
    },
  };

  return (
    <section className="w-full h-full flex  justify-center bg-white rounded-3xl">
      <ul className="grid pl-0 grid-cols-1 gap-1 w-full h-full py-5 max-w-3xl md:w-10/12  place-items-center">
        <div className="w-full flex justify-start flex-col items-center font-Kanit ">
          <div className="flex">
            {/* Chart */}
            <div className="w-[150px] h-[150px]">
              <Pie options={option} data={data} />
            </div>

            {/* Info stats */}
            <div className="-mt-5 ml-2 flex flex-col text-[#2C7CD1]">
              <h2 className="font-bold text-xl mt-2">ข้อมูลการมาเรียน</h2>
              <span className="text-sm">
                เปอเซ็นต์การเข้าเรียน {` `}
                {attendances?.data?.statistics?.percent?.present?.toFixed(2)}%
              </span>
              <span className="text-sm">
                จำนวนคาบเรียน
                {attendances?.data?.statistics?.sum || 0} คาบ
              </span>

              <ul className="ml-3 mt-2 text-sm pr-6">
                <li className="flex gap-[0.4rem] justify-between">
                  <div className="flex gap-2 items-center">
                    <div className="w-[15px] h-[15px] rounded-full bg-[#00B451]"></div>
                    <p>มาเรียน </p>
                  </div>
                  <span>
                    {attendances?.data?.statistics?.number?.present || 0}
                    <span className="ml-2">ครั้ง</span>
                  </span>
                </li>
                <li className="flex gap-[0.4rem] justify-between">
                  <div className="flex gap-2 items-center">
                    <div className="w-[15px] h-[15px] rounded-full bg-[#EDBA02]"></div>
                    <p>ลา </p>
                  </div>
                  <span>
                    {attendances?.data?.statistics?.number?.holiday || 0}
                    <span className="ml-2">ครั้ง</span>
                  </span>
                </li>
                <li className="flex gap-[0.4rem] justify-between">
                  <div className="flex gap-2 items-center">
                    <div className="w-[15px] h-[15px] rounded-full bg-[#2C7CD1]"></div>
                    <p>ป่วย </p>
                  </div>
                  <span>
                    {attendances?.data?.statistics?.number?.sick || 0}
                    <span className="ml-2">ครั้ง</span>
                  </span>
                </li>
                <li className="flex gap-[0.4rem] justify-between">
                  <div className="flex gap-2 items-center">
                    <div className="w-[15px] h-[15px] rounded-full bg-[#ED0202]"></div>
                    <p>ขาดเรียน </p>
                  </div>
                  <span>
                    {attendances?.data?.statistics?.number?.absent || 0}
                    <span className="ml-2">ครั้ง</span>
                  </span>
                </li>
                <li className="flex gap-[0.4rem] justify-between">
                  <div className="flex gap-2 items-center">
                    <div className="w-[15px] h-[15px] rounded-full bg-[#F55E00]"></div>
                    <p>มาสาย </p>
                  </div>
                  <span>
                    {attendances?.data?.statistics?.number?.late || 0}
                    <span className="ml-2">ครั้ง</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Date statistic */}
        <div className="flex  items-center justify-center font-Kanit w-full md:w-full rounded-md gap-1 mt-6">
          <div className="flex justify-center items-center rounded-lg w-[220px] h-[30px] bg-[#2C7CD1] text-white ">
            <span className=" font-normal text-sm">วันที่</span>
          </div>
          <div className="flex justify-center items-center rounded-lg w-[100px] h-[30px] bg-[#2C7CD1]  text-white">
            <span>สถานะ</span>
          </div>
        </div>

        {attendances?.data?.students?.map((attendance) => {
          const date = new Date(attendance.date);
          const formattedDate = date.toLocaleDateString("th-TH", {
            weekday: "long",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          if (attendance.present) {
            return (
              <li
                key={attendance.id}
                className="flex  items-center justify-center font-Kanit w-full md:w-full rounded-md gap-1"
              >
                <div className="flex justify-center items-center rounded-lg w-[220px] h-[30px] bg-[#E8E8E8] text-[#2C7CD1]">
                  <span className=" font-normal text-sm">{formattedDate}</span>
                </div>
                <div className="flex justify-center items-center rounded-lg w-[100px] h-[30px] bg-[#00B451]  text-white">
                  <span>มาเรียน</span>
                </div>
              </li>
            );
          } else if (attendance.holiday) {
            return (
              <li
                key={attendance.id}
                className="flex  items-center justify-center font-Kanit w-full md:w-full rounded-md gap-1"
              >
                <div className="flex justify-center items-center rounded-lg w-[220px] h-[30px] bg-[#E8E8E8] text-[#2C7CD1]">
                  <span className=" font-normal text-sm">{formattedDate}</span>
                </div>
                <div className="flex justify-center items-center rounded-lg w-[100px] h-[30px] bg-[#EDBA02]  text-white">
                  <span>ลา</span>
                </div>
              </li>
            );
          } else if (attendance.sick) {
            return (
              <li
                key={attendance.id}
                className="flex  items-center justify-center font-Kanit w-full md:w-full rounded-md gap-1"
              >
                <div className="flex justify-center items-center rounded-lg w-[220px] h-[30px] bg-[#E8E8E8] text-[#2C7CD1]">
                  <span className=" font-normal text-sm">{formattedDate}</span>
                </div>
                <div className="flex justify-center items-center rounded-lg w-[100px] h-[30px] bg-blue-500  text-white">
                  <span>ป่วย</span>
                </div>
              </li>
            );
          } else if (attendance.absent) {
            return (
              <li
                key={attendance.id}
                className="flex  items-center justify-center font-Kanit w-full md:w-full rounded-md gap-1"
              >
                <div className="flex justify-center items-center rounded-lg w-[220px] h-[30px] bg-[#E8E8E8] text-[#2C7CD1]">
                  <span className=" font-normal text-sm">{formattedDate}</span>
                </div>
                <div className="flex justify-center items-center rounded-lg w-[100px] h-[30px] bg-[#ED0202]  text-white">
                  <span>ขาด</span>
                </div>
              </li>
            );
          } else if (attendance.late) {
            return (
              <li
                key={attendance.id}
                className="flex  items-center justify-center font-Kanit w-full md:w-full rounded-md gap-1"
              >
                <div className="flex justify-center items-center rounded-lg w-[220px] h-[30px] bg-[#E8E8E8] text-[#2C7CD1]">
                  <span className=" font-normal text-sm">{formattedDate}</span>
                </div>
                <div className="flex justify-center items-center rounded-lg w-[100px] h-[30px] bg-[#F55E00]  text-white">
                  <span>สาย</span>
                </div>
              </li>
            );
          }
        })}
      </ul>
    </section>
  );
}

export default AttendanceStatus;
