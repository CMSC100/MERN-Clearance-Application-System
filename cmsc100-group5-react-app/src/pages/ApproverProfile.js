import React from "react"
import { useEffect, useState } from "react"
import ApproverHeader from "../components/ApproverHeader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

export default function ApproverProfile(props) {
    const [user, setUser] = useState([])
    useEffect(() => {
        fetch(`http://localhost:3001/get-user/?upmail=${localStorage.getItem("upmail")}`).then(response => response.json())
        .then(body => {
            setUser(body)
        })
      }, [])

    return(
        <>
        {<ApproverHeader onClick={props.onClick}/>}
            <div className="container profile">
                <h1 className="heading profile">My Profile</h1>
                <div className="divider"></div>
                <div className="user-info">
                    <FontAwesomeIcon icon={icon({name: 'user-circle'})} className="profile-user"/>
                    <p className="info">Full Name:<span className="info-content"> {user.mname === "" ? user.fname + " " + user.lname : user.fname + " " + user.mname + " " + user.lname}</span></p>
                    <p className="info">UP Mail:<span className="info-content"> {user.email}</span></p>
                </div>
            </div>
        </>
    )
}