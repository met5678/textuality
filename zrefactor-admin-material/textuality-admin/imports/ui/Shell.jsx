import React from "react";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import { useTracker, useSubscribe } from "meteor/react-meteor-data";

import Nav from "./modules/nav/Nav";
import Loading from "./generic/Loading/Loading";
import { Outlet } from "react-router-dom";

const Shell = ({ children }) => {
  const { loading } = useTracker(() => {
    return { loading: false };
  });

  if (loading) return <Loading />;

  return (
    <Container>
      <Box p={1}>
        <Nav />
      </Box>
      <Box p={1}>
        <Outlet />
      </Box>
    </Container>
  );
};

export default Shell;
