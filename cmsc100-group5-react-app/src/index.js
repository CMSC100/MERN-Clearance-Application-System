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
import Profile from "./pages/Profile";
import AdminHome from "./pages/AdminHome";
import AccountDetails from "./pages/AccountDetails";
import ApproverHome from "./pages/ApproverHome";
import AllRemarks from "./pages/ViewRemarks";
import AllSubmissions from "./pages/ViewSubmissionLinks";

// Send a POST request to API to check if the user is logged in. Redirect the user to /home if already logged in
const checkIfLoggedInOnLogIn = async () => {
  const res = await fetch("http://localhost:3001/checkifloggedin",
    {
      method: "POST",
      credentials: "include" 
    });

  const payload = await res.json();
  
    if (payload.isLoggedIn) {
      if(payload.userType == "admin") {
        return redirect("/admin-home")
      }
      else if(payload.userType == "adviser" || payload.userType == "clearanceOfficer") {
        return redirect("/approver-home")
      }
      else {
        return redirect("/home")
      }
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
    if (payload.isLoggedIn && payload.userType == "student") {
      return true
    } else {
      return redirect("/")
    }
}

const checkIfLoggedInAsAdmin = async () => {
  const res = await fetch("http://localhost:3001/checkifloggedin",
    {
      method: "POST",
      credentials: "include" 
    });


  const payload = await res.json();
    if (payload.isLoggedIn && payload.userType == "admin") {
      return true
    } else {
      return redirect("/")
    }
}

const checkIfLoggedInAsApprover = async () => {
  const res = await fetch("http://localhost:3001/checkifloggedin",
    {
      method: "POST",
      credentials: "include" 
    });


  const payload = await res.json();
    if (payload.isLoggedIn &&(payload.userType == "adviser" || payload.userType == "clearanceOfficer")) {
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
      { path: "/home", element: <Home />, loader: checkIfLoggedInOnDash},
      { path: "/admin-home", element: <AdminHome />, loader: checkIfLoggedInAsAdmin},
      { path: "/admin-home/:studentno", element: <AccountDetails />, loader: checkIfLoggedInAsAdmin},
      { path: "/approver-home", element: <ApproverHome/>, loader: checkIfLoggedInAsApprover},
      { path: "/approver-view-remarks/:params", element: <AllRemarks/>, loader: checkIfLoggedInAsApprover},
      { path: "/approver-view-submissions/:params", element: <AllSubmissions/>, loader: checkIfLoggedInAsApprover},
      { path: "/view-submissions", element: <ViewSubmissions />, loader: checkIfLoggedInOnDash },
      { path: "/profile-student", element: <Profile />, loader: checkIfLoggedInOnDash},
      { path: "/signup", element: <SignUp />, loader: checkIfLoggedInOnLogIn },
      { path: "/", element: <LogIn />, loader: checkIfLoggedInOnLogIn },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <RouterProvider router={router} />
  </>
);
