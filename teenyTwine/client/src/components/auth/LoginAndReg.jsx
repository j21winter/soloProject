import React, { useState } from 'react';
import RegForm from './RegForm';
import LoginForm from './LoginForm';
import Header from '../Header'


const LoginAndReg = () => {
  // Errors
  const [errors, setErrors] = useState({
    login : {
      error: "",
      email: "",
      password: ""
    },
    registration : {
      firstName: "", 
      lastName: "", 
      email: "", 
      password: "", 
      confirmPassword: ""
    }
  })

  
  return(
    <>
      <Header />
      <div className='d-flex justify-content-evenly '>
        <RegForm errors={errors} setErrors={setErrors}/>
        <LoginForm errors={errors} setErrors={setErrors} />
      </div>
    </>
  )
}
export default LoginAndReg