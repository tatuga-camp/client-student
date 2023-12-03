import { SlideshowLightbox } from 'lightbox.js-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { BiDownload } from 'react-icons/bi';
import ReactPlayer from 'react-player';

function ShowSelectFile({ file, setTriggerShowFile }) {
  const [loadingIframe, setLoadingIframe] = useState(true);
  const handleIframeLoading = () => {
    console.log('running');
    setLoadingIframe(() => false);
  };

  return (
    <main className="w-screen h-screen fixed z-50 top-0 bottom-0 right-0 left-0 flex items-center justify-center">
      <div className="w-10/12 h-3/6 overflow-hidden md:h-3/6 lg:h-5/6 p-5 rounded-md gap-5 bg-white flex flex-col justify-start items-center">
        <nav className="w-max max-w-full ">
          <a
            href={file.file}
            target="_blank"
            className="flex select-none no-underline hover:bg-blue-700
             active:scale-105 transition duration-150 justify-center  items-center gap-2
           bg-blue-500 text-white rounded-full px-4 py-1"
          >
            download file
            <BiDownload />
          </a>
        </nav>
        <div className="w-full h-full relative">
          {file.type === 'image/jpeg' ||
          file.type === '' ||
          file.type === 'image/png' ? (
            <Image
              src={file.file}
              alt="files in assignment"
              fill
              className="object-contain"
              data-lightboxjs="lightbox1"
              quality={100}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAYAAACMo1E1AAAACXBIWXMAAAWJAAAFiQFtaJ36AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAhxSURBVHgBzVhbbFxXFV3nvmc8fo4d2/FDiUkc0TYCIUCp2kJKq6blJWg/+OH5A1KFhPgBfnhERaoQQggkBEgUCQlUUKl4VFT0Aym0gChIlWhD0qZpkzhO4viV+Dlz79x7T9fZ987EjjseT5qPHif2fZx7ztpr7732vldpDrQxNH8Uf+pnaBzf9HHUQZtDbQJTP06RmUjgyrru3o2PtsFlbBk8Nf5bQFo9j7RyDjq+wlsJYHfA8odgF/ZC8a+yOohT3RDgtsHpJCKYV1Cbfwa1xWM8fhVptEiwUba38qDsIgEOw+5+L7zy/fx7CJZXbhuc2nnMaaThRUSXf49o5nEkq/8HrE64vbeTvYuIl18ggAG4uz4OTUajuacFsPIHCfA++Lu/QJDvI5NefblWWHcYczpFsn4K1XM/ILg/cPMr4ipv4CEU9z+CZOVFrJ18GE7PIRTe8U2yOYVk+UXEay9DhRcQXvy1zPH3fJXPfIwASzsicQfgUm52GpXXv4to9o88DXPAXN/pphf7YZduhRWMk7kRXuuBctck9hQNyBxTE2bT09+W573BT9H1hZY7Wy2hRXOonP2RALO8QfjDn4bd+a4syJMlgoxpYofEmKJbjb3Kos3mvzJ/vRwgjVx/DdWzP0R89bksedoGpzchQ23uKQJ7Uo7d8r0o7H8Uhb3fgO2PIo2XJGtNRtqFPQRX5rFZ0oVlFYitD3ZxH1lyG4snaydRPf9TEngB7YPbEAtp5SyiS78R9jQtTddf58Uq3P4jcIcelOM0rQg7VnE/LLc3W4CMGbdZ/oBcV5a/YdmEWf53RPNMGF1De+AaDMaoXXlWAtmwaZiIV4/z2jGRCn/4s7AKE8YCbmyT1cOwu94j4JRFppwSsZ+jC/9FDzJOGZ/mmtJZONRmn0ISzmG74TTHtoLYgKst0WWj8Ec+x+w7QTc/DbfvbibBO+GPPUy2BoQsq7Ave05OyJRbJigDXJPp++AOfIJ5MYfq1I+hwxka/RI9cQJ2sBttM2dcmaye5OIJmSgS0BEUJh6BCkbolmcFhFO6hR7sQq6+GWvmDt3s9NwJp/dOeLs/j+Lk9xHQOKf3MLO4SzxhtDBl/BmZap+52jwDfkHwJ3RPNPsEwX0LwfiXka6eyCqCcd8Wvcpizht8kAL9AR52CqA0nKbe/ZKunpYpmvGWmLKnKdQqaA8czaJRlQwo3RPNPMmwOcRNH6IrxgWASAQtz4q9QaklHCQBTLYGY8JSGi8inPoJwpnf8WQ9t56MRfPmZlP/NbmsZWMJXuk0FIm6hOr0L1gpXsuACbuMHaNZhkXZr8pA/xPnvIJMk4xSs7pceQ7Vy48DBC7z8tJFYTEsoNnYAq5Rao2Ci4DWDU2o8v8RMdZUeRNdillo3KSN9TKob6XbmAz9qMegjq7yGZa86qXc7LxJoeHK6Zc9dgxO5e2NRQFV1K16tyPXk3V2I3+VbJNBt7n9H4XRLrYFhBLT5SPcb1djvTSaZp19IQ98hbq1JmmswhjXbR5ZTe4o6ckcCmiy+pKwll1NReHjpefhBWMSa2mywuz9GwENM96uivg65SOyqRFuU1MTVgMJE5MrfEYTqEXdszsOZCVup8w14DHDbJNtFFzDWsaocdMiO5PfSvbJAh6NMOKbMhE8lque2zMRNg40LdbsnxmbS7kH6jFsCTCbIbDdaF4huIHbdxhWxy2o64Wx2LgvZpMZXniMZXVRCrxdOkiR/SSl455MlLmsjteYnU8gWWTCNII+dyk7FmfgIzRmCG2B0xt+Wyza/hDbG7e7AVBZAS0vMXMfQ3T+Z5SZ1eyess3N7GnGpmEsnP45EspIZlieWZzjmA5Z+jqvPXBq428CMWLqlR8QJo1rLYdZHAxJwxnO/YVunt9sHNk19bRy5lGRHVVvc/KwsNi9eKNfouETaDWaS0l9gj+GgB2s2/tBru1K/CTscE1HYQejEpvXrcAkOk6JYQcjb2W6YbbFJArGv0LW6FLlolU73FRKrl1g8Ha+G8V936FsfDjTP7qNO7FW3pXX1g3T2c3oaIHam+SqQe6MK4uTCPZ+jd3MZ2hQqWHIdqN1my6qafPl5P0oHvgeogu/QsiXHPqH4O7I6uvG6WQ0jWb4WCyNp2nbHWZwMPpFOH0fkmTYYAreGriGBBAgdS+Y+Dqc/nsoJfPSSG4ZLGWmmJsO2O64lVl8P7P+XnHpVk3b/hWs5athnGiEcQrHtuDZmU5lcJMsQ+sykx9FUQULM/9GwQ/Q1TtBYsub5l2Dpa/7erBlbP9qaHC/ejnEP08v48BwgMnBApJUo1JLMdzlEV4W8AlxOgReoyGnZmKcWbgNB0c6sCf1UatoeA7VkZNsGmgRD5dA4CqoFq+HLd3aVWA/x8Xml2P849QsRnp9rEcpRnocLFUSsqqxUk3R4VlYCxO4joW7JksYJPhnji9hajFEueTg0tUaugs2BrpcRPTEAwd70FN0bhycydxOghvrdeG7Fnq52GC3i7BGUGQrIjCXjM2tRCj1043c3CMj/z2zhl1dbCZZGEq+TbaUPJfQyuPT6+jpsOVeq9GSuZKncPceygk3uGOcLyjKuMjKGwwfUwtVDLsahyZ9smajRsAzKwkKfK6/VGS1qEr10pYtbn/+TIL9wyX0FXeQi60SQldZns7/j5uwZ/P4Fm+z26gs0yxX3kejqtmc7nTtrArE7PWCriwJOAfLC9JUKjdAymcjxqvXPwq7PIIWUnK09Ycc82ZeC68tZOqnzgRWPjfENdEzbYDVezYra9vlPoEryU1zLf9+Z16y7ZbM7eBDjmHAK269XP/rFTadN52H9kfLbyXtjfy9oX6m9cazN5m7/biBL5vbjc38bK7Tatu5bzZuMnM3dxjmjuLtOY69AczUjTdbN6QuAAAAAElFTkSuQmCC"
            />
          ) : file.type === 'video/mp4' || file.type === 'video/quicktime' ? (
            <ReactPlayer
              playsinline
              controls
              width="100%"
              height="90%"
              url={file.file}
            />
          ) : file.type === 'application/pdf' ? (
            <embed
              src={file.file}
              type="application/pdf"
              frameBorder="0"
              scrolling="auto"
              height="100%"
              width="100%"
            ></embed>
          ) : file.type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
            <div className="w-full h-full flex items-center flex-col  justify-center">
              {loadingIframe && (
                <div className="relative w-full">
                  <div
                    className=" flex-col w-full gap-2 bg-slate-200 h-96 animate-pulse
                   flex justify-center items-center"
                  ></div>
                  <div
                    className="absolute flex flex-col
                             top-0 bottom-0 justify-center items-center right-0 left-0 m-auto "
                  >
                    <a
                      target="_blank"
                      href={file.file}
                      className="w-60 cursor-pointer hover:scale-105 transition duration-100
                                 text-center h-8 no-underline font-semibold text-lg
                             px-5 bg-blue-400 py-1 rounded-full text-white"
                    >
                      คลิกเพื่อดาวน์โหลด
                    </a>
                    กำลังแสดงไฟล์ DOC ...
                  </div>
                </div>
              )}
              <iframe
                onLoad={handleIframeLoading}
                width={loadingIframe ? '0px' : '100%'}
                height={loadingIframe ? '0px' : '500px'}
                src={`https://docs.google.com/gview?url=${file.file}&embedded=true`}
              ></iframe>
            </div>
          ) : file.type === 'audio/mpeg' || file.type === 'audio/mp3' ? (
            <div className="flex items-center justify-center h-full">
              <audio src={file.file} controls={true} autoPlay={false} />
            </div>
          ) : (
            <div
              className="w-full h-full flex text-white font-semibold text-xl
             items-center justify-center bg-slate-400"
            >
              File Not Supported
            </div>
          )}
        </div>
      </div>
      <footer
        onClick={() => {
          document.body.style.overflow = 'auto';
          setTriggerShowFile(() => false);
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></footer>
    </main>
  );
}

export default ShowSelectFile;
