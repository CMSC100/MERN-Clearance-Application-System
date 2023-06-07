import { useParams, useNavigate, useLoaderData } from "react-router-dom"
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridToolbar, GridValueGetterParams } from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton } from '@mui/material';
import { PDFDownloadLink } from "@react-pdf/renderer"

import ApproverHeader from "../components/ApproverHeader";

export default function AllRemarks(props) {

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
        field: 'commentername',
        headerName: 'Approver Name',
        width: 300,
        type: 'link'
      },
      {
        field: 'remark',
        headerName: 'Remarks',
        width: 500,
        type: 'text'
      },
      {
        field: 'notif_date',
        headerName: 'Date of Remark',
        width: 200,
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
        fetch(`http://localhost:3001/get-all-remarks/?id=${params}`)
        .then(response => response.json())
        .then(body => {
          console.log(JSON.stringify(body))
          console.log(body)
          body.map((remarks)=>{
          const newRow = {
            id: remarks._id,
            step_given: remarks.step_given,
            commentername: remarks.commenter.mname === "" ? remarks.commenter.fname + " " + remarks.commenter.lname : remarks.commenter.fname + " " + remarks.commenter.mname + " " + remarks.commenter.lname,
            remark: remarks.app_remark, 
            notif_date: new Date(remarks.remark_date),
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
        <h1 className="heading">Application's Remarks</h1>
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