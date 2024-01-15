import { useState } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'

// COMPONENTS
import UserDashboard from './components/user/UserDashboard'
import LoginAndReg from './components/auth/LoginAndReg'
import UserContext from './components/context/userContext'



function App() {

const [user, setUser] = useState({})

const saveLoggedInUser = userData => {
  console.log("saving", userData)
  const userObj = {...userData, password: ""}
  setUser(userObj)
}

  return (
    <>
      <UserContext.Provider value={{user, setUser, saveLoggedInUser}}>
          <Routes>
              <Route path='/' element={<Navigate to="/login"/>} />  
              <Route path='/login' element={<LoginAndReg />} />
              <Route path='/user' element={<UserDashboard />} />
          </Routes>
      </UserContext.Provider>
    </>
  )
}

export default App
