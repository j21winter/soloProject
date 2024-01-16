import React, {useContext, useState} from 'react'
import UserContext from '../../context/userContext'
import axios from 'axios'

const AddChildWidget = () => {
    const { user, setUser} = useContext(UserContext)

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
        console.log('updating state')
    
        setChildInput(prevInput => ({
            ...prevInput, 
            [e.target.name] : e.target.value
        }))
    }

    // Validate the child input is correct
    const validateNewChild = (child) => {
        let isValid = true
    
        for( const field in child){
            if(field == ""){
                console.log('empty fields')
                isValid = false
            }
        }
        if(child.parent != user._id){
            //! LOGOUT MAYBE
            console.log('incorrect user ID')
            isValid = false
        }
        return isValid
    }

    const addChild = (e) => {
        e.preventDefault()
        let child = {...childInput}
        console.log(child)
        if(!validateNewChild(child)){
            return console.log("errors with validation")
        }

        axios.post('http://localhost:8000/api/child/new', child, {withCredentials: true}) //add authorization token
            .then(res => {
                console.log(res)
                // update user in dom 
                setUser(prevUser => {
                    return {...prevUser, ["children"] : [...prevUser.children, res.data.child]}
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
            })
            .catch(err => {
                let errors = err.response.data.error.errors
                setChildFormErrors({
                    ...errors
                })
            })
    }
    

  return (
    <div>
        <h3>Add a Child</h3>

        <form onSubmit={ (e) => addChild(e)}>

            <div className="mb-3">
                <label htmlFor="name" className="form-label">Name:</label>
                <input type="text" name='name' className="form-control" value={childInput.name} onChange={e => handleChange(e)}/>
            </div>
            {childFormErrors.name ? <p className='text-warning'>{childFormErrors.name.message}</p> : ""}

            <div className="mb-3">
                <label htmlFor="birthDate" className="form-label">Birth Date:</label>
                <input type="date" name="birthDate"className="form-control" value={childInput.birthDate} onChange={e => handleChange(e)}/>
            </div>
            {childFormErrors.birthDate ? <p className='text-warning'>{childFormErrors.birthDate.message}</p> : ""}

            <div className="mb-3">
                <label htmlFor="height" className="form-label">Height (in):</label>
                <input type="number" name="height"className="form-control" value={childInput.height}  onChange={e => handleChange(e)}/>
            </div>
            {childFormErrors.height ? <p className='text-warning'>{childFormErrors.height.message}</p> : ""}


            <div className="mb-3">
                <label htmlFor="weight" className="form-label">Weight (lbs):</label>
                <input type="number" name="weight"className="form-control" value={childInput.weight} onChange={e => handleChange(e)}/>
            </div>            
            {childFormErrors.weight ? <p className='text-warning'>{childFormErrors.weight.message}</p> : ""}


            <button className="btn btn-success">Add Child</button>

        </form>

    </div>
  )
}

export default AddChildWidget