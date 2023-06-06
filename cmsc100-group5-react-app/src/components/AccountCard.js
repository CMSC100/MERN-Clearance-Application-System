import { Link } from 'react-router-dom'
import Button from "@mui/material/Button";
import './accountCard.css';

export default function AccountCard(props) {
    return(
        <div className='card-container'>
            <div key={props.num} className="account-card">
                <div className='name-holder'>
                    <div className='account-card-name'>
                    {props.account.mname === "" ? props.account.fname + " " + props.account.lname : props.account.fname + " " + props.account.mname + " " + props.account.lname}
                    </div>
                </div>
                <div className='Btn-div'>
                    <Button className='approve-Btn' variant="contained" color="success" onClick={props.onAssign}>Assign</Button>
                </div>
            </div>
        </div>
    )
}