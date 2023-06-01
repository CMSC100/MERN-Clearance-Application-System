import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Outlet, Link } from 'react-router-dom';

export default function Root() {

  return (
    <>
      <Outlet />
    </>
  )
}