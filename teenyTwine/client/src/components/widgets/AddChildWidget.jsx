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
            })
            .catch(err => {
                let errors = err.response.data.error.errors
                setChildFormErrors({
                    ...errors
                })
            })
    }
    

  return (
    <div className='m-1 rounded rounded-2 overflow-auto p-2' style={{maxHeight: "49vh", backgroundColor: "#f5cac3"}}>

        <form onSubmit={ (e) => addChild(e)}>
            <div className='d-flex justify-content-lg-between align-items-center'>
                <p className='fs-4 ms-1 m-0' style={{color: "#84a59d"}}>Add a Child</p>
                <button className="btn btn-sm me-1" style={{backgroundColor: "#84a59d", color: "#ffffff"}}>submit</button>
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



        </form>

    </div>
  )
}

export default AddChildWidget