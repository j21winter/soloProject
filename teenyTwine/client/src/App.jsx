import { useEffect, useState } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'

// COMPONENTS
import UserDashboard from './components/activeComponents/user/UserDashboard'
import LoginAndReg from './components/auth/LoginAndReg'
import UserContext from './context/userContext'

import UserProfile from './components/activeComponents/user/UserProfile'
import UserRegistry from './components/activeComponents/user/UserRegistry'
import UserWishlist from './components/activeComponents/user/UserWishlist'

import QuickSearch from './components/QuickSearch'
import ChildProfile from './components/activeComponents/child/ChildProfile'

function App() {
// ! save user to local storage to persist refreshes
// const updateLocalStorage = (items) => {
//   localStorage.setItem('selectedItems', JSON.stringify(items));
// };
const storedUser = JSON.parse(localStorage.getItem('user'))
const [user, setUser] = useState(storedUser)
const [child, setChild] = useState({})
const [quickSearchInput, setQuickSearchInput] = useState({height: "", weight: ""})
const [displayWishlist, setDisplayWishList] = useState({})

const saveLoggedInUser = userData => {
  console.log("saving", userData)
  const userObj = {...userData, password: ""}
  setUser(userObj)
  localStorage.setItem('user', JSON.stringify(user))
}

useEffect(() => {
  if(user){
    console.log("saving user to local storage")
    localStorage.setItem('user', JSON.stringify(user))
  }
}, [user])


  return (
    <>
      <UserContext.Provider value={{user, setUser, child, setChild, saveLoggedInUser, quickSearchInput, setQuickSearchInput, displayWishlist, setDisplayWishList}}>
          <Routes>
              <Route path='/' element={<Navigate to="/login"/>} />  
              <Route path='/login' element={<LoginAndReg />} />
              <Route path='/user' element={<UserDashboard activeComponent={<QuickSearch />} />} />
              <Route path='/user/account' element={<UserDashboard activeComponent={<UserProfile />} />} />
              <Route path='/user/child/:id' element={<UserDashboard activeComponent={<ChildProfile />} />} />
              <Route path='/user/registries' element={<UserDashboard activeComponent={<UserRegistry />} />} />
              <Route path='/user/wishlist' element={<UserDashboard activeComponent={<UserWishlist />} />} />
          </Routes>
      </UserContext.Provider>
    </>
  )
}

export default App
