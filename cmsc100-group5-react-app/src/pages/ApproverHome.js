import Stepper from "../components/Stepper";
import React, { useState, useEffect, useRef } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar, GridValueGetterParams } from '@mui/x-data-grid';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { Button, Modal } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';

import Cookies from 'universal-cookie';
import { Link, useNavigate, useLoaderData } from "react-router-dom";

import ApproverHeader from "../components/ApproverHeader.js";

export default function ApproverHome(props) {
  //authentication
  const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData())
  const navigate = useNavigate()

  const [selectedApplication, setSelectedApplication] = useState("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
  }, [isLoggedIn, navigate])

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const columnsAdvsier = [
    // {
    //   field: 'id',
    //   headerName: 'ID',
    //   width: 70,
    //   type: 'text'
    // },
    {
      field: 'name',
      headerName: 'Student Name',
      width: 300,
      type: 'name'
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      type: 'text'
    },
    {
      field: 'datecreated',
      headerName: 'Date Submitted',
      width: 140,
      type: 'text'
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      width: 200,
      renderCell: (params) => (
        <Link to={`/approver-view-remarks/${params.row.id}`}>View All Remarks</Link>
      )
    },
    {
      field: 'submissions',
      headerName: 'Submissions',
      width: 200,
      renderCell: (params) => (
        <Link to={`/approver-view-submissions/${params.row.id}`}>View All Submissions</Link>
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <>
          <Button className='approve-Btn' variant="contained" color="success" onClick={() => { localStorage.getItem("userType") === "adviser" ? approvebyAdviser(params.row.id) : approvebyClearance(params.row.id, localStorage.getItem("upmail")) }}>Approve</Button>
          <Button className='reject-Btn' variant="contained" color="error" onClick={() => {setOpen(true); setSelectedApplication(params.row.id)}}>Return</Button>
        </>
        )
    }
  ]

  const columnsClearance = [
    // {
    //   field: 'id',
    //   headerName: 'ID',
    //   width: 70,
    //   type: 'text'
    // },
    {
      field: 'name',
      headerName: 'Student Name',
      width: 300,
      type: 'name'
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      type: 'text'
    },
    {
      field: 'datecreated',
      headerName: 'Date Submitted',
      width: 140,
      type: 'text'
    },
    {
      field: 'adviser',
      headerName: 'Adviser',
      width: 200,
      type: 'text'
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      width: 200,
      renderCell: (params) => (
        <Link to={`/approver-view-remarks/${params.row.id}`}>View All Remarks</Link>
      )
    },
    {
      field: 'submissions',
      headerName: 'Submissions',
      width: 200,
      renderCell: (params) => (
        <Link to={`/approver-view-submissions/${params.row.id}`}>View All Submissions</Link>
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <>
          <Button className='approve-Btn' variant="contained" color="success" onClick={() => { localStorage.getItem("userType") === "adviser" ? approvebyAdviser(params.row.id) : approvebyClearance(params.row.id, localStorage.getItem("upmail")) }}>Approve</Button>
          <Button className='reject-Btn' variant="contained" color="error" onClick={() => {setOpen(true); setSelectedApplication(params.row.id)}}>Return</Button>
        </>
        )
    }
  ]

  const [rows, setRows] = useState([])
  const renderAfterCalled = useRef(false);

  const userRef = useRef();

  const [remarks, setRemarks] = useState("");

  useEffect(()=>{
    if(!renderAfterCalled.current){
      console.log(localStorage.getItem("userType"))
      localStorage.getItem("userType") === "adviser" ? fetch(`http://localhost:3001/get-all-applications-pending?email=` + localStorage.getItem("upmail"))
      .then(response => response.json())
      .then(body =>{
        //convert the data to something useful
        console.log(JSON.stringify(body))
        console.log(body)
        body.map((application)=>{
          console.log(application.student_submission.submission_remark)
          const newRow = {
            id: application._id,
            name: application.student_name,
            status: application.status,
            datecreated: application.student_submission[application.student_submission.length - 1].submission_date,
          }
          setRows((oldRows)=>[...oldRows, newRow])
        })
      }) : fetch(`http://localhost:3001/get-all-applications-clearance`)
      .then(response => response.json())
      .then(body =>{
        //convert the data to something useful
        console.log(JSON.stringify(body))
        console.log(body)
        body.map((applicationAdviser)=>{
          const newRow = {
            id: applicationAdviser.applications[applicationAdviser.applications.length - 1]._id,
            name: applicationAdviser.applications[applicationAdviser.applications.length - 1].student_name,
            status: applicationAdviser.applications[applicationAdviser.applications.length - 1].status,
            datecreated: applicationAdviser.applications[applicationAdviser.applications.length - 1].student_submission[applicationAdviser.applications[applicationAdviser.applications.length - 1].student_submission.length - 1].submission_date,
            adviser: applicationAdviser.adviser.mname === "" ? applicationAdviser.adviser.fname + " " + applicationAdviser.adviser.lname : applicationAdviser.adviser.fname + " " + applicationAdviser.adviser.mname + " " + applicationAdviser.adviser.lname
          }
          console.log(newRow)
          setRows((oldRows)=>[...oldRows, newRow])
        })
      })
    }

    renderAfterCalled.current = true;
    
  },[])

  const approvebyAdviser = (application) => {
    fetch("http://localhost:3001/approve-by-adviser", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ applicationID: application })
    })
      .then(response => response.json())
      .then(body => {
        console.log(JSON.stringify(body))
        // check if Mongoose document was successfully edited/updated via the response returned
        if(body.success) {
          // setAccounts(accounts.filter(items=>items.studentno!==studno))
          setRows(rows.filter(row => row.id !== application))
          console.log(rows)
        }
      })}

      const approvebyClearance = (application, email) => {
        fetch("http://localhost:3001/approve-by-clearance", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ applicationID: application, email: email })
        })
          .then(response => response.json())
          .then(body => {
            console.log(JSON.stringify(body))
            // check if Mongoose document was successfully edited/updated via the response returned
            if(body.success) {
              // setAccounts(accounts.filter(items=>items.studentno!==studno))
              setRows(rows.filter(row => row.id !== application))
              console.log(rows)
            }
          })}
  
      const returnWithRemarks = (application) => {
        var todayDate = new Date()
        fetch("http://localhost:3001/add-remark-by-application-id", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ applicationID: application, app_remarks: remarks, remark_date: todayDate, commenter_email: localStorage.getItem("upmail"), step_given: 1})
        })
          .then(response => response.json())
          .then(body => {
            console.log(JSON.stringify(body))
            // check if Mongoose document was successfully edited/updated via the response returned
            if(body.success) {
              // setAccounts(accounts.filter(items=>items.studentno!==studno))
              setRows(rows.filter(row => row.id !== application))
              console.log(rows)
            }
          })
      }

  return (
    <div className="homepage">
      {isLoggedIn && <ApproverHeader onClick={props.onClick}/>}
      <h2 className="heading">Welcome, {localStorage.getItem("userType") === "clearanceOfficer" ? " Clearance Officer " : " Adviser "} {localStorage.getItem("username")}!</h2>
      <h1 className="heading">All Pending Clearance Applications</h1>
      <div className="table">
      <DataGrid
            slots={{ toolbar: GridToolbar }}
            className='data-table'
            sx={{
              fontFamily: 'Poppins',
              fontSize: '16px',
              color:"#001D3D;",
              '& .MuiToolbar-root *': {
                fontFamily: 'Poppins',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: "#001D3D",
                color: "white",
                fontWeight: "bold",
              },
              '& .MuiDataGrid-sortIcon': {
                color: "white",
              },
              '& .MuiDataGrid-menuIconButton': {
                color: "white",
              },
              '.MuiDataGrid-columnSeparator': {
                display: 'none',
              },
            }}
            rows={rows}
            columns={localStorage.getItem("userType") === "adviser" ? columnsAdvsier : columnsClearance}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              }
            }}
            pageSizeOptions={[5,10]}
          />
      </div>
      <Modal onClose={handleClose} open={open}>
      <div className="homepage">
      <div className="container addApprover">
        <h1 className="heading" id="signup">
          Add Remarks
        </h1>
        <form className="input-holder" autoComplete="off">
          <TextField
            label="Enter remarks"
            variant="outlined"
            size="medium"
            multiline
            maxRows={18}
            className="input-rounded fname"
            required
            inputRef={userRef}
            onChange={(e) => setRemarks(e.target.value)}
            sx={{
              "& .MuiFormLabel-root": {
                fontFamily: "Poppins",
              },
              "& .MuiFormLabel-asterisk": {
                fontSize: "16px",
              },
            }}
          />
          <Button className='reject-Btn' variant="contained" color="error" onClick={() => { setOpen(false); returnWithRemarks(selectedApplication)}}>Return</Button>
        </form>
        </div>
      </div>
        </Modal>
    </div>
  )
}