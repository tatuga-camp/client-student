import React, { useEffect } from "react";
import HomepageNavbar from "../components/navbars/homepageNavbar";
interface StudentLayout {
  children: React.ReactNode;
}

function StudentLayout({ children }: StudentLayout) {
  return (
    <>
      <main>
        <HomepageNavbar />
        <section>{children}</section>
      </main>
    </>
  );
}

export default StudentLayout;
