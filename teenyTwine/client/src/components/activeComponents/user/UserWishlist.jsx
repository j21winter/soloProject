import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../../context/userContext'
import axios from 'axios'

const UserWishlist = () => {
  const {user, setUser} = useContext(UserContext)
  const [organizedList, setOrganizedList] = useState({})
  const [wishlistFormInput, setWishlistFormInput] = useState({
    title: "",
    child: null,
    parent: user._id
  })
  const [formErrors, setFormErrors] = useState({
    title: "",
  })
  const [displayWishlist, setDisplayWishList] = useState({})

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

    // if(displayWishlist){
    //   setDisplayWishList(()  => {
    //     for(let i = 0; i < user.wishlists.length; i++){
    //       if(user.wishlists[i]._id === displayWishlist._id){
    //         return user.wishlists[i]
    //       }
    //     }
    //   })
    // }
  }, [user.wishlists])



  // on Change handler
  const formChangeHandler = (e) => {
    e.preventDefault()
    setWishlistFormInput(prevInput => ({
      ...prevInput, 
        [e.target.name] : e.target.value

    }))
  }


  // create wishlist
  const submitWishlist = (e) => {
    e.preventDefault()
    const newWishlist = {...wishlistFormInput}
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
      console.log(updatedWishlist)
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
        console.log(res)})
      .catch(err => console.log(err))
  }

  return (
    <>
    {/* Header */}
      <div className='d-flex justify-content-between align-content-start'>
        <p className="fs-3">Wishlists</p>
        <div className=''>
          Create a Wishlist
          <form onSubmit={(e) => submitWishlist(e)} >

            <div className="d-flex ">
              <label htmlFor="title" className='form-label'>Title:</label>
              <input type="text" className='form-control' value={wishlistFormInput.title} onChange={(e) => formChangeHandler(e)} name="title"/>
              {formErrors.title ? <p>{formErrors.title}</p> : ""}
            </div>

            <div className="d-flex ">
              <label htmlFor="child" className='form-label'>Child (optional):</label>
              <select name="child" id="childSelect" className='form-select' onChange={(e) => formChangeHandler(e)} >
                <option value="null" >none</option>
                {user.children.map((child) => (
                  <option key={child._id} value={child.name}>{child.name}</option>
                ))}
              </select>
            </div>

            <button type="submit" className='btn btn-success'>Create List</button>
          </form>
        </div>
      </div>

    {/* Categorized wishlists */}
      <div className="d-flex justify-content-between text-start ">
        <div className="left w-50">
          {Object.entries(organizedList).filter(([childName, wishlistArr]) => childName != "other").map(([childName, wishlistArr]) => (
            <div key={childName}>
              <p>{childName}</p>
              <ul>
                {wishlistArr.map((wishlist) => (
                  <li key={wishlist._id}>
                    <div className='d-flex justify-content-between w-50'>
                      <p className='text' >{wishlist.title}</p>
                      <button className='btn btn-info ' onClick={() => setDisplayWishList(wishlist)}>View</button>
                      <button className='btn btn-danger' onClick={(e) => deleteWishlist(e, wishlist)}>delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="right w-50 text-start">
          {Object.entries(organizedList).filter(([childName, wishlistArr]) => childName === "other").map(([childName, wishlistArr]) => (
              <div key={childName}>
                <p>{childName}</p>
                <ul>
                  {wishlistArr.map((wishlist) => (
                    <li key={wishlist._id}>
                      <div className='d-flex justify-content-between w-50'>
                        <p className='text-primary' >{wishlist.title}</p>
                        <button className='btn btn-info ' onClick={() => setDisplayWishList(wishlist)}>View</button>
                        <button className='btn btn-danger' onClick={(e) => deleteWishlist(e, wishlist)}>delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
      
      {/* display wishlist table */}
      <div>
        {displayWishlist.title ? <p>{displayWishlist.title }</p> : <p>select wishlist</p>}
        <table className="table">
          <thead>
            <tr>
              <th>Brand</th>
              <th>Type</th>
              <th>Match</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!displayWishlist.items ? "" : displayWishlist.items.map((item) => (
              <tr key={item._id}>
                <td>{item.brand}</td>
                <td>{item.type}</td>
                <td>{matchType(item, displayWishlist)}</td>
                <td>
                  <div>
                  <div>
                    <form onSubmit={(e) => addToWishList(e, item)}>
                      <button type='submit'>Add to...</button>
                      <select name="addToList" id="addToList" >
                        {user.wishlists.map((wishlist) => (
                          wishlist._id === displayWishlist._id ? "" : <option key={wishlist._id} value={wishlist._id} >{wishlist.title}</option>
                        ))}
                      </select>
                    </form>
                  </div>
                    <button onClick={e => removeFromWishlist(e, item)}>remove</button>
                    <button>own/claim</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default UserWishlist