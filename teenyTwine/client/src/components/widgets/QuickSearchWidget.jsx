import React, { useContext, useState } from 'react'
import UserContext from '../../context/userContext'
import { useNavigate } from 'react-router-dom'




const QuickSearchWidget = () => {
    const { user, setQuickSearchInput } = useContext(UserContext)
    const navigate = useNavigate()

    const [formInput, setFormInput] = useState({
        height: "",
        weight: ""
    })


    const initQuickSearch = (e) => {
        e.preventDefault()
        setQuickSearchInput(formInput)
        setFormInput({height: "", weight: ""})
        navigate('/user')
      }

  return (
    <div>
        <div className="widget overflow-scroll rounded rounded-1 h-auto mt-2" style={{backgroundColor: "#e9edc9"}}>
            <form action="">
                <div className='d-flex justify-content-between align-items-center ps-2 pe-2 mb-1'  style={{color: '#ffffff', backgroundColor: "#26637b"}}>
                    <p className='fs-5 ms-1 m-0'>Quick Search</p>
                </div>

                <div className="input-group input-group-sm border-0 mb-1">
                    <label htmlFor="height" className="input-group-text border-0 bg-white">Height (in):</label>
                    <input type="number" min={0} step="0.1" name="height"className="form-control border-0 text-end" value={formInput.height} onChange={(e) => setFormInput( prev => ({...prev, [e.target.name]: e.target.value}))}/>
                </div>

                <div className="input-group input-group-sm mb-1">
                    <label htmlFor="weight" className="input-group-text border-0 bg-white">Weight (lbs):</label>
                    <input type="number" min={0} step="0.1" name="weight"className="form-control border-0 text-end" value={formInput.weight} onChange={(e) => setFormInput( prev => ({...prev, [e.target.name]: e.target.value}))} />
                </div>
                
                <button className="btn btn-sm w-100 rounded-top-0 " style={{backgroundColor: "#84a59d", color: "#ffffff"}} onClick={(e) => initQuickSearch(e)}>search</button>
            
            </form>
        </div>
    </div>
  )
}

export default QuickSearchWidget