import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";

// Components
import Root from "./pages/Root";
import Home from "./pages/Home";
import ViewSubmissions from "./pages/ViewSubmissions";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";

// Send a POST request to API to check if the user is logged in. Redirect the user to /home if already logged in
const checkIfLoggedInOnLogIn = async () => {
  const res = await fetch("http://localhost:3001/checkifloggedin",
    {
      method: "POST",
      credentials: "include" 
    });

  const payload = await res.json();
  
    if (payload.isLoggedIn) {
      return redirect("/home")
    } else {
      return 0
    }
}

// Send a POST request to API to check if the user is logged in. Redirect the user back to / if not logged in
const checkIfLoggedInOnDash = async () => {
  const res = await fetch("http://localhost:3001/checkifloggedin",
    {
      method: "POST",
      credentials: "include" 
    });


  const payload = await res.json();
    if (payload.isLoggedIn) {
      return true
    } else {
      return redirect("/")
    }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/home", element: <Home name="User" />, loader: checkIfLoggedInOnDash},
      { path: "/view-submissions", element: <ViewSubmissions />, loader: checkIfLoggedInOnDash },
      { path: "/signup", element: <SignUp />, loader: checkIfLoggedInOnLogIn },
      { path: "/", element: <LogIn />, loader: checkIfLoggedInOnLogIn },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
