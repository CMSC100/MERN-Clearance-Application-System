import { Link } from 'react-router-dom'
import Button from "@mui/material/Button";
import './accountCard.css';

export default function AccountCard(props) {
    return(
        <div className='card-container'>
            <div key={props.num} className="account-card">
                <div className="account-card-studentno">
                    <Link to={`/admin-home/${props.account.studentno}`} className="account-title" style={{color: 'white'}}>
                        {props.account.studentno}
                    </Link>
                </div>
                <div className='account-card-name'>
                    <Link to={`/admin-home/${props.account.studentno}`} className="account-title">
                        {props.account.fname} {props.account.mname} {props.account.lname}
                    </Link>
                </div>
                <div className='Btn-div'>
                    <Button className='approve-Btn' variant="contained" color="success" onClick={props.onClick}>Approve</Button>
                    <br/>
                    <Button className='reject-Btn' variant="contained" color="error" onClick={props.onClick} style={{marginLeft: 10, marginRight: 10}}>Reject</Button>
                </div>
            </div>
        </div>
    )
}