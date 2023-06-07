import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Button } from '@mui/material';
import { Outlet, Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

import Cookies from 'universal-cookie';

export default function ApproverHeader(props) {

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
        </ul>
        <div className="menu-container">
          <div className="menu-trigger" onClick={() => {setOpen(!open)}}>
            <FontAwesomeIcon icon={icon({name: 'user-circle'})} className='user-icon'/>
          </div>
          <div className={`dropdown-menu menu-approver ${open? 'active' : 'inactive'}`}>
            <ul>
              <li><Link to={`/profile-approver`} className='dropdown-item user-profile-item'>View Profile</Link></li>
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