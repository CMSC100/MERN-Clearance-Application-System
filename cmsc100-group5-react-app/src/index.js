import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Components
import Root from "./pages/Root";
import Home from "./pages/Home";
import ViewSubmissions from "./pages/ViewSubmissions";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/view-submissions", element: <ViewSubmissions /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/login", element: <LogIn /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
