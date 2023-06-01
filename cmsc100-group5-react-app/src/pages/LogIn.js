import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import Cookies from 'universal-cookie';

const EMAIL_REGEX = /^[a-z0-9]+@up\.edu\.ph$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,24}$/;

export default function LogIn() {
  //authetication
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // redirect when login is successful
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home")
    }
  }, [isLoggedIn, navigate])

  function logIn(e) {
    e.preventDefault();

    // form validation goes here

    fetch("http://localhost:3001/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: upmail,
          password: pwd
        })
      })
      .then(response => response.json())
      .then(body => {
        if (body.success) {
          setIsLoggedIn(true)
          // successful log in. store the token as a cookie
          const cookies = new Cookies()
          cookies.set(
            "authToken",
            body.token,
            {
              path: "localhost:3001/",
              age: 60*60,
              sameSite: false
            });

          localStorage.setItem("username", body.fname);
        }
        else { alert("Log in failed")}
      })
  }

  const userRef = useRef();
  const errRef = useRef();

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [upmail, setUpMail] = useState('');
  const [validUpMail, setValidUpMail] = useState(false);
  const [UpMailFocus, setUpMailFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    const res = PWD_REGEX.test(pwd);
    setValidPwd(res);
  }, [pwd])

  useEffect(() => {
    const res = EMAIL_REGEX.test(upmail);
    setValidUpMail(res);
  }, [upmail])

  useEffect(() => {
    setErrMsg('');
  }, [pwd])

  return (
    <div className="holder login-holder">
      <div className="container login">
        <div className="left">
            <h1 className="heading" id="login">
            Log In
            </h1>
            <form className="input-holder" onSubmit={logIn}>
            <TextField
                label="UP Mail"
                type="email"
                variant="outlined"
                size="small"
                className="input-rounded lname"
                required
                inputRef={userRef}
                aria-invalid={validUpMail ? "false" : "true"}
                aria-describedby="upmailnote"
                onChange={(e) => setUpMail(e.target.value)}
                onFocus={() => setUpMailFocus(true)}
                onBlur={() => setUpMailFocus(false)}
                sx = {{
                    '& .MuiFormLabel-root': {
                        fontFamily: 'Poppins',
                    },
                    '& .MuiFormLabel-asterisk': {
                      fontSize: "16px"
                    }
                }}
            />
            <p id="upmailnote" className={UpMailFocus && upmail && !validUpMail ? 'instructions' : 'instructions-offscreen'}>
                <FontAwesomeIcon icon={icon({name: 'info-circle'})} className="icon info-icon" />
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
                sx = {{
                    '& .MuiFormLabel-root': {
                        fontFamily: 'Poppins',
                    },
                    '& .MuiFormLabel-asterisk': {
                      fontSize: "16px"
                    }
                }}
            />
            <p id="pwdnote" className={pwdFocus && pwd && !validPwd ? 'instructions' : 'instructions-offscreen'}>
                <FontAwesomeIcon icon={icon({name: 'info-circle'})} className="icon info-icon" />
                8 to 24 characters.<br />
                At least one uppercase letter.<br />
                At least one lowercase letter.<br />
                At least one special character.<br />
            </p>
            <Button
                type="submit"
                variant="contained"
                sx={{
                bgcolor: "#001D3D",
                borderRadius: 20,
                margin: 0,
                marginTop: 2,
                '& .MuiButtonBase-root': {
                  fontFamily: 'Poppins'
                }
                }}
                disabled={!validPwd ? true : false}
            >
                Log In
            </Button>
            <p className="existing">
                Create an account here.{" "}
                <Link to={`/signup`} className="text signup-text">
                Sign Up
                </Link>
                .
            </p>
            </form>
        </div>
        <div className="right">
            <img className="login-image" src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"/>
        </div>
      </div>
    </div>
  );
}
