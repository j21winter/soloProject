import React, {useState} from 'react'
import axios from 'axios'

const LoginAndReg = () => {
  // INPUT STORAGE
  const [regInput, setRegInput] = useState({
      firstName: "", 
      lastName: "", 
      email: "", 
      password: "", 
      confirmPassword: ""
  })

  const [loginInput, setLoginInput] = useState({
    email: "",
    password: ""
  })
  
  // ON CHANGE HANDLERS
  const handleRegistrationInputChange = e => {
    e.preventDefault()

    setRegInput((prevInput) => ({
      ...prevInput, 
        [e.target.name]: e.target.value})
    )
  }

  const handleLoginInputChange = e => {
    e.preventDefault()

    setLoginInput((prevInput) => ({
      ...prevInput, 
        [e.target.name]: e.target.value})
    )
  }

  // SUBMIT FUNCTIONS
  const handleRegSubmit = (e) => {
    e.preventDefault()
    //! VALIDATE?

    axios.post('http://localhost:8000/api/register', regInput)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    //! VALIDATE?

    axios.post('http://localhost:8000/api/login', loginInput)
      .then(res => console.log(res))
      .catch(err => console.log(err))

  }
  return(
    <>
      <div className='d-flex justify-content-evenly '>

        {/* REGISTRATION FORM */}
          <div id='registration' className='card p-3'>

            <h2>Registration</h2>

            <form onSubmit={(e) => handleRegSubmit(e)} >

              <div className="mb-3">
                <label htmlFor="firstName" className="form-input">First name:</label>
                <input type="text" name='firstName' className='form-control' value={regInput.firstName} onChange={(e) => handleRegistrationInputChange(e)}/>
              </div>

              <div className="mb-3">
                <label htmlFor="lastName" className="form-input">Last name:</label>
                <input type="text" name='lastName' className='form-control' value={regInput.lastName} onChange={(e) => handleRegistrationInputChange(e)}/>
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-input">Email:</label>
                <input type="text" name='email' className='form-control' value={regInput.email} onChange={(e) => handleRegistrationInputChange(e)}/>
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-input">Password:</label>
                <input type="password" name='password' className='form-control' value={regInput.password} onChange={(e) => handleRegistrationInputChange(e)}/>
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-input">Confirm Password:</label>
                <input type="password" name='confirmPassword' className='form-control' value={regInput.confirmPassword} onChange={(e) => handleRegistrationInputChange(e)}/>
              </div>

              <button type="submit">Register</button>

            </form>
          </div>
          <div id='login' className='card p-3'>
            <h2>Login</h2>

            {/* LOGIN FORM */}
            <form onSubmit={(e) => handleLoginSubmit(e)}>

              <div className="mb-3">
                <label htmlFor="email" className="form-input">Email:</label>
                <input type="text" name='email' className='form-control' value={loginInput.email} onChange={(e) => handleLoginInputChange(e)} />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-input">Password:</label>
                <input type="password" name='password' className='form-control' value={loginInput.password} onChange={(e) => handleLoginInputChange(e)} />
              </div>

              <button type="submit">Login</button>

            </form>
          </div>
      </div>
    </>
  )
}
export default LoginAndReg