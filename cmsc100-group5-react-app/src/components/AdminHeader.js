import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Button } from '@mui/material';
import { Outlet, Link } from 'react-router-dom';

export default function AdminHeader(props) {

  return (
    <>
      <nav>
        <ul>
          <li><Link to={`/`} className="link-styles">Home</Link></li>
          <li><Link to={`/view-submissions-admin`} className="link-styles">View Clearance Applications</Link></li>
        </ul>
        <div className="user-icon-holder">
          <div className="user-icon">
            <Link to={`/profile`} props={props.onClick}><FontAwesomeIcon icon={icon({name: 'user-circle'})} className="icon user-icon"/></Link>
          </div>
        </div>
        <Button
                onClick={props.onClick}
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
            >
                Log Out
            </Button>
      </nav>
    </>
  )
}