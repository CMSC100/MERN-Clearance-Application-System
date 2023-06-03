import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Link, useNavigate, useLoaderData } from "react-router-dom";

export default function StudentHeader(props) {

  const [open, setOpen] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);

  const username = localStorage.getItem("username")
  const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData())
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
  }, [isLoggedIn, navigate])

  //useeffect for notifications
  const [notifs, setNotifs] = useState([])
  useEffect(()=>{
    fetch(`http://localhost:3001/get-notifications-by-user?upmail=${localStorage.getItem("upmail")}`)
      .then(response => response.json())
      .then(body =>{
        //convert the data to something useful
        console.log(JSON.stringify(body))
        console.log(body)
        body.map((notif)=>{
          const newNotifs = {
            _id: notif._id,
            submission: notif.student_submission.submission_remark,
            remark: notif.remarks.app_remarks, 
            notif_date: new Date(notif.remarks.remark_date),
            // commenter name
            commentername: `${notif.commenteruser[0].fname} ${notif.commenteruser[0].lname}`,
            step_given: notif.remarks.step_given
          }
          setNotifs((oldNotifs)=>[...oldNotifs, newNotifs])
          console.log(notifs)
        })
      })
  }, [openNotif])

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
          <li><Link to={`/view-submissions`} className="link-styles">View Clearance Applications</Link></li>
        </ul>
        <div className="menu-container">
          <div className="menu-trigger" onClick={()=>{setOpenNotif(!openNotif); setOpen(false)}}>
            <FontAwesomeIcon icon={icon({name: 'envelope'})} className='notif-icon' />
          </div>
          <div className={`dropdown-menu menu-notif ${openNotif? 'active' : 'inactive'}`}>
            <ul>
              <li className='dropdown-item notif-item'><h3 id='notif-header'>Notifications</h3></li>
            </ul>
            <hr className='rounded'/>
            <div className='notif-view'>
            {
              notifs.map((notif)=>{
                return(
                  <ul className='notif-box'>
                    <li className='dropdown-item notif-item'>
                      <p className='notif-item-body'>Submission {notif.submission} was returned by {notif.commentername} with remark: {notif.remark}</p>
                      <p className='notif-item-date'>Date: {notif.notif_date.toString()}</p>
                      
                    </li>
                    <hr className='dotted' />
                  </ul>
                )
              })
            }
            </div>
          </div>
          <div className="menu-trigger" onClick={()=>{setOpen(!open); setOpenNotif(false)}}>
            <FontAwesomeIcon icon={icon({name: 'user-circle'})} className='user-icon' />
          </div>
          <div className={`dropdown-menu menu-user ${open? 'active' : 'inactive'}`}>
            <ul>
              <li><Link to={`/profile`} className='dropdown-item user-profile-item'>View Profile</Link></li>
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