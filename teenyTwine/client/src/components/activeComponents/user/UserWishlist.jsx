import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../../context/userContext'
import axios from 'axios'

const UserWishlist = () => {
  const {user, setUser, displayWishlist, setDisplayWishList} = useContext(UserContext)
  const [organizedList, setOrganizedList] = useState({})
  const [wishlistFormInput, setWishlistFormInput] = useState({
    title: "",
    child: null,
    parent: user._id
  })
  const [formErrors, setFormErrors] = useState({
    title: "",
  })


  // combine and organize wishlists to children groups for display
  useEffect(() => {
    const obj = {other: []}

    user.children.forEach(child => {obj[child.name] = []})

    user.wishlists.forEach(wishlist => {

      if(wishlist.child && wishlist.child.name ){
        let key = wishlist.child.name
        obj[key].push(wishlist)
      } else{ 
        obj.other.push(wishlist)
      }

    })

    setOrganizedList(obj)

  }, [user.wishlists, user.children])

  // on Change handler
  const formChangeHandler = (e) => {
    e.preventDefault()
    setWishlistFormInput(prevInput => ({
      ...prevInput, 
        [e.target.name] : e.target.value === "null" ? null : e.target.value

    }))
    console.log(wishlistFormInput)
  }


  // create wishlist
  const submitWishlist = (e) => {
    e.preventDefault()
    const newWishlist = {...wishlistFormInput}
    setFormErrors({title: ""})
    // validate form input
    if(newWishlist.title.length < 1 ){
      setFormErrors({title: "Title cannot be empty"})
      return newWishlist
    } else if (newWishlist.title.length < 3 ){
      setFormErrors({title: "Title must be 3 characters or more!"})
      return newWishlist
    }

    axios.post('http://localhost:8000/api/wishlist/new', newWishlist , {withCredentials: true})
      .then(res => {
        setUser(prevUser => ({
          ...prevUser,
            ["wishlists"] : [...prevUser.wishlists, res.data.newWishlist]
        }))
        setWishlistFormInput({
          title: "",
          child: null,
          parent: user._id})
      })
      .catch(err => {
        console.log(err)
        setFormErrors({title: err.response.data.errors.title.message})
      })

      document.getElementById('child').selectedIndex = 0
  }

  // calculate matchtype in form
  const matchType = (item, wishlist) => {
    if(!wishlist.child){
      return "n/a"
    }
    let {height, weight} = wishlist.child
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
            ["wishlists"] : prevUser.wishlists.map((wishlist) => (
              wishlist._id == wishlistId ? res.data : wishlist
            ))
        }))
      })
      .catch(err => console.log(err))
  }

  // Remove Item from wishlist
  const removeFromWishlist = async (e, item) => {
    console.log("Removing Items")
    e.preventDefault()
    try {
      const updatedWishlist = await axios.patch(`http://localhost:8000/api/wishlist/remove/${displayWishlist._id}/${item._id}`, {}, {withCredentials: true})
      const updatedUser = await setUser(prevUser => ({
        ...prevUser, 
            ["wishlists"] : prevUser.wishlists.map((wishlist) => (
                wishlist._id == updatedWishlist.data._id ? updatedWishlist.data : wishlist
            ))
            }))
      const updatedDisplayWishlist = setDisplayWishList(prevWishlist => ({
        ...prevWishlist, 
            ['items'] : prevWishlist.items.filter((someItem) => someItem._id != item._id)
      }))
    } catch (err) {
      console.log(err)
    }
  }

  // Delete Wishlist
  const deleteWishlist = (e, wishlist) => {
    e.preventDefault()

    axios.delete(`http://localhost:8000/api/wishlist/${wishlist._id}`, {data: {parentId: user._id, }, withCredentials: true})
      .then(res => { 
        const deletedWishlist = res.data.deletedList
        setUser(prevUser => ({
            ...prevUser, 
                ['wishlists'] : prevUser.wishlists.filter(wishlist => wishlist._id != deletedWishlist._id)
        }))
      })
      .catch(err => console.log(err))
  }

  return (
    <>
      {/* Header */}
      <div className='d-flex justify-content-between'>
        <div className="left p-2 text-center col-7">
          <p className='fs-2 m-0' style={{color:"#26637b"}}>Wishlists</p>
        </div>
        {/* Update form */}
        <div className='stats col-5 rounded rounded-1' >
          <form onSubmit={(e) => submitWishlist(e)} className='rounded rounded-2 overflow-hidden m-1' style={{backgroundColor: "#e9edc9"}} >
            <div className='ps-2 pe-2 d-flex justify-content-between '  style={{color: '#26637b', backgroundColor: "#c0d6df"}}>
                  <p className='fs-6  m-0 text-center'>Create Wishlist</p>
            </div>
            <div className='d-flex'>
              <div className="input-group input-group-sm m-1 w-50">
                <label htmlFor="title" className='input-group-text border-0 '  style={{backgroundColor: "#ffffff"}}>Title</label>
                <input type="text" className="form-control text-end border-0 " value={wishlistFormInput.title} onChange={(e) => formChangeHandler(e)} name="title"/>
                {formErrors.title ? <p><small>{formErrors.title}</small></p> : ""}
              </div>
              <div className="input-group input-group-sm m-1 w-50">
                <label htmlFor="child" className='input-group-text border-0 '>Child</label>
                <select name="child" id="child" value={wishlistFormInput.child} className='form-control text-end border-0 form-select' onChange={(e) => formChangeHandler(e)} >
                  <option value="null" disabled selected >optional</option>
                  <option value="null" >none</option>
                  {user.children.map((child) => (
                    <option key={child._id} value={child._id} >{child.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="btn btn-sm w-100 rounded-top-0 " style={{backgroundColor: "#84a59d", color: "#ffffff"}} type="submit">create</button>
          </form>
        </div>
      </div>

    {/* Categorized wishlists */}
      <div className='d-flex overflow-hidden col-12 mx-auto justify-content-around mb-2' style={{height: "40%"}} >
        {/* children wishlists */}
        <div className="children col-8 h-100 p-0 m-1 me-0 rounded-top-2" style={{backgroundColor: "#eaeaea"}}>
          <p className='text-center w-100 rounded-top-2 m-0'  style={{color: '#26637b', backgroundColor: "#c0d6df"}}>Children Wishlists</p>

            <div className='d-flex justify-content-start column-gap-1 overflow-scroll h-100 p-1 m-0'>
              {Object.entries(organizedList).filter(([childName, wishlistArr]) => childName != "other").map(([childName, wishlistArr]) => (

                <div key={childName} className='col-3 d-flex flex-column rounded rounded-2 overflow-scroll justify-content-start  p-0 m-0 h-75' style={{color: '#26637b', backgroundColor: "#c0d6df"}}>
                  <p className='mb-1 text-center sticky-top' style={{color: '#ffffff', backgroundColor: "#26637b"}}>{childName}</p>

                    {wishlistArr.map((wishlist) => (
                        <div key={wishlist._id} className='d-flex w-100 justify-content-between column-gap-1 align-items-start mb-1 px-1 h-100' >
                          <button className='btn btn-sm m-0 p-1 w-100 rounded-end-0 ' style={{backgroundColor: "#ffffff", color: "#26637b"}} onClick={() => setDisplayWishList(wishlist)}>{wishlist.title}</button>
                          <button className='btn btn-sm m-0 p-1 rounded-start-0' style={{backgroundColor: "#26637b", color: "#ffffff"}} onClick={(e) => deleteWishlist(e, wishlist)}>delete</button>
                        </div>

                    ))}

                </div>
              ))}

          </div>
        </div>
        {/* other wishlists */}
          <div className="children col-3 h-100 p-0 m-1 ms-0 rounded-top-2" style={{backgroundColor: "#eaeaea"}}>
            <p className='text-center w-100 rounded-top-2 m-0'  style={{color: '#26637b', backgroundColor: "#c0d6df"}}>other Wishlists</p>

            <div className='d-flex justify-content-start align-items-start column-gap-1 overflow-scroll h-100 p-1 m-0'>
              {Object.entries(organizedList).filter(([childName, wishlistArr]) => childName === "other").map(([childName, wishlistArr]) => (

                  <div key={childName} className='w-100'>

                      {wishlistArr.map((wishlist) => (
                          <div key={wishlist._id} className='d-flex w-100 justify-content-between column-gap-1 align-items-start mb-1 px-1 h-100'>
                            <button className='btn btn-sm m-0 p-1 w-100 rounded-end-0 ' style={{backgroundColor: "#ffffff", color: "#26637b"}} onClick={() => setDisplayWishList(wishlist)}>{wishlist.title}</button>
                            <button className='btn btn-sm m-0 p-1 rounded-start-0' style={{backgroundColor: "#26637b", color: "#ffffff"}} onClick={(e) => deleteWishlist(e, wishlist)}>delete</button>
                          </div>
                      ))}
                    </div>

))}
            </div>
              
          </div>
      </div>
      
      {/* display wishlist table */}
      <div className='d-flex flex-column  col-12 ms-3 mt-3'>
        {displayWishlist.title ? <p className='fs-3 text-center' style={{color: "#26637b"}}>{displayWishlist.title } Wishlist Items</p> : <p className='fs-3 text-center' style={{color: "#26637b"}}>Please Select a wishlist to view items</p>}
      <div className="myTable d-flex justify-content-start overflow-scroll w-100 rounded rounded-2">
          <div className='p-1 text-start ' style={{width: "15%", color: '#26637b', backgroundColor: "#c0d6df"}}>
            <p className='mb-1'>Brand</p>
            <p className='mb-1'>Type</p>
            <p className='mb-1'>Size</p>
            <p className='mb-3'>Match</p>
            <p className='mb-1'>Actions</p>
          </div>

          {!displayWishlist.items ? "" : displayWishlist.items.map((item) => (

            <div className='text-center ms-1 m-0 p-0 bg-light rounded rounded-3 overflow-auto col-2 '>
              <p className='fw-semibold mb-1' style={{backgroundColor:"#f7e1d7"}}>{item.brand}</p>
              <p className='mb-1'>{item.type}</p>
              <p className='mb-1'>{item.size}</p>
              <p className='mb-1'>{matchType(item, displayWishlist)}</p>
              <div className=''>
                <div>
                    <form onSubmit={(e) => addToWishList(e, item)} className='m-0'>
                      <select name="addToList" id="addToList" className="border-0 bg-light"style={{width: "90%"}}>
                        {user.wishlists.map((wishlist) => (
                          wishlist._id === displayWishlist._id ? "" : <option key={wishlist._id} value={wishlist._id} >{wishlist.title}</option>
                          ))}
                      </select>
                      <button type='submit' className='w-100 btn m-0 btn-sm rounded-top-0 ' style={{backgroundColor: "#f7e1d7"}}>Add</button>
                    </form>
                  </div>
                  <div>
                    <button  className='w-100 btn m-0 btn-sm rounded-top-0 mt-1 ' style={{backgroundColor: "#f4acb7"}} onClick={e => removeFromWishlist(e, item)}>remove</button>
                  </div>
              </div>
          </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default UserWishlist