import Stepper from "../components/Stepper";
import { useState, useEffect, useRef } from "react";
import * as React from 'react';
import { Icon, IconButton, InputAdornment, TextField } from "@mui/material";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Button from "@mui/material/Button";
import DownloadIcon from '@mui/icons-material/Download';
import PDFDocument from "../components/GeneratePDF";
import { PDFDownloadLink } from "@react-pdf/renderer"

import Cookies from 'universal-cookie';
import { Link, useNavigate, useLoaderData } from "react-router-dom";

import StudentHeader from "../components/StudentHeader";

export default function Home(props) {
  //authentication
  const username = localStorage.getItem("username")
  const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData())
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
  }, [isLoggedIn, navigate])

  function submitApplication(){
    var todayDate = new Date()
    fetch(`http://localhost:3001/get-applications-by-user?upmail=${localStorage.getItem("upmail")}`)
      .then(response => response.json())
      .then(body =>{ 
        console.log(body.length)
        if(body.length > 0) {
          console.log("APPENDING TO CURRENT APPLICATION")
          if(body[body.length - 1].status !== "cleared") {
            fetch("http://localhost:3001/add-submission-by-application-id",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                upmail: localStorage.getItem("upmail"),
                applicationID: body[body.length - 1]._id,
                submission_date: todayDate,
                submission_remark: submissionRemark, step_given: currentStep
              })
            })
            .then(response => response.json())
            .then(body => {
              if (body.success) {
                alert("Successfully submitted!")
                // updateStep();
              }
              else { alert("Submission failed") }
            }) 
          } else {
            fetch("http://localhost:3001/add-application",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            upmail: localStorage.getItem("upmail"),
            submission_remark: submissionRemark
          })
        })
        .then(response => response.json())
        .then(body => {
          if (body.success) {
            alert("Successfully added application")
            // updateStep();
          }
          else { alert("Application failed") }
        })
          }
       
      } else {
        console.log("ADDING NEW APPLICATION")
        fetch("http://localhost:3001/add-application",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            upmail: localStorage.getItem("upmail"),
            submission_remark: submissionRemark
          })
        })
        .then(response => response.json())
        .then(body => {
          if (body.success) {
            alert("Successfully added application")
            // updateStep();
          }
          else { alert("Application failed") }
        })
      }})
  }

  // const [stepper, setStepper] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:3001/get-latest-application-by-user?upmail=${localStorage.getItem("upmail")}`,
    {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(response => response.json())
      .then(body => {
        console.log(JSON.stringify(body[0].step))
        updateCurrentStep(body[0].step-1);
      })
      .catch(error => {
        console.log("Error fetching application status:", error);
      })
  }, [])

  var [currentStep, updateCurrentStep] = useState(0);

  function updateStep () {
    updateCurrentStep(prevStep => prevStep+1);
    console.log(currentStep);
  }

  const [submissionRemark, setSubmissionRemark] = useState('')

  const [applicationStatus, setApplicationStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/get-application-status", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        upmail: localStorage.getItem("upmail"),
        submission_remark: submissionRemark,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setApplicationStatus(data.status);
        updateStep();
      })
      .catch(error => {
        console.log("Error fetching application status:", error);
      })
  }, []);

  const steps = [
    {
      title: "Submit your GitHub repository",
      element: <form className="github-field"><TextField 
        className="link-field"
        label="Link to your GitHub repository"
        variant="outlined"
        size="normal"
        type="link"
        required
        onChange={
          (e) => setSubmissionRemark(e.target.value)
        }
        sx={{
          backgroundColor:"white",
          '& .MuiFormLabel-root': {
            fontFamily: 'Poppins',
            fontSize:20,
          },
          '& .MuiFormLabel-asterisk': {
            fontSize: "20px"
          }
        }}
        />
        <IconButton aria-label="arrow-right" onClick={submissionRemark ? submitApplication : null} children={<ArrowCircleRightIcon sx={{color:"#001D3D", fontSize:35}} disabled={currentStep !== 0} />}></IconButton>
        </form>
    },
    {
      title: "Adviser's review and approval",
      element: null
    },
    {
      title: "Clearance Officer's review and approval",
      element: null
    },
    {
      title: "Download your approved clearance",
      element: <PDFDownloadLink document={<PDFDocument/>} fileName="ClearanceForm">
        {({loading}) => (loading ? <Button sx={{
          bgcolor: "#001D3D",
          borderRadius: 20,
          fontFamily: 'Poppins',
          fontSize: 16,
          height: 60,
          width: 200,
          color: "white",
        }}
        variant="contained" startIcon={<DownloadIcon />} >
        Loading document...
        </Button> : 
        
        <Button sx={{
          bgcolor: "#001D3D",
          borderRadius: 20,
          fontFamily: 'Poppins',
          fontSize: 16,
          height: 60,
          width: 200,
          color: "white",
        }}
        disabled={currentStep !== 3}
        variant="contained" startIcon={<DownloadIcon />} >
        Download PDF
        </Button>)}
      </PDFDownloadLink>
    },
  ]

  return (
    <div className="homepage">
      {isLoggedIn && <StudentHeader onClick={props.onClick}/>}
      <h1 className="heading">Welcome, { username }!</h1>
      <div className="stepper-holder">
        <Stepper steps={steps[0]} index={0} currentStep={currentStep} />
        <Stepper steps={steps[1]} index={1} currentStep={currentStep} />
        <Stepper steps={steps[2]} index={2} currentStep={currentStep} />
        <Stepper steps={steps[3]} index={3} currentStep={currentStep} />
      </div>
    </div>
  )
}