import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="signup-holder">
      <div className="signup">
        <h1 className="heading" id="signup">
          Sign Up
        </h1>
        <div className="input-holder">
          <TextField
            label="First Name"
            variant="outlined"
            size="small"
            sx={{
              fontFamily: "Poppins",
            }}
            className="input-rounded"
          />
          <TextField
            label="Middle Name"
            variant="outlined"
            size="small"
            className="input-rounded"
          />
          <TextField
            label="Last Name"
            variant="outlined"
            size="small"
            className="input-rounded"
          />
          <TextField
            label="UP Mail"
            variant="outlined"
            size="small"
            className="input-rounded"
          />
          <TextField
            label="Student Number"
            variant="outlined"
            size="small"
            className="input-rounded"
          />
          <TextField
            label="Password"
            variant="outlined"
            size="small"
            className="input-rounded"
          />
          <Button
            variant="contained"
            sx={{
              bgcolor: "#001D3D",
              borderRadius: 20,
              typography: "Poppins",
            }}
          >
            Sign Up
          </Button>
          <p>
            Have an existing account?{" "}
            <Link to={`/`} className="login-text">
              Log In.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
