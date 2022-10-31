import React from "react";

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import Shell from "./Shell";
import AllTextsPage from "./modules/texts/AllTextsPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Shell />} path="/">
      <Route element={<AllTextsPage />} path="texts" />
    </Route>
  )
);

export const App = () => <RouterProvider router={router} />;
