import React, { useEffect, useState } from "react"
import { useNavigate, useLoaderData } from "react-router-dom"
import AdminHeader from "../components/AdminHeader"
import AccountCard from "../components/AccountCard";

import Cookies from 'universal-cookie';

export default function AdminHome() {
    const [accounts, setAccounts] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData())
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoggedIn) {
          navigate("/")
        } else {
            fetch("http://localhost:3001/get-student-accounts").then(response => response.json())
        .then(body => {
            setAccounts(body)
        })
        }
    }, [isLoggedIn, navigate])

    function logout() {
        const cookies = new Cookies();
        cookies.remove("authToken");
     
        localStorage.removeItem("username");
     
        setIsLoggedIn(false)
      }

      const approveAcc = (studno) => {
        fetch("http://localhost:3001/approve-student-account", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ studentno: studno })
        })
          .then(response => response.text())
          .then(body => {
    
            // check if Mongoose document was successfully edited/updated via the response returned
            if(Object.values(body)[0] ? "true" : "false" == "true") {
              setAccounts(accounts.filter(items=>items.studentno!==studno))
            }
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
              .then(response => response.text())
              .then(body => {
        
                // when student account request is rejected, the user must then be deleted in the database
                // check if Mongoose document was successfully deleted via the response returned
                if(Object.values(body)[0] ? "true" : "false" == "true") {
                    setAccounts(accounts.filter(items=>items.studentno!==studno))
                }
              })
            }

    return(
        <>
        
        {isLoggedIn && <AdminHeader onClick={logout}/>}
        <h2>Manage Student account applications</h2> 
                {accounts.map((account, i) => <AccountCard num={i} account={account} onApprove={() => { approveAcc(account.studentno)}} onReject={() => { rejectAcc(account.studentno)}}></AccountCard>)}
            
        </>
    )
}