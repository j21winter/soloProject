import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/userContext'

const UserWishlist = () => {
  const {user} = useContext(UserContext)

  const [organizedList, setOrganizedList] = useState({})

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
  }, [])

  return (
    <>
      <div className='d-flex justify-content-between align-content-start'>
        <p className="fs-3">Wishlists</p>
        <div className=''>
          Create a Wishlist
          <form action="" >
            <div className="d-flex ">
              <label htmlFor="title" className='form-label'>Title:</label>
              <input type="text" className='form-control' name="title"/>
            </div>
            <div className="d-flex ">
              <label htmlFor="child" className='form-label'>Child (optional):</label>
              <input type="text" className='form-control' name="child"/>
            </div>
            <button type="submit" className='btn btn-success'>Create List</button>
          </form>
        </div>
      </div>

      <div className="">
        {Object.entries(organizedList).map(([childName, wishlistArr]) => (
          <div>
            <p key={childName}>{childName}</p>
            <ul>
              {wishlistArr.map((wishlist) => (
                <li>
                  <div className='d-flex'>
                    {/* ADD ONCLICK */}
                    <p>{wishlist.title}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}

export default UserWishlist