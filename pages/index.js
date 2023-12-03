import React from "react";

function index() {
  return <div>index</div>;
}

export default index;
export async function getServerSideProps(ctx) {
  return {
    redirect: {
      permanent: false,
      destination: "/classroom/student",
    },
  };
}
