import { useState } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'

// COMPONENTS
import UserDashboard from './components/activeComponents/user/UserDashboard'
import LoginAndReg from './components/auth/LoginAndReg'
import UserContext from './context/userContext'

import UserProfile from './components/activeComponents/user/UserProfile'
import UserAccount from './components/activeComponents/user/UserAccount'
import UserRegistry from './components/activeComponents/user/UserRegistry'
import UserWishlist from './components/activeComponents/user/UserWishlist'

import ChildProfile from './components/activeComponents/child/ChildProfile'

function App() {
// ! save user to local storage to persist refreshes
// const updateLocalStorage = (items) => {
//   localStorage.setItem('selectedItems', JSON.stringify(items));
// };

const [user, setUser] = useState({})
const [child, setChild] = useState({})

const saveLoggedInUser = userData => {
  console.log("saving", userData)
  const userObj = {...userData, password: ""}
  setUser(userObj)
}

  return (
    <>
      <UserContext.Provider value={{user, setUser, child, setChild, saveLoggedInUser}}>
          <Routes>
              <Route path='/' element={<Navigate to="/login"/>} />  
              <Route path='/login' element={<LoginAndReg />} />
              <Route path='/user' element={<UserDashboard activeComponent={<UserProfile />} />} />
              <Route path='/user/child/:id' element={<UserDashboard activeComponent={<ChildProfile />} />} />
              <Route path='/user/account' element={<UserDashboard activeComponent={<UserAccount />} />} />
              <Route path='/user/registries' element={<UserDashboard activeComponent={<UserRegistry />} />} />
              <Route path='/user/wishlist' element={<UserDashboard activeComponent={<UserWishlist />} />} />
          </Routes>
      </UserContext.Provider>
    </>
  )
}

export default App
