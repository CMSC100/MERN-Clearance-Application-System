import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { Link, useNavigate, useLoaderData } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import ApproverHeader from "../components/ApproverHeader";
import AdminHeader from "../components/AdminHeader.js";

const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,24}$/;
const EMAIL_REGEX = /^[a-z0-9]+@up\.edu\.ph$/;

export default function AddApprover(props) {
  //authentication
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData());
  
  // redirect when login is successful
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
  }, [isLoggedIn, navigate])

  function signUpHandler(e) {
    e.preventDefault();

    // form validation goes here 
    if(validPwd && validUpMail){
      fetch("http://localhost:3001/signup",
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
          password: pwd,
          isApproved: true
        })
      })
      .then(response => response.json())
      .then(body => {
        if (body.success) {
          alert("Successfully created approver!")
        }
        else { alert("Cannot create account")}
      })
    }
    
  }


  const userRef = useRef();
  const errRef = useRef();

  const [fname, setFname] = useState("");
  const [mname, setMname] = useState("");
  const [lname, setLname] = useState("");

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [upmail, setUpMail] = useState("");
  const [validUpMail, setValidUpMail] = useState(false);
  const [UpMailFocus, setUpMailFocus] = useState(false);

  const [approverType, setApproverType] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const res = PWD_REGEX.test(pwd);
    setValidPwd(res);
  }, [pwd]);

  useEffect(() => {
    const res = EMAIL_REGEX.test(upmail);
    setValidUpMail(res);
  }, [upmail]);

  useEffect(() => {
    setErrMsg("");
  }, [pwd]);

  return (
    <div className="holder signup-holder">
      {isLoggedIn && <AdminHeader onClick={props.onClick}/>}
      <div className="container addApprover">
        <h1 className="heading" id="signup">
          Create an Approver Account
        </h1>
        <form className="input-holder" onSubmit={signUpHandler} autoComplete="off">
          <TextField
            label="First Name"
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
            label="Middle Name"
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
            label="Last Name"
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
            label="UP Mail"
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
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            size="small"
            className="input-rounded password"
            required
            aria-invalid={validPwd ? "false" : "true"}
            aria-describedby="pwdnote"
            onChange={(e) => setPwd(e.target.value)}
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
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
            id="pwdnote"
            className={
              pwdFocus && pwd && !validPwd
                ? "instructions"
                : "instructions-offscreen"
            }
          >
            <FontAwesomeIcon
              icon={icon({ name: "info-circle" })}
              className="icon info-icon"
            />
            8 to 24 characters.
            <br />
            At least one uppercase letter.
            <br />
            At least one lowercase letter.
            <br />
            At least one special character.
            <br />
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
            disabled={!validPwd && !validUpMail ? true : false}
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
            disabled={!validPwd && !validUpMail ? true : false}
            onClick={(e) => setApproverType("adviser")}
          >
            Add as Adviser
          </Button>
          
        </form>
      </div>
    </div>
  );
}
