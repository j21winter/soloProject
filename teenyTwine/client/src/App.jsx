import { useState } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'

// COMPONENTS
import UserDashboard from './components/user/UserDashboard'
import LoginAndReg from './components/auth/LoginAndReg'
import UserContext from './components/context/userContext'

import UserProfile from './components/user/UserProfile'
import UserAccount from './components/user/UserAccount'
import UserRegistry from './components/user/UserRegistry'
import UserWishlist from './components/user/UserWishlist'

import ChildProfile from './components/child/ChildProfile'

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
