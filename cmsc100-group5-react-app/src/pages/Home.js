import Stepper from "../components/Stepper";
import React, { useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

export default function Home(prop) {
  const user = prop.name;
  
  const [currentStep, updateCurrentStep] = useState(1);

  const steps = [
    {
      title: "Submit your GitHub repository",
      element: <TextField 
        className="link-field"
        label="Link to your GitHub repository"
        variant="outlined"
        size="normal"
        required
        InputProps={{endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="arrow-right">
              <ArrowCircleRightIcon sx={{color:"#001D3D", fontSize:35}} />
            </IconButton>
          </InputAdornment>
        )}}
        sx={{
          '& .MuiFormLabel-root': {
            fontFamily: 'Poppins', fontSize:20
          }}}
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
      element: null
    },
  ]

  function updateStep(step) {
    updateCurrentStep(step);
  }

  return (
    <div className="homepage">
      <h1 className="heading">Welcome, { user }!</h1>
      <div className="stepper-holder">
        <Stepper steps={steps} />
      </div>
    </div>
  )
}