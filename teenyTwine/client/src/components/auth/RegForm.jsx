import React, {useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/userContext';
import axios from 'axios';

const RegForm = (props) => {
    const {errors, setErrors} = props
    const { saveLoggedInUser } = useContext(UserContext)
    const navigate = useNavigate();

    // INPUT STORAGE
    const [regInput, setRegInput] = useState({
        firstName: "", 
        lastName: "", 
        email: "", 
        password: "", 
        confirmPassword: ""
    });

    // ONCHANGE HANDLER
    const handleRegistrationInputChange = e => {
        e.preventDefault();
    
        setRegInput((prevInput) => ({
            ...prevInput, 
                [e.target.name]: e.target.value})
        )
    };

    // ONSUBMIT FUNCTION
    const handleRegSubmit = (e) => {
        e.preventDefault();
        //! error reset
        setErrors(prevErrors =>( {
            ...prevErrors, 
                ["registration"] : {
                    firstName: "", 
                    lastName: "", 
                    email: "", 
                    password: "", 
                    confirmPassword: ""
            }
        }))
        //! VALIDATE?
    
        // make API call to register
        axios.post('http://localhost:8000/api/register', regInput, {withCredentials: true})
            .then(res => {
                console.log(res)
                saveLoggedInUser(res.data.user)
                // redirect to homepage
                navigate('/user') 
            })
            .catch(err => {
                console.log(err.response.data)
                setErrors( prevErrors => {
                    const formErrors = err.response.data.errors
                    const updatedErrors = {...prevErrors}
                for(const field in formErrors){
                    const message = formErrors[field]["message"]
                    updatedErrors["registration"][field] = message
                }
                return updatedErrors;
            })
        });
    };

  return (
    <>{/* REGISTRATION FORM */}
        <div id='registration' className='card p-3'>
            <h2>Registration</h2>

            <form onSubmit={(e) => handleRegSubmit(e)} >

                <div className="mb-3">
                    <label htmlFor="firstName" className="form-input">First name:</label>
                    <input type="text" name='firstName' className='form-control' value={regInput.firstName} onChange={(e) => handleRegistrationInputChange(e)}/>
                </div>
                {errors.registration.firstName ? <p className='text-warning'>{errors.registration.firstName}</p> : ""}

                <div className="mb-3">
                    <label htmlFor="lastName" className="form-input">Last name:</label>
                    <input type="text" name='lastName' className='form-control' value={regInput.lastName} onChange={(e) => handleRegistrationInputChange(e)}/>
                </div>
                {errors.registration.lastName ? <p className='text-warning'>{errors.registration.lastName}</p> : ""}

                <div className="mb-3">
                    <label htmlFor="email" className="form-input">Email:</label>
                    <input type="text" name='email' className='form-control' value={regInput.email} onChange={(e) => handleRegistrationInputChange(e)}/>
                </div>
                {errors.registration.email ? <p className='text-warning'>{errors.registration.email}</p> : ""}

                <div className="mb-3">
                    <label htmlFor="password" className="form-input">Password:</label>
                    <input type="password" name='password' className='form-control' value={regInput.password} onChange={(e) => handleRegistrationInputChange(e)}/>
                </div>
                {errors.registration.password ? <p className='text-warning'>{errors.registration.password}</p> : ""}

                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-input">Confirm Password:</label>
                    <input type="password" name='confirmPassword' className='form-control' value={regInput.confirmPassword} onChange={(e) => handleRegistrationInputChange(e)}/>
                </div>
                {errors.registration.confirmPassword ? <p className='text-warning'>{errors.registration.confirmPassword}</p> : ""}

                <button type="submit">Register</button>

            </form>
        </div>
    </>
  )
}

export default RegForm