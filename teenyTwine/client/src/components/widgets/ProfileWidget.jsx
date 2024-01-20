import React, {useContext} from 'react'
import UserContext from '../../context/userContext'
import {Link} from 'react-router-dom'
import axios from 'axios'

const ProfileWidget = () => {
    const { user, setUser, setChild } = useContext(UserContext)

    const deleteChild = (e, child) => {
        e.preventDefault()
        console.log('DELETING')
        console.log(child)
        axios.delete(`http://localhost:8000/api/child/${child._id}/${user._id}`,{data: {child: child}, withCredentials: true})
            .then(res => {
                console.log(res)
                if(res.deletedWishlist){
                    const {deletedChild, deletedWishlist} = res.data
                    // update user DOM
                    setUser( prevUser => ({
                        ...prevUser, 
                            ["children"] : prevUser.children.filter(someChild => someChild._id !== deletedChild._id), 
                            ["wishlists"] : prevUser.wishlists.filter(someWishlist => someWishlist._id !== deletedWishlist._id)
                    }))
                } else {
                    const {deletedChild} = res.data
                    // update user DOM
                    setUser( prevUser => ({
                        ...prevUser, 
                            ["children"] : prevUser.children.filter(someChild => someChild._id !== deletedChild._id), 
                    }))
                }
            })

            .catch(err => console.log(err))
    }

  return (
    <div>
        <h3>Your Profile</h3>
        <p>{user.firstName} {user.lastName}</p>

        {user.children.length > 0 && (<table>
            <thead>
                <tr>
                <th>Child Name</th>
                <th>Options</th>
                </tr>
            </thead>
            <tbody >
                {user.children.map((child) => (
                    
                    <tr key={child['_id']}>
                        <td>{child["name"]}</td>
                        {console.log(child)}
                        <td>
                        <div className='d-flex'>
                            {/* Create ONCLICK events */}
                            <Link to={`/user/child/${child._id}`} onClick={() => setChild(child)} className='btn btn-secondary'>Profile</Link>
                            <button onClick={(e) => deleteChild(e, child)} className='btn btn-danger' >Delete</button>
                        </div>
                        </td>
                    </tr>))}
            </tbody>
        </table>)}
        </div>
  )
}

export default ProfileWidget