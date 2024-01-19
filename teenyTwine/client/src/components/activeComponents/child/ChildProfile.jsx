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
      console.log('getting one child' + child._id)
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

    // convert date format
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
          console.log(res.data.child)
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
      console.log(wishlistId)
      console.log(item._id)

      axios.patch(`http://localhost:8000/api/wishlist/add/${wishlistId}/${item._id}`,{}, {withCredentials: true})
        .then(res => console.log(res))
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
            <div>Day : {convertDate(data.dateAdded)}</div>
          </div>
        )
      }
    }
  return (
    <div>
      {/* HEADER */}
      <div className="head d-flex w-100 h-25 justify-content-between align-items-center  ">
        <div className="left">
          <p className='fs-1 m-0'>{currentChild.name} </p>
          <p className='fs-6'>{convertDate(currentChild.birthDate)}</p>
        </div>

        {/* STATS */}
        <div className="stats d-flex align-items-center ">
          <div className='d-flex'>
            <form onSubmit={e => updateChild(e)} className='d-flex column-gap-2 '>

              <div>
                <div className="input_group input-group-sm d-flex column-gap-1 align-items-center  ">
                  <label htmlFor="height">Height: </label>
                  <input type="number" name='height' value={updateInput.height} className="form-control input-sm" onChange={e => handleChange(e)} />
                </div>
                <div className="input_group input-group-sm d-flex column-gap-1 align-items-center  ">
                  <label htmlFor="weight">Weight: </label>
                  <input type="number" name='weight' value={updateInput.weight} className="form-control input-sm" onChange={e => handleChange(e)} />
                </div>
              </div>

              <div className='text-center' >
                  <button className='btn btn-sm  btn-info m-0'>Update</button>
                <div>
                  <p className='m-0'><small>Last Updated:</small></p>
                  <p><small>{convertDate(currentChild.updatedAt)}</small></p>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* MATCHES TABLE */}
      <div className="matches">
        <p className='fs-4'>Matching Garments</p>
        {/* Add filterable options here! */}
        <div className="searchFilters d-flex column-gap-3">
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
        <table className='table'>
          <thead>
            <tr>
              <th>Brand</th>
              <th>Type</th>
              <th>Size</th>
              <th>Match</th>
              <th>Add to...</th>
            </tr>
          </thead>
          <tbody>

            {matches.map((item) => (
              <tr key={item._id}>
                <td>{item.brand}</td>
                <td>{item.type}</td>
                <td>{item.size}</td>
                <td>{matchType(item)}
                </td>
                <td>
                  <div>
                    <form onSubmit={(e) => addToWishList(e, item)}>
                      <select name="addToList" id="addToList" >
                        {user.wishlists.map((wishlist) => (
                          <option key={wishlist._id} value={wishlist._id} >{wishlist.title}</option>
                        ))}
                      </select>
                      <button type='submit'>Add</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
      
      {/* Growth Chart */}
      <div className='h-100'>
        <ResponsiveContainer width={500} height={200}>
          <LineChart data={currentChild.history}>
                <XAxis dataKey={"Time"} />
                {/* Make domain dynamic with largest value in list */}
                <YAxis dataKey={"Data"} domain={[0, 50]} type='number'/> 
                <CartesianGrid stroke='grey' strokeDasharray='5 5'/>
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