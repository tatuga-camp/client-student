import React, { useEffect, useState } from "react";
import { Student } from "../../models";
import { UseQueryResult } from "@tanstack/react-query";
import { ResponseJoinClassroomService } from "../../service/student/classroom";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import {
  SetStudentPasswordForStudentService,
  VeriflyPasswordForStudentService,
} from "../../service/student/student";
import {
  FormControl,
  Icon,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

interface StudentSetPassword {
  setTriggerNewPassword: React.Dispatch<React.SetStateAction<boolean>>;
  student: Student;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  classroom: UseQueryResult<ResponseJoinClassroomService, Error>;
}

function StudentSetPassword({
  setTriggerNewPassword,
  student,
  setLoading,
  classroom,
}: StudentSetPassword) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setTeacherData] = useState({
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [require, setRequire] = useState(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const validatePassword = () => {
    if (formData.password !== confirmPassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTeacherData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    if (formData.password !== "") {
      setRequire(() => false);
    } else {
      setRequire(() => true);
    }
  }, [formData]);

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };
  const handleSummitSetPassword = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      Swal.fire({
        title: "กำลังโหลด...",
        html: "รอสักครู่นะครับ...",
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      await SetStudentPasswordForStudentService({
        studentId: student.id,
        password: formData.password,
        confirmPassword: confirmPassword,
      });

      setLoading(true);
      const serializedClassroomCode = JSON.stringify(
        router.query.classroomCode
      );
      localStorage.setItem("classroomCode", serializedClassroomCode);
      document.body.style.overflow = "auto";
      setTriggerNewPassword(() => false);
      router.push({
        pathname: `/classroom/student/${student.id}`,
        query: {
          classroomId: classroom?.data?.classroom?.id,
        },
      });
      Swal.fire({ title: "สำเร็จ", icon: "success" });
    } catch (err: any) {
      console.error(err);
      Swal.fire(
        "Error!",
        err?.props?.response?.data?.message?.toString(),
        "error"
      );
    }
  };
  return (
    <div className="w-screen h-screen fixed top-0 bottom-0 right-0 left-0 z-50 m-auto flex items-center justify-center">
      <form
        onSubmit={handleSummitSetPassword}
        className="w-9/12 h-max md:w-96 md:h-max py-10 rounded-md ring-2 gap-3
   ring-black p-5 flex flex-col justify-center items-center bg-white"
      >
        <FormControl
          sx={{ m: 1, width: "100%" }}
          variant="outlined"
          error={passwordError}
        >
          <InputLabel htmlFor="outlined-adornment-password">
            รหัสผ่าน
          </InputLabel>
          <OutlinedInput
            autoComplete="on"
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={validatePassword}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </IconButton>
              </InputAdornment>
            }
            label="รหัสผ่าน"
          />
          <span>ความยาวรหัสผ่าน 8 ตัวขึ้นไป</span>
          {passwordError && <p className="text-red-600">รหัสผ่านไม่ตรงกัน</p>}
        </FormControl>
        <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-confirm-password">
            ยืนยันรหัสผ่าน
          </InputLabel>
          <OutlinedInput
            autoComplete="on"
            id="outlined-adornment-confirm-password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onBlur={validatePassword}
            label="Confirm Password"
          />
          {passwordError && <p className="text-red-600">รหัสผ่านไม่ตรงกัน</p>}
        </FormControl>
        {passwordError || require ? (
          <div
            className="font-Kanit text-lg font-semibold bg-slate-500 px-8 py-1 rounded-md
     hover:bg-green-600 transition duration-100 active:scale-105"
          >
            ยืนยัน
          </div>
        ) : (
          <button
            className="font-Kanit text-lg font-semibold bg-green-500 px-8 py-1 rounded-md
     hover:bg-green-600 transition duration-100 active:scale-105"
          >
            ยืนยัน
          </button>
        )}
        <span className="text-blue-700 mt-5">
          จำรหัสผ่านไม่ได้? ติดต่อครูผู้สอน
        </span>
      </form>
      <footer
        onClick={() => {
          document.body.style.overflow = "auto";
          setTriggerNewPassword(() => false);
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></footer>
    </div>
  );
}

export default StudentSetPassword;
