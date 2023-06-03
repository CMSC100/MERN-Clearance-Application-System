import { useEffect, useState } from "react"
import { useParams } from 'react-router-dom'
import { useNavigate, useLoaderData } from "react-router-dom"
import AdminHeader from "../components/AdminHeader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

import Cookies from 'universal-cookie';

export default function SubjectDetail() {

  let { studentno } = useParams()

  // state object that will store the corresponding details of subject from the backend server
  const [studentAcc, setStudentAcc] = useState({})
  const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData())
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoggedIn) {
          navigate("/")
        } else {
            fetch("http://localhost:3001/get-student-account-by-studno?studentno=" + Object.values({studentno})[0])
            .then(response => response.json())
        .then(body => {
            setStudentAcc(
                body
            )
        })
        }
    }, [isLoggedIn, navigate])

    function logout() {
        const cookies = new Cookies();
        cookies.remove("authToken");
     
        localStorage.removeItem("username");
     
        setIsLoggedIn(false)
      }

  return (
    <>
      {isLoggedIn && <AdminHeader onClick={logout}/>}
            <div className="container profile">
                <h1 className="heading profile">Student Profile</h1>
                <div className="divider"></div>
                <div className="user-info">
                    <FontAwesomeIcon icon={icon({name: 'user-circle'})} className="profile-user"/>
                    <p className="info">Full Name:<span className="info-content"> {studentAcc.mname == "" ? studentAcc.fname + " " + studentAcc.lname : studentAcc.fname + " " + studentAcc.mname + " " + studentAcc.lname}</span></p>
                    <p className="info">Student Number:<span className="info-content"> {studentAcc.studentno}</span></p>
                    <p className="info">Adviser:<span className="info-content"> {studentAcc.adviser}</span></p>
                    <p className="info">UP Mail:<span className="info-content"> {studentAcc.email}</span></p>
                </div>
            </div>
      {/* <h1>{code}</h1>
      <ul>First Name: {studentAcc.code}</ul>
      <ul>Middle Name: {studentAcc.title}</ul>
      <ul>Description: {studentAcc.description}</ul>
      <ul>Units: {studentAcc.units}</ul>
      <ul>Sem Offered: {studentAcc.sem_offered+""}</ul> */}
    </>
  )
}