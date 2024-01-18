import React, {useContext} from 'react'
import UserContext from '../../context/userContext'

const WishListWidget = () => {
    const {user} = useContext(UserContext)
    console.log(user)
  return (
    <div>
        <p>My WishLists</p>
        <table className='table'>
        <thead>
            <tr>
            <th>Title</th>
            <th>Child</th>
            <th># Items</th>
            </tr>
        </thead>
        <tbody>
          {user.wishlists && user.wishlists.map((wishlist) => (
              <tr key={wishlist._id}>
              <td>{wishlist.title}</td>
              <td>{wishlist.child.name}</td>
              <td>{wishlist.items.length}</td>
              </tr>
          ))}
        </tbody>
        </table>
  </div>
  )
}

export default WishListWidget