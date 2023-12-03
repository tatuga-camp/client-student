import { Editor } from '@tinymce/tinymce-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { BiChevronsLeft } from 'react-icons/bi';
import { FcCancel } from 'react-icons/fc';
import Swal from 'sweetalert2';
import Loading from '../loading/loading';
import { SummitWorkWithWorkSheet } from '../../service/student/assignment';
import { Skeleton } from '@mui/material';
import { UpdateStudentWorkSheetService } from '../../service/student/studentWork';

function CreateStudentWork({
  body,
  setTriggerCreateStudentWork,
  fetchStudentWork,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [assignmentBody, setAssignmentBody] = useState(body);
  const [updateAssignmentBody, setUpdateAssignmentBody] = useState();
  const [loadingTiny, setLoadingTiny] = useState(false);
  useEffect(() => {
    setUpdateAssignmentBody(() => fetchStudentWork?.data?.data?.body);
    setAssignmentBody(() => body);
  }, [body]);

  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        setTriggerCreateStudentWork(() => false);
        window.history.pushState(null, '', router.asPath);
        return false;
      }
      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]); // Add any state variables to dependencies array if needed.

  const handleSummitWork = async (e) => {
    try {
      e.preventDefault();
      Swal.fire({
        title: 'กำลังส่งงาน...',
        html: 'รอสักครู่นะครับ...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      await SummitWorkWithWorkSheet({
        body: assignmentBody,
        assignmentId: router.query.assignmentId,
        studentId: router.query.studentId,
      });
      await fetchStudentWork.refetch();

      setTriggerCreateStudentWork(() => false);

      Swal.fire('success', 'Sucessfully Summited Work', 'success');
    } catch (err) {
      if (
        err?.props?.response?.data?.message ===
        "student's already summit their work"
      ) {
        Swal.fire(
          'error',
          'นักเรียนได้ส่งงานแล้ว ถ้าจะส่งใหม่ให้ติดต่อครูผู้สอนเพื่อลบงานเดิม',
          'error',
        );
      } else {
        Swal.fire('error', err?.props?.response?.message, 'error');
      }
      console.log(err);
    }
  };

  const handleUpdateStudentWork = async () => {
    try {
      Swal.fire({
        title: 'กำลังอัพเดทงาน...',
        html: 'รอสักครู่นะครับ...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      await UpdateStudentWorkSheetService({
        body: updateAssignmentBody,
        studentWorkId: fetchStudentWork?.data?.data?.id,
      });
      await fetchStudentWork.refetch();

      setTriggerCreateStudentWork(() => false);

      Swal.fire('success', 'Sucessfully Updated Work', 'success');
    } catch (err) {
      console.log(err);

      Swal.fire(
        'error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
    }
  };

  return (
    <div className="w-screen fixed z-50 flex flex-col justify-center  items-center h-screen bg-white">
      <div className="h-4/6  w-11/12 md:w-7/12 ">
        {loadingTiny ? (
          <Skeleton width="100%" height="100%" />
        ) : fetchStudentWork?.data?.data?.status === 'no-work' ? (
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
            textareaName="body"
            init={{
              link_context_toolbar: true,
              setup: function (editor) {
                editor.on('init', function () {
                  setLoadingTiny(() => false);
                });
              },
              placeholder: 'no work',
              height: '100%',
              width: '100%',
              toolbar_location: 'top',
              menubar: true,
              paste_data_images: false,
              plugins: [
                'advlist',
                'autolink',
                'lists',
                'link',
                'charmap',
                'preview',
                'anchor',
                'searchreplace',
                'visualblocks',
                'code',
                'fullscreen',
                'insertdatetime',
                'media',
                'table',
                'help',
                'wordcount',
              ],
              toolbar:
                'undo redo | formatselect | blocks | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help | link ',
              content_style:
                'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
            }}
            value={assignmentBody}
            onEditorChange={(newText) => {
              setAssignmentBody(() => newText);
            }}
          />
        ) : (
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
            textareaName="body"
            init={{
              link_context_toolbar: true,
              setup: function (editor) {
                editor.on('init', function () {
                  setLoadingTiny(() => false);
                });
              },
              placeholder: 'have work',
              height: '100%',
              width: '100%',
              toolbar_location: 'top',
              menubar: true,
              paste_data_images: false,
              plugins: [
                'advlist',
                'autolink',
                'lists',
                'link',
                'charmap',
                'preview',
                'anchor',
                'searchreplace',
                'visualblocks',
                'code',
                'fullscreen',
                'insertdatetime',
                'media',
                'table',
                'help',
                'wordcount',
              ],
              toolbar:
                'undo redo | formatselect | blocks | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help | link ',
              content_style:
                'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
            }}
            value={updateAssignmentBody}
            onEditorChange={(newText) => {
              setUpdateAssignmentBody(() => newText);
            }}
          />
        )}
      </div>
      <div className="flex justify-center mt-2 items-center gap-3">
        <button
          onClick={() => {
            setTriggerCreateStudentWork(() => false);
          }}
          className="w-28 bg-red-400 text-red-900 hover:bg-red-500 transition duration-150 active:ring-2 ring-black
          font-medium rounded-md flex items-center justify-center h-10"
        >
          <span className="text-sm uppercase">ยกเลิก</span>
        </button>
        {fetchStudentWork?.data?.data?.status !== 'no-work' ? (
          <button
            onClick={handleUpdateStudentWork}
            className="w-28 bg-green-400 text-green-900 hover:bg-green-500 transition duration-150 active:ring-2 ring-black
            font-medium rounded-md flex items-center justify-center h-10"
          >
            ตกลง
          </button>
        ) : loading ? (
          <div className="mt-2">
            <Loading />
          </div>
        ) : (
          <button
            onClick={handleSummitWork}
            className="w-28 bg-green-400 text-green-900 hover:bg-green-500 transition duration-150 active:ring-2 ring-black
             font-medium rounded-md flex items-center justify-center h-10"
          >
            ตกลง
          </button>
        )}
      </div>
    </div>
  );
}

export default CreateStudentWork;
