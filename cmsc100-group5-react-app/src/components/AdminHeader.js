import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Button } from '@mui/material';
import { Outlet, Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

import Cookies from 'universal-cookie';

export default function AdminHeader(props) {

  const [open, setOpen] = useState(false)
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
    localStorage.removeItem("upmail");
    setIsLoggedIn(false)
  }

  return (
    <>
      <nav>
        <ul>
          <li><Link to={`/`} className="link-styles">Home</Link></li>
          <li><Link to={`/create-approver`} className="link-styles">Create Approver Account</Link></li>
          <li><Link to={`/manage-approvers`} className="link-styles">Manage Approver Accounts</Link></li>
        </ul>
        <div className="menu-container">
          <div className="menu-trigger" onClick={() => {setOpen(!open)}}>
            <FontAwesomeIcon icon={icon({name: 'user-circle'})} className='user-icon'/>
          </div>
          <div className={`dropdown-menu menu-admin ${open? 'active' : 'inactive'}`}>
            <ul>
              <li><Link to={`/profile-admin`} className='dropdown-item user-profile-item'>View Profile</Link></li>
            </ul>
            <ul>
              <li><a className='dropdown-item user-profile-item' onClick={logout}>Log Out</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}