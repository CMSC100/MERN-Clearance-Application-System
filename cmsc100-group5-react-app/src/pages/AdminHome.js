import React, { useEffect, useState } from "react"
import { useNavigate, useLoaderData } from "react-router-dom"
import AdminHeader from "../components/AdminHeader"

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

    return(
        <>
        {isLoggedIn && <AdminHeader onClick={logout}/>}
            <ul>
                {accounts.map((account, i) => <li>{i+1} {account.fname} Is Approved? {account.isApproved.toString()}</li>)}
            </ul>
        </>
    )
}