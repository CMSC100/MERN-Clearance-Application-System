import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridToolbar, GridValueGetterParams } from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton } from '@mui/material';
import { PDFDownloadLink } from "@react-pdf/renderer"

import StudentHeader from '../components/StudentHeader';
import PDFDownloader from '../components/PDFDownload';


export default function ViewSubmissions(props) {
  const columns = [
    {
      field: 'step',
      headerName: 'Step',
      width: 80,
      type: 'number'
    },
    {
      field: 'link',
      headerName: 'Latest Submission',
      width: 400,
      type: 'link'
    },
    {
      field: 'status',
      headerName: 'Application Status',
      width: 200,
      type: 'text'
    },
    {
      field: 'datecreated',
      headerName: 'Submission Date',
      width: 200,
      type: 'text'
    },
    {
      field: 'download',
      headerName: 'Download PDF',
      width: 300,
      renderCell: (params) => (
        params.row.status == "cleared" ? <PDFDownloadLink document={<PDFDownloader application={params.row.id}/>} fileName="ClearanceForm">
          {({loading}) => (loading ? <Button sx={{
          bgcolor: "#001D3D",
          borderRadius: 20,
          fontFamily: 'Poppins',
          fontSize: 16,
          height: 40,
          width: 200,
          color: "white",
        }}
        variant="contained" startIcon={<DownloadIcon />} >
        Loading...
        </Button> : 
        
        <Button sx={{
          bgcolor: "#001D3D",
          borderRadius: 20,
          fontFamily: 'Poppins',
          fontSize: 16,
          height: 40,
          width: 200,
          color: "white",
        }}
        variant="contained" startIcon={<DownloadIcon />} >
        Download PDF
        </Button>)}
        </PDFDownloadLink> : <></>
      )
    }
  ]
  const [rows, setRows] = useState([])
  const renderAfterCalled = useRef(false);

  const [applicationStatus, setApplicationStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/get-application-status", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(response => response.json())
      .then(data => {
        setApplicationStatus(data.status);
      })
      .catch(error => {
        console.log("Error fetching application status:", error);
      })
  }, []);

  useEffect(()=>{
    if(!renderAfterCalled.current){
      fetch(`http://localhost:3001/get-applications-by-user?upmail=${localStorage.getItem("upmail")}`)
      .then(response => response.json())
      .then(body =>{
        //convert the data to something useful
        console.log(JSON.stringify(body))
        console.log(body)
        body.map((application)=>{
          console.log(application.student_submission.submission_remark)
          const newRow = {
            id: application._id,
            step: application.step,
            link: application.student_submission[application.student_submission.length- 1].submission_remark,
            status: application.status,
            datecreated: application.student_submission[application.student_submission.length- 1].submission_date,
            
          }
          setRows((oldRows)=>[...oldRows, newRow])
        })
      })
    }

    renderAfterCalled.current = true;
    
  },[])

    return (
      <div className="viewsub">
        {<StudentHeader onClick={props.onClick}/>}
        <h1 className="heading">View Clearance Applications</h1>
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