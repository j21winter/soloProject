import React, {useContext, useState} from 'react'
import UserContext from '../../context/userContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddChildWidget = () => {
    const { user, setUser, child, setChild} = useContext(UserContext)
    const navigate = useNavigate()


    // Form Input
    const [childInput, setChildInput] = useState({
        name: "",
        birthDate: "",
        height: "",
        weight: "", 
        parent: user._id
    })

    // Form Errors
    const [childFormErrors, setChildFormErrors] = useState({
        name: "",
        birthDate: "",
        height: "",
        weight: ""
    })

    // Onchange Handler
    const handleChange = (e) => {
        e.preventDefault()
    
        setChildInput(prevInput => ({
            ...prevInput, 
            [e.target.name] : e.target.value
        }))
    }

    // Validate the child input is correct
    const validateNewChild = (childObj) => {
        let isValid = true
    
        for( const field in childObj){
            if(field == ""){
                console.log('empty fields')
                isValid = false
            }
        }
        if(childObj.parent != user._id){
            //! LOGOUT MAYBE
            console.log('incorrect user ID')
            isValid = false
        }
        return isValid
    }

    const addChild = (e) => {
        e.preventDefault()
        let childObj = {...childInput}
        
        if(!validateNewChild(childObj)){
            return console.log("errors with validation")
        }

        axios.post('http://localhost:8000/api/child/new', childObj, {withCredentials: true}) //add authorization token
            .then(res => {
                // update user in dom 
                setUser(prevUser => {
                    return {...prevUser, 
                        ["children"] : [...prevUser.children, res.data.child], 
                        ["wishlists"] : [...prevUser.wishlists, res.data.wishlist]}
                })
                // reset input fields
                setChildInput({
                    name: "",
                    birthDate: "",
                    height: "",
                    weight: "", 
                    parent: user._id
                })
                // reset errors
                setChildFormErrors({})

                setChild(res.data.child)

                navigate(`/user/child/${child._id}`)

            })
            .catch(err => {
                let errors = err.response.data.error.errors
                setChildFormErrors({
                    ...errors
                })
            })
    }
    

  return (
    <div className='m-1 rounded rounded-2 overflow-auto shadow-lg ' style={{maxHeight: "49vh", backgroundColor: "#e9edc9"}}>

        <form onSubmit={ (e) => addChild(e)}>
            <div className='d-flex justify-content-between align-items-center ps-2 pe-2 mb-1'  style={{color: '#ffffff', backgroundColor: "#26637b"}}>
                <p className='fs-5 ms-1 m-0'>Add a Child</p>
            </div>
            <div className="input-group input-group-sm border-0 mb-1">
                <label htmlFor="name" className="input-group-text border-0" style={{backgroundColor: "#ffffff"}}>Name:</label>
                <input type="text" name='name' className="form-control border-0 text-end" value={childInput.name} onChange={e => handleChange(e)}/>
            </div>
            {childFormErrors.name ? <p className='text-warning'>{childFormErrors.name.message}</p> : ""}

            <div className="input-group input-group-sm mb-1">
                <label htmlFor="birthDate" className="input-group-text border-0" style={{backgroundColor: "#ffffff"}}>Birth Date:</label>
                <input type="date" name="birthDate"className="form-control border-0 text-end" value={childInput.birthDate} onChange={e => handleChange(e)}/>
            </div>
            {childFormErrors.birthDate ? <p className='text-warning'>{childFormErrors.birthDate.message}</p> : ""}

            <div className="input-group input-group-sm mb-1">
                <label htmlFor="height" className="input-group-text border-0" style={{backgroundColor: "#ffffff"}}>Height (in):</label>
                <input type="number" name="height" className="form-control border-0 text-end" value={childInput.height} min={0} step="0.1" onChange={e => handleChange(e)}/>
            </div>
            {childFormErrors.height ? <p className='text-warning'>{childFormErrors.height.message}</p> : ""}

            <div className="input-group input-group-sm mb-1">
                <label htmlFor="weight" className="input-group-text border-0" style={{backgroundColor: "#ffffff"}}>Weight (lbs):</label>
                <input type="number" name="weight"className="form-control border-0 text-end" value={childInput.weight} min={0} step="0.1" onChange={e => handleChange(e)}/>
            </div>            
            {childFormErrors.weight ? <p className='text-warning'>{childFormErrors.weight.message}</p> : ""}

            <button  type="submit" className="btn btn-sm w-100 rounded-top-0 " style={{backgroundColor: "#84a59d", color: "#ffffff"}}>submit</button>

        </form>

    </div>
  )
}

export default AddChildWidget