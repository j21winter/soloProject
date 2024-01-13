// import { useState } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import axios from 'axios'

import LoginAndReg from './components/LoginAndReg'

function App() {

  return (
    <>
      <div>
        <h1>Header</h1>
      </div>
      <Routes>
          <Route path='/' element={<Navigate to="/login"/>} />  
          <Route path='/login' element={<LoginAndReg />} />
      </Routes>
      
    </>
  )
}

export default App
