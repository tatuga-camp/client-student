import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import { useRouter } from "next/router";
function Layout({ children, unLoading }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  //check whether there is any loading from the borwser
  useEffect(() => {
    const handleStart = (url) => url !== router.asPath && setLoading(true);
    const handleComplete = (url) => url === router.asPath && setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, []);
  return (
    <>
      <main>
        <Navbar />
        <section>{children}</section>
      </main>
    </>
  );
}

export default Layout;
