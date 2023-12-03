import Link from 'next/link';
import { useEffect, useState } from 'react';

const AdBanner = (props) => {
  const [isUnfilled, setIsUnfilled] = useState(false); // Set to true initially

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const adsInterval = setInterval(() => {
      const unfilled = document.querySelector(
        'ins.adsbygoogle[data-ad-status="unfilled"]',
      );

      const filled = document.querySelector(
        'ins.adsbygoogle[data-ad-status="filled"]',
      );

      if (unfilled) {
        clearInterval(adsInterval);
      } else if (filled) {
        setIsUnfilled(true);
        clearInterval(adsInterval);
      }
    }, 100); // Check every 100 milliseconds

    return () => clearInterval(adsInterval); // Cleanup the interval on component unmount
  }, []);

  return (
    <div className="w-full  ">
      {isUnfilled === true && (
        <Link
          href="/classroom/subscriptions"
          className={`fixed adsCancel s  no-underline z-30 left-1  bottom-1 m-auto w-max bg-green-600 transition duration-150 active:scale-105
                drop-shadow-md  hover:bg-green-800 text-white rounded-md px-5 py-1`}
        >
          ยกเลิกโฆษณา?
        </Link>
      )}
      <ins
        className="adsbygoogle adbanner-customize"
        style={{
          display: 'block',
          overflow: 'hidden',
        }}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
        {...props}
      />
    </div>
  );
};

export default AdBanner;
