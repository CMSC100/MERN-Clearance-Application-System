import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Outlet, Link } from 'react-router-dom';

export default function Root() {

  return (
    <>
      <nav>
        <ul>
          <li><Link to={`/`} className="link-styles">Home</Link></li>
          <li><Link to={`/view-submissions`} className="link-styles">View Clearance Applications</Link></li>
        </ul>
        <div className="user-icon-holder">
          <div className="user-icon">
            <Link to={`/`}><FontAwesomeIcon icon={icon({name: 'user-circle'})} className="icon user-icon"/></Link>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  )
}