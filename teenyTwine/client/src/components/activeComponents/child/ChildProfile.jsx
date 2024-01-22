import React, {useEffect, useState, useContext} from 'react'
import axios from 'axios'
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip, Legend, ResponsiveContainer, ErrorBar} from 'recharts'

import UserContext from '../../../context/userContext'

const ChildProfile = () => {
    const {user, setUser, child, setChild} = useContext(UserContext)
    const [currentChild, setCurrentChild] = useState(child)
    const [matches, setMatches] = useState([])
     // hold update form input
    const [updateInput, setUpdateInput] = useState({
      height: currentChild.height,
      weight: currentChild.weight
    })

    // ON MOUNT CALLS THE DB FOR THE ACTUAL CHILD
    useEffect(() => {
      const { _id } = child
      axios.get(`http://localhost:8000/api/child/${_id}`, {withCredentials: true})
        .then(res => {
          let foundChild = res.data
          setCurrentChild(foundChild)
          setUpdateInput({
            height: foundChild.height, 
            weight: foundChild.weight
          })
        })
        .catch(err => console.log(err))
      axios.get(`http://localhost:8000/api/items/${currentChild.height}/${currentChild.weight}`, {withCredentials: true})
        .then(res => {
          setMatches(res.data)
        })
        .catch(err => console.log(err))
    },[child])


    // get all matches and get all matches for every update of the current child
    useEffect(() => {
      axios.get(`http://localhost:8000/api/items/${currentChild.height}/${currentChild.weight}`, {withCredentials: true})
        .then(res => {
          setMatches(res.data)
        })
        .catch(err => console.log(err))
    },[currentChild])

    // convert date format long
    const convertDate = data => {
      const parts = data.split('T')
      const date = parts[0].split('-')

      const newDate = [] 
      const months = ['January', 'February', 'March','April','May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      
      // month
      newDate.push(months[date[1] -1])
      // day
      newDate.push(date[2])
      // year
      newDate.push(date[0])

      return newDate.join(' ')
    }

    // convert date format concise
    const convertDateConcise = data => {
      console.log(data)
      const parts = data.split('T')
      const date = parts[0].split('-')

      const newDate = [date[1], date[2], date[0]]



      return newDate.join("/")
    }

    // HANDLE CHANGE IN THE FORM
    const handleChange = e => {
      e.preventDefault()
      setUpdateInput(prevInput =>  ({
          ...prevInput,
            [e.target.name] : e.target.value
      }))
    }

    // UPDATE CHILD IN THE DB
    const updateChild = e => {
      e.preventDefault()
      let updateInfo = updateInput
      if(updateInfo.height.length < 1 || updateInfo.weight.length < 1 ){
        console.log("Not a valid update object")
        return updateInfo;
      }
      // make API call
      axios.patch(`http://localhost:8000/api/child/${child._id}`, updateInfo, {withCredentials: true})
        .then(res => {
          setCurrentChild(res.data.child)
        })
        .catch(err => console.log(err))
    }

    // calculate matchtype in form
    const matchType = item => {
      let {height, weight} = currentChild
      let {minHeight, maxHeight, minWeight, maxWeight} = item
      if(height >= minHeight && height <= maxHeight && weight >= minWeight && weight <= maxWeight){
        return (<p>100%</p>)
      } else {
        return (<p>50%</p>)
      }
    }

    // Add Item to wishlist
    const addToWishList = (e, item) => {
      e.preventDefault()
      const wishlistId = e.target.elements.addToList.value

      axios.patch(`http://localhost:8000/api/wishlist/add/${wishlistId}/${item._id}`,{}, {withCredentials: true})
        .then(res => {
          setUser(prevUser => ({
              ...prevUser, 
                  ['wishlists'] : prevUser["wishlists"].map((wishlist) => (
                      wishlist._id === res.data._id ? res.data : wishlist
                  )), 
          }))
        })
        .catch(err => console.log(err))
    }


    const ToolTipContent = (props) => {
      if(!props.active || !props.payload){
          return null
      } else {
        const data = props.payload[0].payload
        return (
          <div className='rounded rounded-2 bg-body-secondary text-center'>
            <div>Height: {data.height}</div>
            <div>Weight: {data.weight}</div>
            <div>Day : {convertDateConcise(data.dateAdded)}</div>
          </div>
        )
      }
    }

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex w-100 m-0 h-auto justify-content-between align-items-start ">
        <div className="left p-2 text-center col-7 m-0">
          <p className='fs-2 m-0' style={{color:"#26637b"}}>{currentChild.name} </p>
          <p className=''><small style={{color:"#84a59d"}}>{convertDate(currentChild.birthDate)}</small></p>
        </div>

        {/* STATS */}
        <div className="stats col-5 rounded rounded-1 ">
            <form onSubmit={e => updateChild(e)} className='rounded rounded-2 overflow-hidden m-1' style={{backgroundColor: "#e9edc9"}}>
              <div className='ps-2 pe-2 d-flex justify-content-between '  style={{color: '#26637b', backgroundColor: "#c0d6df"}}>
                  <p className='fs-6  m-0 text-center'>Stats</p>
                  <p className='m-0 p-0'><small>Last Updated {convertDateConcise(currentChild.updatedAt)}</small></p>
              </div>
              <div className="d-flex">
                <div className="input-group input-group-sm m-1 w-50">
                  <label htmlFor="height" className='input-group-text border-0 ' style={{backgroundColor: "#ffffff"}}>Height (in) </label>
                  <input type="number" name='height' value={updateInput.height} className="form-control text-end border-0 " onChange={e => handleChange(e)} />
                </div>
                <div className="input-group input-group-sm m-1 w-50">
                  <label htmlFor="weight" className='input-group-text border-0 ' style={{backgroundColor: "#ffffff"}}>Weight (lbs) </label>
                  <input type="number" name='weight' value={updateInput.weight} className="form-control input-sm text-end border-0 " onChange={e => handleChange(e)} />
                </div>
              </div>
              <button className="btn btn-sm w-100 rounded-top-0 " style={{backgroundColor: "#84a59d", color: "#ffffff"}} type="submit">update stats</button>
            </form>
        </div>
      </div>

      {/* MATCHES TABLE */}
      <div className="matches p-2 rounded rounded-2 m-1 mb-3" style={{backgroundColor: "#eaeaea"}}>
        <p className='fs-3 text-center m-0' style={{color:"#26637b"}}>Matching Garments</p>
        {/* Add filterable options here! */}
        <div className="searchFilters d-flex justify-content-center column-gap-3">
          {/* use an onchange to sort matching list */}
          <form>
            <label htmlFor="filter">Filter by:</label>
            <select name="filter" id="">
              {/* POPULATE WITH OPTIONS FROM THE LIST */}
              <option value="" disabled >Filter</option>
            </select>
          </form>
          {/* use an onchange to sort matching list */}
          <form>
          <label htmlFor="sort">Sort by:</label>
            <select name="sort" id="">
              {/* POPULATE WITH OPTIONS FROM THE LIST */}
              <option value="" disabled >Sort</option>
            </select>
          </form>
        </div>

        {/* Match display */}
        <div className="myTable d-flex justify-content-between overflow-scroll w-100 rounded rounded-2">
          <div className='p-1 text-start col-2' style={{width: "15%", color: '#26637b', backgroundColor: "#c0d6df"}}>
            <p className='mb-1'>Brand</p>
            <p className='mb-1'>Type</p>
            <p className='mb-1'>Size</p>
            <p className='mb-3'>Match</p>
            <p className='mb-1'>Add To...</p>
          </div>
          {matches.map((item) => (
            <div key={item._id} className='text-center ms-1 m-0 p-0 bg-white rounded rounded-3 overflow-auto col-1 '>
              <p className='fw-semibold mb-1' style={{backgroundColor:"#f7e1d7"}}>{item.brand}</p>
              <p className='mb-1'>{item.type}</p>
              <p className='mb-1'>{item.size}</p>
              <p className='mb-1'>{matchType(item)}</p>
              <div className=''>
                <form onSubmit={(e) => addToWishList(e, item)} className='m-0'>
                  <select name="addToList" id="addToList" className="border-0"style={{width: "90%"}}>
                    {user.wishlists.map((wishlist) => (
                      <option key={wishlist._id} value={wishlist._id} >{wishlist.title}</option>
                      ))}
                  </select>
                  <button type='submit' className='w-100 btn m-0 btn-sm rounded-top-0 ' style={{backgroundColor: "#f7e1d7"}}>Add</button>

                </form>
              </div>
          </div>
          ))}
        </div>
      </div>
      
      {/* Growth Chart */}

      <div className='h-auto'>
      <p className='fs-3 text-center m-0' style={{color:"#26637b"}}>Growth Chart</p>
        <ResponsiveContainer width="90%" height={200}>
          <LineChart data={[...currentChild.history, {height: currentChild.height, weight: currentChild.weight, dateAdded: currentChild.updatedAt}]}>
            <XAxis dataKey={"Time"} />
            {/* Make domain dynamic with largest value in list */}
            <YAxis dataKey={"Data"} domain={[0, (Math.floor(currentChild.weight + 10))]} tickCount={4} type='number'/> 
            <CartesianGrid stroke='grey' strokeDasharray='3'/>
            <Line dataKey={'height'} stroke='purple' strokeWidth={3} isAnimationActive={false}/>
            <Line dataKey={'weight'} stroke='pink' strokeWidth={3} isAnimationActive={false}/>
            <Legend />
            <Tooltip content={ToolTipContent}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}

export default ChildProfile