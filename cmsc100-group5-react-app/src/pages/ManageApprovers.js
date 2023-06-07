import React, { useEffect, useState } from "react"
import { useNavigate, useLoaderData } from "react-router-dom"
import AdminHeader from "../components/AdminHeader"
import AccountCard from "../components/AccountCard";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

import Cookies from 'universal-cookie';
import { Button } from "@mui/material";
import { useRef } from "react";

export default function ManageApprovers(props) {
  const [accounts, setAccounts] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData())
  const navigate = useNavigate()

  const [rows, setRows] = useState([])
  const renderAfterCalled = useRef(false);

  const columns = [
    // {
    //   field: 'id',
    //   headerName: 'ID',
    //   width: 70,
    //   type: 'text'
    // },
    {
      field: 'approverName',
      headerName: 'Approver Name',
      width: 300,
      type: 'name'
    },
    {
      field: 'approverType',
      headerName: 'Approver Type',
      width: 300,
      type: 'text'
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <>
          <Link to={`/edit-approver/${params.row.id}`}><Button className='approve-Btn' variant="contained" color="success">Edit</Button></Link>
          <Button className='reject-Btn' variant="contained" color="error" onClick={() => { removeApprover(params.row.id)}}>Remove</Button>
        </>
        )
    }
  ]

  useEffect(() => {
        if (!isLoggedIn) {
          navigate("/")
        } else {
            fetch("http://localhost:3001/get-approver-accounts")
            .then(response => response.json())
            .then(body => {
              console.log(JSON.stringify(body))
              console.log(body)
              body.map((account)=>{
                const newRow = {
                  id: account.email,
                  approverName: account.mname === "" ? account.fname + " " + account.lname : account.fname + " " + account.mname + " " + account.lname,
                  approverType: account.userType === "adviser" ? "Adviser" : "Clearance Officer"
                }
                setRows((oldRows)=>[...oldRows, newRow])
            })}
            )
    }}, [isLoggedIn, navigate])

    function logout() {
        const cookies = new Cookies();
        cookies.remove("authToken");
     
        localStorage.removeItem("username");
     
        setIsLoggedIn(false)
      }

        const removeApprover = (email) => {
          console.log(email)
            fetch("http://localhost:3001/delete-approver-account", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ upmail: email })
            })
              .then(response => response.text())
              .then(body => {
        
                // when student account request is rejected, the user must then be deleted in the database
                // check if Mongoose document was successfully deleted via the response returned
                if(Object.values(body)[0] ? "true" : "false" == "true") {
                    // setAccounts(accounts.filter(items=>items.studentno!==studno))
                    setRows(rows.filter(row => row.id !== email))
                }
              })
            }

    return(
      <div className="homepage">
        {isLoggedIn && <AdminHeader onClick={props.onClick}/>}
        <h2 className="heading">Welcome, Admin {localStorage.getItem("username")}!</h2>
        <h1 className="heading">Manage Approver Accounts</h1>
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