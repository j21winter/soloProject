import React, { useContext, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Header'

// WIDGETS
import ProfileWidget from './widgets/profileWidget'
import AddChildWidget from './widgets/AddChildWidget'
import WishListWidget from './widgets/WishListWidget'

import UserContext from '../context/userContext'

const UserDashboard = (props) => {
  const { user } = useContext(UserContext)
  const {activeComponent} = props
  const navigate = useNavigate()


  useEffect(()=> {
    if(!user._id){
      navigate('/login')
    }
    else {
      console.log(`user ${user._id} logged in`)
    }
  },[])

  return (
    <>
      <Header />
      <div className='p-1 mx-auto vh-100'>
        {/* MAIN CONTENT */}
        <div className="dash d-flex justify-content-between h-75">

          {/* LEFT COLUMN  */}
          <div className="leftColumn col-2">

            {/* Your Profile */}
            <div className="widget border border-1 border-black">

              <ProfileWidget />

            </div>

            {/* Add A child form */}
            <div className="widget border border-1 border-black">
              <AddChildWidget />

              
            </div>

            {/* Quick Search */}
            <div className="widget border border-1 border-black">
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
          <div className="mainStage border border-1 border-black col-8 p-3">
            {/* conditionally render components */}
            {activeComponent}
          </div>

          {/* RIGHT COLUMN */}
          <div className="rightColumn col-2">

            {/* My Wishlist */}
              <WishListWidget />

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