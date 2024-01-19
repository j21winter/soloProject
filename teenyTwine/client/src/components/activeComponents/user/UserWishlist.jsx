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
    console.log("USEEFFECT")
    const obj = {other: []}
    console.log(obj)

    user.children.forEach(child => {obj[child.name] = []})

    console.log(obj)

    user.wishlists.forEach(wishlist => {

      if(wishlist.child && wishlist.child.name ){
        let key = wishlist.child.name
        obj[key].push(wishlist)
      } else{ 
        obj.other.push(wishlist)
      }

    })

    setOrganizedList(obj)
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
      .catch(err => console.log(err))
  }

  // calculate matchtype in form
  const matchType = (item, wishlist) => {
    let {height, weight} = wishlist.child
    let {minHeight, maxHeight, minWeight, maxWeight} = item
    if(height >= minHeight && height <= maxHeight && weight >= minWeight && weight <= maxWeight){
      return (<p>100%</p>)
    } else {
      return (<p>50%</p>)
    }
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
      <div className="">
        {Object.entries(organizedList).map(([childName, wishlistArr]) => (
          <div key={childName}>
            <p>{childName}</p>
            <ul>
              {wishlistArr.map((wishlist) => (
                <li key={wishlist._id}>
                  <div className='d-flex'>
                    <p className='text-primary' onClick={() => setDisplayWishList(wishlist)}>{wishlist.title}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
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
                    <button>add to...</button>
                    <button>remove</button>
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