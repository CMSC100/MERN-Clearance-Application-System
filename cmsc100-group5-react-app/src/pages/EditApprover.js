import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { Link, useNavigate, useLoaderData, useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import ApproverHeader from "../components/ApproverHeader";
import AdminHeader from "../components/AdminHeader.js";

const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,24}$/;
const EMAIL_REGEX = /^[a-z0-9]+@up\.edu\.ph$/;

export default function EditApprover(props) {

  let { approverEmail } = useParams()
  //authentication
  const navigate = useNavigate()
  const [approverAcc, setApproverAcc] = useState({})
  const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData());
  
  // redirect when login is successful
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    } else {
        fetch("http://localhost:3001/get-approver-account-by-email?email=" + Object.values({approverEmail})[0])
        .then(response => response.json())
    .then(body => {
        setApproverAcc(
            body
        )
    })
    }
}, [isLoggedIn, navigate])

  function signUpHandler(e) {
    e.preventDefault();

    // form validation goes here 
    if(validUpMail){
      fetch("http://localhost:3001/edit-approver?email=" + Object.values({approverEmail})[0],
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fname: fname,
          mname: mname,
          lname: lname,
          userType: approverType,
          email: upmail,
        })
      })
      .then(response => response.json())
      .then(body => {
        if (body.success) {
          alert("Successfully edited approver!")
        }
        else { alert("Edit failed")}
      })
    }
    
  }


  const userRef = useRef();
  const errRef = useRef();

  const [fname, setFname] = useState(approverAcc.fname);
  const [mname, setMname] = useState(approverAcc.mname);
  const [lname, setLname] = useState(approverAcc.lname);

  const [upmail, setUpMail] = useState(approverAcc.email);
  const [validUpMail, setValidUpMail] = useState(false);
  const [UpMailFocus, setUpMailFocus] = useState(false);

  const [approverType, setApproverType] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const res = EMAIL_REGEX.test(upmail);
    setValidUpMail(res);
  }, [upmail]);

  return (
    <div className="holder signup-holder">
      {isLoggedIn && <AdminHeader onClick={props.onClick}/>}
      <div className="container addApprover">
        <h1 className="heading" id="signup">
          Edit Approver Account
        </h1>
        <form className="input-holder" onSubmit={signUpHandler} autoComplete="off">
          <TextField
            label="Enter new first name"
            variant="outlined"
            size="small"
            className="input-rounded fname"
            required
            inputRef={userRef}
            onChange={(e) => setFname(e.target.value)}
            sx={{
              "& .MuiFormLabel-root": {
                fontFamily: "Poppins",
              },
              "& .MuiFormLabel-asterisk": {
                fontSize: "16px",
              },
            }}
          />
          <TextField
            label="Enter new middle name"
            variant="outlined"
            size="small"
            className="input-rounded mname"
            onChange={(e) => setMname(e.target.value)}
            sx={{
              "& .MuiFormLabel-root": {
                fontFamily: "Poppins",
              },
              "& .MuiFormLabel-asterisk": {
                fontSize: "16px",
              },
            }}
          />
          <TextField
            label="Enter new last name"
            variant="outlined"
            size="small"
            className="input-rounded lname"
            required
            onChange={(e) => setLname(e.target.value)}
            sx={{
              "& .MuiFormLabel-root": {
                fontFamily: "Poppins",
              },
              "& .MuiFormLabel-asterisk": {
                fontSize: "16px",
              },
            }}
          />
          <TextField
            label="Enter new UP Mail"
            variant="outlined"
            type="email"
            size="small"
            className="input-rounded upmail"
            required
            aria-invalid={validUpMail ? "false" : "true"}
            aria-describedby="upmailnote"
            onChange={(e) => setUpMail(e.target.value)}
            onFocus={() => setUpMailFocus(true)}
            onBlur={() => setUpMailFocus(false)}
            sx={{
              "& .MuiFormLabel-root": {
                fontFamily: "Poppins",
              },
              "& .MuiFormLabel-asterisk": {
                fontSize: "16px",
              },
            }}
          />
          <p
            id="upmailnote"
            className={
              UpMailFocus && upmail && !validUpMail
                ? "instructions"
                : "instructions-offscreen"
            }
          >
            <FontAwesomeIcon
              icon={icon({ name: "info-circle" })}
              className="icon info-icon"
            />
            Please enter a valid UP Mail, ending with <code>@up.edu.ph</code>.
          </p>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#001D3D",
              borderRadius: 20,
              typography: "Poppins",
              margin: 0,
              marginTop: 2,
            }}
            disabled={!validUpMail ? true : false}
            onClick={(e) => setApproverType("clearanceOfficer")}
          >
            Add as Clearance Officer
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#001D3D",
              borderRadius: 20,
              typography: "Poppins",
              margin: 0,
              marginTop: 2,
            }}
            disabled={!validUpMail ? true : false}
            onClick={(e) => setApproverType("adviser")}
          >
            Add as Adviser
          </Button>
          
        </form>
      </div>
    </div>
  );
}
