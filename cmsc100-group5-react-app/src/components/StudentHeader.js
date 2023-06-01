import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Link, useNavigate, useLoaderData } from "react-router-dom";

export default function StudentHeader(props) {

  const [open, setOpen] = useState(false);

  const username = localStorage.getItem("username")
  const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData())
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
  }, [isLoggedIn, navigate])

  function logout() {
    const cookies = new Cookies();
    cookies.remove("authToken");

    localStorage.removeItem("username");

    setIsLoggedIn(false)
  }

  return (
    <>
      <nav>
        <ul>
          <li><Link to={`/`} className="link-styles">Home</Link></li>
          <li><Link to={`/view-submissions`} className="link-styles">View Clearance Applications</Link></li>
        </ul>
        <div className="menu-container">
          <div className="menu-trigger" onClick={()=>{setOpen(!open)}}>
            <FontAwesomeIcon icon={icon({name: 'user-circle'})} className='user-icon' />
          </div>
          <div className={`dropdown-menu ${open? 'active' : 'inactive'}`}>
            <ul>
              <li><Link to={`/profile`} className='dropdown-item'>View Profile</Link></li>
            </ul>
            <ul>
              <li><a className='dropdown-item' onClick={logout}>Log Out</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}