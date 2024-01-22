import React, { useContext, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../Header'

// WIDGETS
import ProfileWidget from '../../widgets/ProfileWidget'
import AddChildWidget from '../../widgets/AddChildWidget'
import WishListWidget from '../../widgets/WishListWidget'

import UserContext from '../../../context/userContext'

const UserDashboard = (props) => {
  const { user, setQuickSearchInput } = useContext(UserContext)
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

  const initQuickSearch = (e) => {
    e.preventDefault()
    navigate('/user')
  }


  return (
    <>
      <div className='vw-100 vh-100 overflow-hidden '>
      <Header className="row" style={{height: "10vh"}}/>
        {/* MAIN CONTENT */}
        <div className="dash d-flex justify-content-between p-1" style={{height: "87vh"}}>

          {/* LEFT COLUMN  */}
          <div className="leftColumn col-2 mh-100 d-flex flex-column justify-content-start ">

            {/* Your Profile */}
            <div className="widget d-flex align-items-start h-auto mh-50" style={{"maxHeight":"50%"}}>

              <ProfileWidget />

            </div>

            {/* Add A child form */}
            <div className="widget d-flex align-items-center h-auto">
              <AddChildWidget />

              
            </div>
          </div>

          {/* CENTER COLUMN */}
          <div className="mainStage col-8 m-1 rounded rounded-2 shadow-lg overflow-hidden" style={{backgroundColor: "#ffffff"}}>
            {/* conditionally render components */}
            {activeComponent}
          </div>

          {/* RIGHT COLUMN */}
          <div className="rightColumn col-2 d-flex flex-column justify-content-start pe-2">

            {/* My Wishlist */}
            <div className="widget d-flex align-items-start h-auto" style={{"maxHeight":"50%"}}>
              <WishListWidget />
            </div>

            {/* Quick Search */}
            <div className="widget overflow-scroll rounded rounded-1 h-auto mt-2" style={{backgroundColor: "#e9edc9"}}>
              <form action="">
              <div className='d-flex justify-content-between align-items-center ps-2 pe-2 mb-1'  style={{color: '#ffffff', backgroundColor: "#26637b"}}>
                <p className='fs-5 ms-1 m-0'>Quick Search</p>
              </div>

                <div className="input-group input-group-sm border-0 mb-1">
                  <label htmlFor="height" className="input-group-text border-0 bg-white">Height (in):</label>
                  <input type="number" min={0} step="0.1" name="height"className="form-control border-0 text-end" onChange={(e) => setQuickSearchInput( prev => ({...prev, [e.target.name]: e.target.value}))}/>
                </div>

                <div className="input-group input-group-sm mb-1">
                  <label htmlFor="weight" className="input-group-text border-0 bg-white">Weight (lbs):</label>
                  <input type="number" min={0} step="0.1" name="weight"className="form-control border-0 text-end" onChange={(e) => setQuickSearchInput( prev => ({...prev, [e.target.name]: e.target.value}))} />
                </div>
                
                <button className="btn btn-sm w-100 rounded-top-0 " style={{backgroundColor: "#84a59d", color: "#ffffff"}} onClick={(e) => initQuickSearch(e)}>search</button>
                
              </form>
            </div>

          </div>

        </div>
      </div>
    </>
  )
}

export default UserDashboard