import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,24}$/;
const STDNUM_REGEX = /^(19[0-9]{2}|20[0-2][0-9])-\d{5}$/;
const EMAIL_REGEX = /^[a-z0-9]+@up\.edu\.ph$/;

export default function SignUp() {
  const userRef = useRef();
  const errRef = useRef();

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [stdnum, setStdNum] = useState("");
  const [validStdNum, setValidStdNum] = useState(false);
  const [stdNumFocus, setStdNumFocus] = useState(false);

  const [upmail, setUpMail] = useState("");
  const [validUpMail, setValidUpMail] = useState(false);
  const [UpMailFocus, setUpMailFocus] = useState(false);

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
    const res = STDNUM_REGEX.test(stdnum);
    setValidStdNum(res);
  }, [stdnum]);

  useEffect(() => {
    const res = EMAIL_REGEX.test(upmail);
    setValidUpMail(res);
  }, [upmail]);

  useEffect(() => {
    setErrMsg("");
  }, [pwd]);

  return (
    <div className="holder signup-holder">
      <div className="container signup">
        <h1 className="heading" id="signup">
          Sign Up
        </h1>
        <form className="input-holder">
          <TextField
            label="First Name"
            variant="outlined"
            size="small"
            className="input-rounded fname"
            required
            inputRef={userRef}
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
            label="Student Number"
            variant="outlined"
            size="small"
            className="input-rounded stdnum"
            required
            aria-invalid={validStdNum ? "false" : "true"}
            aria-describedby="stdnumnote"
            onChange={(e) => setStdNum(e.target.value)}
            onFocus={() => setStdNumFocus(true)}
            onBlur={() => setStdNumFocus(false)}
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
            id="stdnumnote"
            className={
              stdNumFocus && stdnum && !validStdNum
                ? "instructions"
                : "instructions-offscreen"
            }
          >
            <FontAwesomeIcon
              icon={icon({ name: "info-circle" })}
              className="icon info-icon"
            />
            Please enter a valid student number, with format{" "}
            <code>XXXX-XXXXX (ex.2021-12345)</code>
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
            variant="contained"
            sx={{
              bgcolor: "#001D3D",
              borderRadius: 20,
              typography: "Poppins",
              margin: 0,
              marginTop: 2,
            }}
            disabled={!validPwd ? true : false}
          >
            Sign Up
          </Button>
          <p className="existing">
            Have an existing account?{" "}
            <Link to={`/login`} className="text login-text">
              Log In
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
