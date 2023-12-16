import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Swal from "sweetalert2";

function index() {
  const router = useRouter();
  useEffect(() => {
    Swal.fire({
      title: "ไม่พบหน้านี้",
      html: "กำลังนำคุณไปหน้าหลัก...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      icon: "warning",
      didOpen: () => {
        Swal.showLoading();
      },
    });
    router.push({
      pathname: "/classroom/student",
      query: {
        redirect: "success",
      },
    });
  }, []);

  return <div className="bg-blue-600 w-screen h-screen"></div>;
}

export default index;
