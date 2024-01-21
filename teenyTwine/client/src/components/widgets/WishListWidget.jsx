import React, {useContext} from 'react'
import UserContext from '../../context/userContext'
import {Link} from 'react-router-dom'

const WishListWidget = () => {
    const {user} = useContext(UserContext)

  return (
    <div className='text-center rounded rounded-2 m-1 w-100 overflow-auto shadow-lg ' style={{maxHeight: "98%", backgroundColor: "#e9edc9"}}>
        <div className='mb-1 sticky-top'>
            <p className='fs-5 text-end m-0 ps-2 pe-2' style={{color: '#ffffff', backgroundColor: "#26637b"}}>My Wishlists</p>
        </div>
        <div className='rounded rounded-3 m-0 pe-2 ps-2'>
          {user.wishlists && user.wishlists.map((wishlist) => (
            <div key={wishlist['_id']} className='m-0'>
              <div className='d-flex justify-content-between p-1 mb-1 rounded rounded-1 bg-white'>
                <p className='col-8 fs-6 text-start m-0 ' style={{color: '#84a59d'}}>{wishlist.title}</p>
                <p className='col-4 fs-6 text-end m-0' style={{color: '#84a59d'}}>{wishlist.items.length}</p>
              </div>
            </div>
          ))}
        </div>

          <Link to={'/user/wishlist'} className='btn btn-sm w-100 rounded-top-0 sticky-bottom' style={{backgroundColor: "#84a59d", color: "#ffffff"}}>View & Create Wishlists</Link>

  </div>
  )
}

export default WishListWidget