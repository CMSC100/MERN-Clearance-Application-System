import { useEffect, useState } from "react"
import { useParams, useNavigate, useLoaderData } from "react-router-dom"

export default function AllRemarks() {

    let { params } = useParams()
    const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData())
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoggedIn) {
          navigate("/")
        }
        fetch(`http://localhost:3001/get-application-by-id/?id=${params}`)
      }, [isLoggedIn, navigate])

      return(
        <>
        </>
      )
}