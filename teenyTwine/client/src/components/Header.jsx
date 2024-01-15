import React, {useContext} from 'react'
import UserContext from './context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Header = () => {
    const {user, setUser} = useContext(UserContext)
    const navigate = useNavigate()

    const handleLogout = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8000/api/logout',{},{withCredentials: true})
            .then(res => {
                console.log(res)
                setUser({})
                navigate('/login')
            })
            .catch(err => console.log(err))
    }

    return (
    <>
        <div className="header d-flex justify-content-between p-3 bg-secondary align-items-center h-auto ">
            <h1 className="display-4 text-white">Teeny Twine</h1>
        {user._id && (
            <div>
                <button className="account btn btn-secondary ">Account</button>
                <button className="logout btn btn-warning " onClick={handleLogout}>Logout</button>
            </div>
        )}
        </div>
    </>
    )
}

export default Header