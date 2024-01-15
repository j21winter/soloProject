import React, { useContext, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import UserProfile from './UserProfile'
import UserAccount from './UserAccount'
import UserRegistry from './UserRegistry'
import UserWishlist from './UserWishlist'
import Header from '../Header'

import UserContext from '../context/userContext'

const UserDashboard = () => {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  const [childInput, setChildInput] = useState({
    name: "",
    birthDate: "",
    height: "",
    weight: ""
  })

  const [childFormErrors, setChildFormErrors] = useState({
    name: "",
    birthDate: "",
    height: "",
    weight: ""
  })

  useEffect(()=> {
    if(!user._id){
      navigate('/login')
    }
    else {
      console.log(`user ${user._id} logged in`)
    }
  },[])

  const handleChange = (e) => {
    e.preventDefault()
    console.log('updating state')

    setChildInput(prevInput => ({
      ...prevInput, 
        [e.target.name] : e.target.value
    }))
  }

  const validateNewChild = (e) => {
    isValid = true

    for( const field in childInput){
      if(field == ""){
        isValid = false
      }
    }
  }
  return (
    <>
      <Header />
      {/* Delete h1 when ready */}
      <h1>{user.firstName}</h1> 
      <div className='p-1 mx-auto vh-100'>
        {/* MAIN CONTENT */}
        <div className="dash d-flex justify-content-between h-75">

          {/* LEFT COLUMN  */}
          <div className="leftColumn border border-3 border-black col-2">

            {/* Your Profile */}
            <div className="widget border border-3 border-black">
              <h3>Your Profile</h3>
              <p>{user.firstName} {user.lastName}</p>

              <table>
                <thead>
                  <tr>
                    <th>Child Name</th>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody >

                  {user.children.length > 0? (user.children.map((child, index) => (
                    <tr key={index}>
                      <td>{child.name}</td>
                      <td>
                        <div className='d-flex'>
                          {/* Create ONCLICK events */}
                          <button>Profile</button>
                          <button>Delete</button>
                        </div>
                      </td>
                    </tr>))
                  ) : ""}

                </tbody>
              </table>
            </div>

            {/* Add A child form */}
            <div className="widget border border-3 border-black">

              <h3>Add a Child</h3>

              <form action="">

                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name:</label>
                  <input type="text" name='name' className="form-control" onChange={e => handleChange(e)}/>
                </div>

                <div className="mb-3">
                  <label htmlFor="birthDate" className="form-label">Birth Date:</label>
                  <input type="date" name="birthDate"className="form-control"  onChange={e => handleChange(e)}/>
                </div>

                <div className="mb-3">
                  <label htmlFor="height" className="form-label">Height (in):</label>
                  <input type="number" name="height"className="form-control"  onChange={e => handleChange(e)}/>
                </div>

                <div className="mb-3">
                  <label htmlFor="weight" className="form-label">Weight (lbs):</label>
                  <input type="number" name="weight"className="form-control"  onChange={e => handleChange(e)}/>
                </div>

                <button className="btn btn-success">Add Child</button>

              </form>
            </div>

            {/* Quick Search */}
            <div className="widget border border-3 border-black">
              <h3>Quick Search</h3>
              <form action="">

                <div className="mb-3">
                  <label htmlFor="height" className="form-label">Height (in):</label>
                  <input type="number" name="height"className="form-control" />
                </div>

                <div className="mb-3">
                  <label htmlFor="weight" className="form-label">Weight (lbs):</label>
                  <input type="number" name="weight"className="form-control" />
                </div>

                <button className="btn btn-success">Search</button>

              </form>
            </div>
          </div>

          {/* CENTER COLUMN */}
          <div className="mainStage border border-3 border-black col-8 p-3">
            {/* conditionally render components */}
            <UserProfile />
            <UserAccount />
            <UserRegistry />
            <UserWishlist />
          </div>

          {/* RIGHT COLUMN */}
          <div className="rightColumn border border-3 border-black col-2">

            {/* My Wishlist */}
            <div className="widget border border-3 border-black">
              <h3>Wishlists</h3>
              {/* <table>
                <thead>
                  <tr>
                    <th>Child</th>
                    <th>Item</th>
                    <th>Match Type</th>
                  </tr>
                </thead>
                <tbody>
                  {user.wishlist.map((wishObject, index) => (
                    <tr key={index}>
                      <td>{wishObject.childName}</td>
                      <td>{wishObject.item.brand},{wishObject.item.type},{wishObject.item.size}</td>
                      <td>{wishObject.item.matchType}</td>
                    </tr>
                  ))}
                </tbody>
              </table> */}
            </div>

            {/* Registries */}
            {/* <div className="widget border border-3 border-black">
              <h3>Registries</h3>
              <ul>
                {user.registries.map((registry, index) => (
                  <Link >{registry.title}</Link>
                ))}
              </ul>
              <button className='btn btn-secondary' >Create Registry</button>
            </div> */}
          </div>

        </div>
      </div>
    </>
  )
}

export default UserDashboard