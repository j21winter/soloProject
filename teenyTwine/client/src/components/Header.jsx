import React, {useContext} from 'react'
import UserContext from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Header = () => {
    const {user, setUser} = useContext(UserContext)
    const navigate = useNavigate()

    const handleLogout = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8000/api/logout',{},{withCredentials: true})
            .then(res => {
                setUser({})
                navigate('/login')
            })
            .catch(err => console.log(err))
    }

    return (
    <>
        <div className="header d-flex justify-content-between ps-3 pe-3 align-items-center h-auto " style={{backgroundColor: '#84a59d'}}>
            <div>
                <h1 className="display-4 m-0 p-0 fw-semibold " style={{color: "#26637b"}}>Teeny Twine</h1>
                <p className="fs-4 m-0 p-0 text-center" style={{color: "#ffffff"}}>Find the right fit right now</p>
            </div>
            {user._id && (
                <div className='d-flex column-gap-1 '>
                    <button className="account btn btn-sm bg-white" style={{ color: "#84a59d"}}>Account</button>
                    <button className="logout btn btn-sm bg-white" style={{ color: "#84a59d"}} onClick={handleLogout}>Logout</button>
                </div>
        )}
        </div>
    </>
    )
}

export default Header