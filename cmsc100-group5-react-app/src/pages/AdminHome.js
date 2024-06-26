import React, { useEffect, useState } from "react"
import { useNavigate, useLoaderData } from "react-router-dom"
import AdminHeader from "../components/AdminHeader"
import AccountCard from "../components/AccountCard";
import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Papa from 'papaparse';

import Cookies from 'universal-cookie';
import { Button, Modal } from "@mui/material";
import { useRef } from "react";

export default function AdminHome(props) {
  const [accounts, setAccounts] = useState([])
  const [advisers, setAdvisers] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData())
  const navigate = useNavigate()

  const [rows, setRows] = useState([])
  const [selectedStudent, setSelectedStudent] = useState("")
  const [open, setOpen] = useState(false)
  const renderAfterCalled = useRef(false);

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const columns = [
    // {
    //   field: 'id',
    //   headerName: 'ID',
    //   width: 70,
    //   type: 'text'
    // },
    {
      field: 'studentNo',
      headerName: 'Student Number',
      width: 200,
      renderCell: (params) => (
        <Link to={`/admin-home/${params.row.id}`}>{params.row.id}</Link>
      )
    },
    {
      field: 'studentName',
      headerName: 'Student Name',
      width: 300,
      type: 'name'
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <>
          <Button className='approve-Btn' variant="contained" color="success" onClick={() => {setOpen(true); setSelectedStudent(params.row.id)}}>Approve</Button>
          <Button className='reject-Btn' variant="contained" color="error" onClick={() => { rejectAcc(params.row.id)}}>Reject</Button>
        </>
        )
    }
  ]

  useEffect(() => {
        if (!isLoggedIn) {
          navigate("/")
        } else {
            fetch("http://localhost:3001/get-student-accounts")
            .then(response => response.json())
            .then(body => {
              console.log(JSON.stringify(body))
              console.log(body)
              body.map((account)=>{
                const newRow = {
                  id: account.studentno,
                  studentNumber: account.studentno,
                  studentName: account.mname === "" ? account.fname + " " + account.lname : account.fname + " " + account.mname + " " + account.lname,
                }
                setRows((oldRows)=>[...oldRows, newRow])
            })}
            )
            fetch("http://localhost:3001/get-adviser-accounts").then(response => response.json())
            .then(body => {
              setAdvisers(body)
            })
    }}, [isLoggedIn, navigate])

    function logout() {
        const cookies = new Cookies();
        cookies.remove("authToken");
     
        localStorage.removeItem("username");
     
        setIsLoggedIn(false)
      }

      const approveAcc = (adviser, studno) => {
        fetch("http://localhost:3001/approve-student-account", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ studentno: studno })
        })
          .then(response => response.json())
          .then(body => {
            console.log(JSON.stringify(body))
            // check if Mongoose document was successfully edited/updated via the response returned
            if(body.success) {
              // setAccounts(accounts.filter(items=>items.studentno!==studno))
              setRows(rows.filter(row => row.id !== studno))
            }
          })
          fetch("http://localhost:3001/assign-adviser", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ adviserID: adviser, studentno: studno })
            })
              .then(response => response.json())
              .then(body => {
                console.log(body)
                if (body.success) {
                  alert("Approved student account!")
                }
                else { alert("Approval failed")}
              })
        }

        const rejectAcc = (studno) => {
            fetch("http://localhost:3001/reject-student-account", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ studentno: studno })
            })
              .then(response => response.json())
              .then(body => {
        
                // when student account request is rejected, the user must then be deleted in the database
                // check if Mongoose document was successfully deleted via the response returned
                if(body.success) {
                    // setAccounts(accounts.filter(items=>items.studentno!==studno))
                    setRows(rows.filter(row => row.id !== studno))
                }
              })
            }

        const assignAdviserToAcc = (studnumber, adviserInitials ) => {
          fetch("http://localhost:3001/approve-student-account", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ studentno: studnumber })
        })
          .then(response => response.json())
          .then(body => {
            // check if Mongoose document was successfully edited/updated via the response returned
            if(body.success) {
              setRows(rows.filter(row => row.id !== studnumber))
            }
          })
          fetch("http://localhost:3001/assign-adviser-by-initials", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ initialsLname: adviserInitials, studentno: studnumber })
            })
              .then(response => response.json())
              .then(body => {
                if (body.success) {
                  alert("Successfully mapped approved student accounts to their adviser!")
                }
                else { alert("Mapping of student account to adviser failed.")}
              
                // when student account request is rejected, the user must then be deleted in the database
                // check if Mongoose document was successfully deleted via the response returned
                if(body.success) {
                    setRows(rows.filter(row => row.id !== studnumber))
                }
              })
        }
    
        const [file, setFile] = useState()

        function handleFile(event) {
            setFile(event.target.files[0])
        }

        const [data, setData] = useState([]);

        const handleUpload = (e) => {
          Papa.parse(file, {
            header: true,
            complete: (results) => {
              setData(results.data);
            },
          })
        }

    return(
      <div className="homepage">
        {isLoggedIn && <AdminHeader onClick={props.onClick}/>}
        <h2 className="heading">Welcome, Admin {localStorage.getItem("username")}!</h2>
        <h1 className="heading">Manage Student Account Applications</h1>
        <div className="container bonus">
            <h4 className="import-statement">Import CSV</h4>
            <form className="bonus-holder" onSubmit={handleUpload}>
              <input className="input bonus" type='file' accept='.csv' name='file' onChange={handleFile}/>
              
              {data.map((row, index) => {
                assignAdviserToAcc(row.StudentNumber, row.Adviser)
              })}
              <button className="button bonus">Upload</button>
            </form>
                
        </div>
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
        <Modal onClose={handleClose} open={open}>
          <div className="holder signup-holder">
          <div className="container modal">
            <h2 className="heading" id="signup">Assign an Adviser</h2>
                  {advisers.map((account, i) => <AccountCard num={i} account={account} onAssign={() => {setOpen(false); approveAcc(account._id, selectedStudent)}}></AccountCard>)}
            <Button onClick={handleClose} variant="contained" className="cancel" sx={{
              bgcolor: "#FFF",
              borderRadius: 20,
              fontFamily: 'Poppins',
              fontSize: 16,
              color: "#001D3D",
              marginTop: 2
            }}>Cancel</Button>
            <button onClick={handleClose} className="cancel-button">x</button>
          </div>
          </div>
        </Modal>
      </div>
    )
}