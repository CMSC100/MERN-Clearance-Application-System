import Stepper from "../components/Stepper";
import React, { useState, useEffect } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
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
        }
        else { alert("Application failed")}
      })
  }

  const [currentStep, updateCurrentStep] = useState(1);

  const [submissionRemark, setSubmissionRemark] = useState('')

  const steps = [
    {
      title: "Submit your GitHub repository",
      element: <TextField 
        className="link-field"
        label="Link to your GitHub repository"
        variant="outlined"
        size="normal"
        required
        onChange={
          (e) => setSubmissionRemark(e.target.value)
        }
        InputProps={{endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="arrow-right" onClick={submitApplication}>
              <ArrowCircleRightIcon sx={{color:"#001D3D", fontSize:35}} disabled={currentStep !== 0} />
            </IconButton>
          </InputAdornment>
        )}}
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
          height: 60, // Adjust the height as per your preference
          width: 200, // Adjust the width as per your preference
          color: "white",
        }}
        variant="contained" startIcon={<DownloadIcon />} >
        Download PDF
        </Button>)}
      </PDFDownloadLink>
    },
  ]

  function updateStep(step) {
    updateCurrentStep(step);
  }

  return (
    <div className="homepage">
      {isLoggedIn && <StudentHeader onClick={props.onClick}/>}
      <h1 className="heading">Welcome, { username }!</h1>
      <div className="stepper-holder">
        <Stepper steps={steps} />
      </div>
    </div>
  )
}