import React, {useState, useContext}from 'react'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import UserContext from '../../context/userContext';

const LoginForm = (props) => {
    const {errors, setErrors} = props
    const { saveLoggedInUser } = useContext(UserContext)
    const navigate = useNavigate()

    // INPUT STORAGE
    const [loginInput, setLoginInput] = useState({
        email: "",
        password: ""
    });
    
    // ON CHANGE HANDLERS
    const handleLoginInputChange = e => {
        e.preventDefault();
    
        setLoginInput((prevInput) => ({
            ...prevInput, 
                [e.target.name]: e.target.value})
        )
    };
    
    // SUBMIT FUNCTIONS
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        // error reset
        setErrors( prevErrors =>({
            ...prevErrors, 
                ["login"] : { 
                    error : ""
                }
        }));

        //FRONT END VALIDATE?
        if(!validate(loginInput)){
            return;
        }

        // API Call
        axios.post('http://localhost:8000/api/login', loginInput, {withCredentials: true})
            .then(res => {
                console.log(res)
                saveLoggedInUser(res.data.user)
                // redirect to homepage
                navigate('/user')
            })
            .catch(err => {
                console.log(err)
                // Add errors for display
                setErrors( prevErrors =>({
                    ...prevErrors, 
                        ["login"] : { 
                        ...prevErrors.login,
                            ["error"] : "Invalid Login Credentials"
                    }
            }));
        });
    };
    
    // Front end validation for login
    function validate(loginObject){
        const loginErrors = {}
        let isValid = true
        // check length
        if(loginObject['email'].length < 1){
            loginErrors.email = "Email is required"
            isValid = false
        }
        // check length
        if(loginObject['password'].length < 1){
            loginErrors.password = "Password is required"
            isValid = false
        }
        
        // Set the errors
        setErrors( prevErrors =>({
            ...prevErrors, 
                ["login"] : { 
                ...prevErrors.login,
                    ...loginErrors
                }
        }));
        return isValid
    }

  return (
    <>
        <div id='login' className='card p-3'>
            <h2>Login</h2>

            {/* LOGIN FORM */}
            <form onSubmit={(e) => handleLoginSubmit(e)}>

                <div className="mb-3">
                    <label htmlFor="email" className="form-input">Email:</label>
                    <input type="text" name='email' className='form-control' value={loginInput.email} onChange={(e) => handleLoginInputChange(e)} />
                </div>
                {errors.login.email ? <p className='text-warning'>{errors.login.email}</p> : ""}

                <div className="mb-3">
                    <label htmlFor="password" className="form-input">Password:</label>
                    <input type="password" name='password' className='form-control' value={loginInput.password} onChange={(e) => handleLoginInputChange(e)} />
                </div>
                {errors.login.password ? <p className='text-warning'>{errors.login.password}</p> : ""}

                {errors.login.error ? <p className='text-warning'>{errors.login.error}</p> : ""}
                <button type="submit">Login</button>

            </form>
        </div>
    </>
  )
}

export default LoginForm