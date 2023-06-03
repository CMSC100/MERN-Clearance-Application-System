import Stepper from "../components/Stepper";
import React, { useState, useEffect, useRef } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Button from "@mui/material/Button";
import DownloadIcon from '@mui/icons-material/Download';

import Cookies from 'universal-cookie';
import { Link, useNavigate, useLoaderData } from "react-router-dom";

import ApproverHeader from "../components/ApproverHeader.js";

export default function ApproverHome(props) {
  //authentication
  const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData())
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
  }, [isLoggedIn, navigate])

  const columns = [
    // {
    //   field: 'id',
    //   headerName: 'ID',
    //   width: 70,
    //   type: 'text'
    // },
    {
      field: 'name',
      headerName: 'Student Name',
      width: 400,
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
    }
  ]

  const [rows, setRows] = useState([])
  const renderAfterCalled = useRef(false);

  useEffect(()=>{
    if(!renderAfterCalled.current){
      fetch(`http://localhost:3001/get-all-applications`)
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
      })
    }

    renderAfterCalled.current = true;
    
  },[])

  return (
    <div className="homepage">
      {isLoggedIn && <ApproverHeader onClick={props.onClick}/>}
      <h2 className="heading">Welcome, {localStorage.getItem("userType") === "clearanceOfficer" ? " Clearance Officer " : " Adviser "} {localStorage.getItem("username")}!</h2>
      <h1 className="heading">All Pending Clearance Applications</h1>
      <div className="table">
      <DataGrid
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
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              }
            }}
            pageSizeOptions={[5,10]}
          />
      </div>
    </div>
  )
}