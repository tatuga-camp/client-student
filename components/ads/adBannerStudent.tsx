import Link from "next/link";
import { useEffect, useState } from "react";
interface AdBannerStudent {
  data_ad_slot: string;
  data_ad_format: "auto";
  data_full_width_responsive: "true" | "false";
}
interface ExtendedWindow extends Window {
  adsbygoogle?: any[];
}
const AdBannerStudent = ({
  data_ad_slot,
  data_ad_format,
  data_full_width_responsive,
}: AdBannerStudent) => {
  const [isUnfilled, setIsUnfilled] = useState(false); // Set to true initially

  useEffect(() => {
    try {
      ((window as ExtendedWindow).adsbygoogle =
        (window as ExtendedWindow).adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className="w-full">
      <ins
        className="adsbygoogle adbanner-customize"
        style={{
          display: "block",
          overflow: "hidden",
        }}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
        data-ad-slot={data_ad_slot}
        data-ad-format={data_ad_format}
        data-full-width-responsive={data_full_width_responsive}
      />
    </div>
  );
};

export default AdBannerStudent;
