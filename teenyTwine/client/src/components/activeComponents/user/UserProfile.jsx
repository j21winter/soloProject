import React, {useState, useContext} from 'react'
import UserContext from '../../../context/userContext'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

const UserProfile = () => {
  const navigate = useNavigate()
  const {user, setUser} = useContext(UserContext)
  const [userFormInput, setUserFormInput] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  })
  const [formErrors, setFormErrors] = useState({})
  
  // updateUser
  const handleUserFormChange = (e) => {
    e.preventDefault()
    setUserFormInput((prevInput) => (
      {...prevInput,
        [e.target.name] : e.target.value}
    ))
  }

  const submitForm = (e) => {
    e.preventDefault()
    const data = {...userFormInput}

    axios.patch(`http://localhost:8000/api/user/${user._id}`, data, {withCredentials:true})
      .then(res => {
        setUser(prevUser => ({
          ...prevUser, 
            ["firstName"]: res.data.firstName,
            ["lastName"]: res.data.lastName,
            ["email"]: res.data.email,
        }))
        setFormErrors({})
      })
      .catch(err => {
        setFormErrors(err.response.data.errors)
      })
  }

  const handleLogout = (e) => {
    e.preventDefault()
    axios.post('http://localhost:8000/api/logout',{},{withCredentials: true})
        .then(res => {
            setUser({})
            navigate('/login')
        })
        .catch(err => console.log(err))
}

  const deleteAccount = e => {
    e.preventDefault()
    if(confirm("You are requesting to delete your account. \nYou will loose all data associated with this account. \nHit 'OK' to proceed? Otherwise 'CANCEL'.")){
      axios.delete(`http://localhost:8000/api/user/${user._id}`, {withCredentials: true})
        .then(res => {
          console.log(res)
          handleLogout(e)
        })
    }
    
  }


  return (
    <div className="h-100">
      <div className="header d-flex justify-content-between p-2 align-content-center mb-5 ">
        <p className='fs-3 text-center m-0' style={{color:"#26637b"}}>Account</p>
        <button  className="btn btn-sm bg-white" style={{ color: "#84a59d"}} onClick={e => deleteAccount(e)}>Delete Account</button>
      </div>
      <div className="">
        {/* user */}
        <form onSubmit={(e) => submitForm(e)} className='w-75 rounded rounded 2 overflow-hidden mx-auto'>
            <div className='d-flex justify-content-between align-items-center ps-2 pe-2 mb-1'  style={{color: '#ffffff', backgroundColor: "#26637b"}}>
                <p className='fs-5 ms-1 m-0'>User</p>
            </div>

            <div className="input-group input-group-sm border-0 mb-1">
                <label htmlFor="firstName" className="input-group-text border-0" style={{backgroundColor: "#ffffff"}}>First name:</label>
                <input type="text" name='firstName' className="form-control border-0 text-end" value={userFormInput.firstName} onChange={e => handleUserFormChange(e)}/>
            </div>
            {formErrors.firstName ? <p className="text-danger text-center"><small>{formErrors.firstName.message}</small></p> : ""}

            <div className="input-group input-group-sm border-0 mb-1">
                <label htmlFor="lastName" className="input-group-text border-0" style={{backgroundColor: "#ffffff"}}>Last name:</label>
                <input type="text" name='lastName' className="form-control border-0 text-end" value={userFormInput.lastName} onChange={e => handleUserFormChange(e)}/>
            </div>

            { formErrors.lastName ? <p className="text-danger text-center"><small>{formErrors.lastName.message}</small></p> : ""}

            <div className="input-group input-group-sm border-0 mb-1">
                <label htmlFor="email" className="input-group-text border-0" style={{backgroundColor: "#ffffff"}}>Email:</label>
                <input type="text" name='email' className="form-control border-0 text-end" value={userFormInput.email} onChange={e => handleUserFormChange(e)}/>
            </div>
            {formErrors.email ? <p className="text-danger text-center"><small>{formErrors.email.message}</small></p> : ""}

            <button className="btn btn-sm w-100 rounded-top-0 " style={{backgroundColor: "#84a59d", color: "#ffffff"}}>submit</button>

        </form>

      </div>
    </div>
  )
}

export default UserProfile