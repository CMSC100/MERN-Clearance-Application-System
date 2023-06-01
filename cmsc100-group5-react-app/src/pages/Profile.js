import React from "react"
import { useEffect, useState } from "react"
import StudentHeader from "../components/StudentHeader"

export default function Profile(props) {
    const [user, setUser] = useState([])
    useEffect(() => {
        fetch(`http://localhost:3001/get-user/?upmail=${localStorage.getItem("upmail")}`).then(response => response.json())
        .then(body => {
            setUser(body)
        })
      }, [])

    return(
        <>
        {<StudentHeader onClick={props.props}/>}
            <ul>
                <li>Full Name: {user.mname == "" ? user.fname + " " + user.lname : user.fname + " " + user.mname + " " + user.lname}</li>
                <li>Student number: {user.studentno}</li>
                <li>Adviser: {user.adviser}</li>
            </ul>
        </>
    )
}