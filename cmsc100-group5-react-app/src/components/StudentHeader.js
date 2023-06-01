import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Button } from '@mui/material';
import { Outlet, Link } from 'react-router-dom';
import React, { useState } from 'react';

export default function StudentHeader(props) {

  const [open, setOpen] = useState(false);


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
              <li><a className='dropdown-item' onClick={props.onClick}>Log Out</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}