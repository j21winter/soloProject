import React, { useContext } from 'react'
import UserContext from '../context/userContext'

const UserWishlist = () => {
  const {user} = useContext(UserContext)

  return (
    <>Wishlist</>
  )
}

export default UserWishlist