import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import { ResponseGetAttendancesService } from "../../service/student/attendance";
import { BiErrorCircle, BiHappyBeaming, BiRun } from "react-icons/bi";
import { MdCardTravel, MdOutlineMoodBad, MdOutlineSick } from "react-icons/md";
import {Chart, ArcElement} from 'chart.js'
Chart.register(ArcElement);
import { Pie } from 'react-chartjs-2';

interface AttendanceStatus {
  attendances: UseQueryResult<ResponseGetAttendancesService, Error>;
}
function AttendanceStatus({ attendances }: AttendanceStatus) {
  //!Bug : 
  const data = {
    labels: ['มาเรียน', 'ลา', 'ป่วย', 'ขาดเรียน','มาสาย'],
    datasets: [
      {
        label: 'ข้อมูลการมาเรียน',
        data: [
          attendances?.data?.statistics?.number?.present || 0, 
          attendances?.data?.statistics?.number?.holiday || 0,
          attendances?.data?.statistics?.number?.sick || 0,
          attendances?.data?.statistics?.number?.absent || 0,  
          attendances?.data?.statistics?.number?.late || 0, 
          ],
        backgroundColor: [
          //green yellow blue red orange
          'rgba(0, 180, 81, 1)' ,
          'rgba(237, 186, 2, 1)',
          'rgba(44, 124, 209, 1)',
          'rgba(237, 2, 2, 1)',
          'rgba(245, 94, 0, 1)',
        ],
        
      },
    ],
  };
  const option = {
    tooltips: {
      callbacks: {
        label: (tooltipItem: any, data: any) => {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const meta = dataset._meta[Object.keys(dataset._meta)[0]];
          const total = meta.total;
          const currentValue = dataset.data[tooltipItem.index];
          const percentage = parseFloat((currentValue / total * 100).toFixed(1));
          return currentValue + ' (' + percentage + '%)';
        },
        title: (tooltipItem: any, data: any) => {
          return data.labels[tooltipItem[0].index];
        }
      }
    }
  };
  
  
  return (
    <section className="w-full h-full flex  justify-center bg-white rounded-3xl">   
      <ul className="grid pl-0 grid-cols-1 gap-1 w-full h-full py-5 max-w-3xl md:w-10/12  place-items-center">
        <div className="w-full flex justify-start flex-col items-center font-Kanit ">
          <div className="flex">
                {/* Chart */}
              <div className="w-[150px] h-[150px]">
                <Pie 
                  data={data} options={option}
                 />
              </div>

              {/* Info stats */}
              <div className="-mt-5 ml-2 flex flex-col text-[#2C7CD1]">
                  <h2 className="font-bold text-xl mt-2">ข้อมูลการมาเรียน</h2>
                  <span className="text-sm"> 
                    เปอเซ็นต์การเข้าเรียน 
                    {attendances?.data?.statistics?.percent?.present?.toFixed(2)}%
                  </span>
                  <span className="text-sm"> 
                    จำนวนคาบเรียน 
                    {attendances?.data?.statistics?.sum} คาบ
                  </span>

                  <ul className="ml-3 mt-2 text-sm pr-6">
                    <li className="flex gap-[0.4rem] justify-between">
                      <div className="flex gap-2 items-center">
                        <div className="w-[15px] h-[15px] rounded-full bg-[#00B451]"></div>
                        <p>มาเรียน </p>
                      </div>
                      <span>
                        {attendances?.data?.statistics?.number?.present}  ครั้ง
                      </span>
                    </li>
                    <li className="flex gap-[0.4rem] justify-between">
                      <div className="flex gap-2 items-center">
                        <div className="w-[15px] h-[15px] rounded-full bg-[#EDBA02]"></div>
                        <p>ลา </p>
                      </div>
                      <span>
                      {attendances?.data?.statistics?.number?.holiday}  ครั้ง
                      </span>
                    </li>
                    <li className="flex gap-[0.4rem] justify-between">
                      <div className="flex gap-2 items-center">
                        <div className="w-[15px] h-[15px] rounded-full bg-[#2C7CD1]"></div>
                        <p>ป่วย </p>
                      </div>
                      <span>
                      {attendances?.data?.statistics?.number?.sick}  ครั้ง
                      </span>
                    </li>
                    <li className="flex gap-[0.4rem] justify-between">
                      <div className="flex gap-2 items-center">
                        <div className="w-[15px] h-[15px] rounded-full bg-[#ED0202]"></div>
                        <p>ขาดเรียน </p>
                      </div>
                      <span>
                      {attendances?.data?.statistics?.number?.absent}  ครั้ง
                      </span>
                    </li>
                    <li className="flex gap-[0.4rem] justify-between">
                      <div className="flex gap-2 items-center">
                        <div className="w-[15px] h-[15px] rounded-full bg-[#F55E00]"></div>
                        <p>มาสาย </p>
                      </div>
                      <span>
                      {attendances?.data?.statistics?.number?.late} ครั้ง
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
          } else {
            return (
              <li
                key={attendance.id}
                className="flex  items-center justify-between font-Kanit w-full md:w-full  rounded-md"
              >
                <div className="flex justify-start items-center ml-5 gap-2">
                  <div className="w-10 h-10  rounded-full bg-gray-100 flex items-center justify-center">
                    <div className="flex items-center justify-center text-gray-400 text-3xl">
                      <BiErrorCircle />
                    </div>
                  </div>
                  <span className=" font-normal text-sm">{formattedDate}</span>
                </div>
                <div className="w-max text-center rounded-sm p-2 mr-5 text-sm bg-gray-500 text-white">
                  <span>ไม่มีข้อมูล</span>
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
