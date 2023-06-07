import { useParams, useNavigate, useLoaderData } from "react-router-dom"
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridToolbar, GridValueGetterParams } from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton } from '@mui/material';
import { PDFDownloadLink } from "@react-pdf/renderer"

import ApproverHeader from "../components/ApproverHeader";

export default function AllSubmissions(props) {

    let { params } = useParams()
    const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData())
    const navigate = useNavigate()

    const columns = [
      {
        field: 'step_given',
        headerName: 'Step',
        width: 80,
        type: 'number'
      },
      {
        field: 'submission',
        headerName: 'Submission',
        width: 500,
        type: 'link'
      },
      {
        field: 'date_submitted',
        headerName: 'Submission Date',
        width: 400,
        type: 'text'
      },
    ]
    const [rows, setRows] = useState([])
    const renderAfterCalled = useRef(false);

    useEffect(() => {
        if (!isLoggedIn) {
          navigate("/")
        }
        if(!renderAfterCalled.current){
        fetch(`http://localhost:3001/get-all-submissions/?id=${params}`)
        .then(response => response.json())
        .then(body => {
          console.log(JSON.stringify(body))
          console.log(body)
          body.map((submissions)=>{
          const newRow = {
            id: submissions._id,
            step_given: submissions.step_given,
            submission: submissions.submission_remark,
            date_submitted: new Date(submissions.submission_date),
            // commenter name
          }
          setRows((oldRows)=>[...oldRows, newRow])
        })
        })
      }
      renderAfterCalled.current = true
      }, [isLoggedIn, navigate])

      return(
          <div className="viewsub">
        {<ApproverHeader onClick={props.onClick}/>}
        <h1 className="heading">Application's Submissions</h1>
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