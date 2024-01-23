import React, { useContext, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../Header'

// WIDGETS
import ProfileWidget from '../../widgets/ProfileWidget'
import AddChildWidget from '../../widgets/AddChildWidget'
import WishListWidget from '../../widgets/WishListWidget'
import QuickSearchWidget from '../../widgets/QuickSearchWidget'

import UserContext from '../../../context/userContext'

const UserDashboard = (props) => {
  const { user, setQuickSearchInput } = useContext(UserContext)
  const {activeComponent} = props
  const navigate = useNavigate()


  useEffect(()=> {
    if(!user || !user._id){
      navigate('/logout')

    }
    else {
      console.log(`user ${user._id} logged in`)
    }
  },[user])

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
          <div className="leftColumn col-2 mh-100 d-flex flex-column justify-content-between ">

            {/* Your Profile */}
            <div className="widget d-flex align-items-start h-50 mh-50" style={{"maxHeight":"50%"}}>

              <ProfileWidget />

            </div>

            {/* Add A child form */}
            <div className="widget d-flex align-items-start h-50">
              <AddChildWidget />
            </div>
          </div>

          {/* CENTER COLUMN */}
          <div className="mainStage col-8 m-1 rounded rounded-2 shadow-lg overflow-hidden" style={{backgroundColor: "#ffffff"}}>
            {/* conditionally render components */}
            {activeComponent}
          </div>

          {/* RIGHT COLUMN */}
          <div className="rightColumn col-2 d-flex flex-column justify-content-between pe-2">

            {/* My Wishlist */}
            <div className="widget d-flex align-items-start h-50" style={{"maxHeight":"50%"}}>
              <WishListWidget />
            </div>

            {/* Quick Search */}
            <div className='h-50'>
              <QuickSearchWidget />
            </div>

          </div>

        </div>
      </div>
    </>
  )
}

export default UserDashboard