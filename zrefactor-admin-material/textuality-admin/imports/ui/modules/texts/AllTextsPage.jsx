import React from "react";
import Loading from "../../generic/Loading/Loading";

// import AllTextsTable from './AllTextsTable';

const AllTextsPage = ({ match }) => {
  return (
    <>
      <p>All Texts</p>
      <Loading />
    </>
  );
  //   return (
  //     <>
  //       <h2>All Texts</h2>
  //       <AllTextsTable />
  //     </>
  //   );
};

export default AllTextsPage;
