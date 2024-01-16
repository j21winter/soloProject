import React, {useEffect, useState, useContext} from 'react'
import {useLocation} from 'react-router-dom'
import axios from 'axios'

import UserContext from '../context/userContext'

const ChildProfile = () => {
    const {user, setUser} = useContext(UserContext)
    const location = useLocation()
    const { child } = location.state
    const [currentChild, setCurrentChild] = useState(child)
    const [matches, setMatches] = useState([])

    // ON MOUNT CALLS THE DB FOR THE ACTUAL CHILD
    useEffect(() => {
      console.log('getting one child' + child._id)
      const { _id } = child
      axios.get(`http://localhost:8000/api/child/${_id}`, {withCredentials: true})
        .then(res => {
          console.log(res.data)
          setCurrentChild(res.data)
        })
        .catch(err => console.log(err))
      axios.get(`http://localhost:8000/api/items/${currentChild.height}/${currentChild.weight}`, {withCredentials: true})
        .then(res => {
          setMatches(res.data)
        })
        .catch(err => console.log(err))
    },[child])

    // hold update form input
    const [updateInput, setUpdateInput] = useState({
      height: currentChild.height,
      weight: currentChild.weight
    })

    // HANDLE CHANGE IN THE FORM
    const handleChange = e => {
      e.preventDefault()
      setUpdateInput(prevInput =>  ({
          ...prevInput,
            [e.target.name] : e.target.value
      }))
    }

    // UPDATE CHILD IN THE DB
    const updateChild = e => {
      e.preventDefault()
      let updateInfo = updateInput
      if(updateInfo.height.length < 1 || updateInfo.weight.length < 1 ){
        console.log("Not a valid update object")
        return updateInfo;
      }
      // make API call
      axios.patch(`http://localhost:8000/api/child/${child._id}`, updateInfo, {withCredentials: true})
        .then(res => {
          console.log(res.data.child)
          setCurrentChild( res.data.child)
        })
        .catch(err => console.log(err))
    }

  return (
    <div>
      <div className="head d-flex">
        <div className="left">
          <h1>{currentChild.name}</h1>
          <p>{currentChild.birthdate}</p>
        </div>
        <div className="stats d-flex">
          <p>Stats:</p>
          <table>
            <tr>
              <th>Height</th>
              <td>{currentChild.height}</td>
            </tr>
            <tr>
              <th>Weight</th>
              <td>{currentChild.weight}</td>
            </tr>
            <tr>
              <th>Last Updated</th>
              <td>{currentChild.updatedAt}</td>
            </tr>
          </table>
        </div>
        <div className="update d-flex">
          <p>Update</p>
          <form onSubmit={e => updateChild(e)}>
            <div className="mb-3">
              <label htmlFor="height" className="form-label">Height:</label>
              <input type="number" name='height' value={updateInput.height} className="form-control" onChange={e => handleChange(e)} />
            </div>
            <div className="mb-3">
              <label htmlFor="weight" className="form-label">Weight:</label>
              <input type="number" name='weight' value={updateInput.weight} className="form-control" onChange={e => handleChange(e)}/>
            </div>
            <button className='btn btn-info'>Update {currentChild.name}</button>
          </form>
        </div>

      </div>
      <div className="matches">
        <table className='table'>
          <thead>
            <tr>
              <th>Brand</th>
              <th>Type</th>
              <th>Size</th>
              <th>Match</th>
              <th>Add to...</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((item) => (
              <tr key={item._id}>
                <td>{item.brand}</td>
                <td>{item.type}</td>
                <td>{item.size}</td>
                <td>"calculate match"</td>
                <td>
                  <div>
                    <button className='btn btn-secondary '>Wishlist</button>
                    <button className='btn btn-secondary '>Registry</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}

export default ChildProfile