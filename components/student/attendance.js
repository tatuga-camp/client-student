import React from 'react';
import { BiErrorCircle, BiHappyBeaming, BiRun } from 'react-icons/bi';
import { MdCardTravel, MdOutlineMoodBad, MdOutlineSick } from 'react-icons/md';

function Attendance({ attendances }) {
  return (
    <section className="w-full h-full flex  justify-center">
      <ul className="grid pl-0 grid-cols-1 gap-5 w-full h-full py-10 max-w-3xl md:w-10/12 rounded-t-3xl lg:rounded-3xl bg-white place-items-center">
        <div className="w-full flex justify-start flex-col items-center font-Kanit ">
          <h2 className="mb-2">สถิติ</h2>
          <div className="grid grid-cols-2 gap-4 w-max md:w-full md:place-items-center place-items-start">
            <span className="col-span-2">
              เปอเซ็นต์การเข้าเรียน{' '}
              {attendances?.data?.data?.statistics?.percent?.present?.toFixed(
                2,
              )}
              %
            </span>
            <span>
              จำนวนมาเรียน{' '}
              <span className="font-semibold text-green-500">
                {attendances?.data?.data?.statistics?.number?.present} ครั้ง
              </span>
            </span>
            <span>
              จำนวนมาสาย{' '}
              <span className="font-semibold text-orange-500">
                {attendances?.data?.data?.statistics?.number?.late} ครั้ง
              </span>
            </span>
            <span>
              จำนวนลา{' '}
              <span className="font-semibold text-yellow-500">
                {attendances?.data?.data?.statistics?.number?.holiday} ครั้ง
              </span>
            </span>
            <span>
              จำนวนป่วย{' '}
              <span className="font-semibold text-blue-500">
                {attendances?.data?.data?.statistics?.number?.sick} ครั้ง
              </span>
            </span>
            <span>
              จำนวนขาดเรียน{' '}
              <span className="font-semibold text-red-500">
                {attendances?.data?.data?.statistics?.number?.absent} ครั้ง
              </span>
            </span>

            <span className="col-span-2">
              จำนวนคาบเรียนทั้งหมด {attendances?.data?.data?.statistics?.sum}{' '}
              ครั้ง
            </span>
          </div>
        </div>

        {attendances?.data?.data?.students?.map((attendance) => {
          const date = new Date(attendance.date);
          const formattedDate = date.toLocaleDateString('th-TH', {
            weekday: 'long',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
          if (attendance.present) {
            return (
              <li
                key={attendance.id}
                className="flex  items-center justify-between font-Kanit w-full md:w-full rounded-md"
              >
                <div className="flex justify-start items-center ml-5 gap-2">
                  <div className="w-10 h-10  rounded-full bg-green-100 flex items-center justify-center">
                    <div className="flex items-center justify-center text-green-800 text-3xl">
                      <BiHappyBeaming />
                    </div>
                  </div>
                  <span className=" font-normal text-sm">{formattedDate}</span>
                </div>
                <div className="w-max rounded-sm p-2 mr-5 bg-green-500 text-white">
                  <span>มาเรียน</span>
                </div>
              </li>
            );
          } else if (attendance.holiday) {
            return (
              <li
                key={attendance.id}
                className="flex  items-center justify-between font-Kanit w-full md:w-full  rounded-md"
              >
                <div className="flex justify-start items-center ml-5 gap-2">
                  <div className="w-10 h-10  rounded-full bg-yellow-100 flex items-center justify-center">
                    <div className="flex items-center justify-center text-yellow-400 text-3xl">
                      <MdCardTravel />
                    </div>
                  </div>
                  <span className=" font-normal text-sm">{formattedDate}</span>
                </div>
                <div className="w-14 text-center rounded-sm p-2 mr-5 bg-yellow-500 text-white">
                  <span>ลา</span>
                </div>
              </li>
            );
          } else if (attendance.sick) {
            return (
              <li
                key={attendance.id}
                className="flex  items-center justify-between font-Kanit w-full md:w-full  rounded-md"
              >
                <div className="flex justify-start items-center ml-5 gap-2">
                  <div className="w-10 h-10  rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="flex items-center justify-center text-blue-400 text-3xl">
                      <MdOutlineSick />
                    </div>
                  </div>
                  <span className=" font-normal text-sm">{formattedDate}</span>
                </div>
                <div className="w-14 text-center rounded-sm p-2 mr-5 bg-blue-500 text-white">
                  <span>ป่วย</span>
                </div>
              </li>
            );
          } else if (attendance.absent) {
            return (
              <li
                key={attendance.id}
                className="flex  items-center justify-between font-Kanit w-full md:w-full  rounded-md"
              >
                <div className="flex justify-start items-center ml-5 gap-2">
                  <div className="w-10 h-10  rounded-full bg-red-100 flex items-center justify-center">
                    <div className="flex items-center justify-center text-red-400 text-3xl">
                      <MdOutlineMoodBad />
                    </div>
                  </div>
                  <span className=" font-normal text-sm">{formattedDate}</span>
                </div>
                <div className="w-14 text-center rounded-sm p-2 mr-5 bg-red-500   text-white">
                  <span>ขาด</span>
                </div>
              </li>
            );
          } else if (attendance.late) {
            return (
              <li
                key={attendance.id}
                className="flex  items-center justify-between font-Kanit w-full md:w-full  rounded-md"
              >
                <div className="flex justify-start items-center ml-5 gap-2">
                  <div className="w-10 h-10  rounded-full bg-orange-100 flex items-center justify-center">
                    <div className="flex items-center justify-center text-orange-400 text-3xl">
                      <BiRun />
                    </div>
                  </div>
                  <span className=" font-normal text-sm">{formattedDate}</span>
                </div>
                <div className="w-14 text-center rounded-sm p-2 mr-5 bg-orange-500   text-white">
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

export default Attendance;
