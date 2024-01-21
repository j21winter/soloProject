import React, {useContext} from 'react'
import UserContext from '../../context/userContext'
import {Link} from 'react-router-dom'
import axios from 'axios'

const ProfileWidget = () => {
    const { user, setUser, setChild } = useContext(UserContext)

    const deleteChild = (e, child) => {
        e.preventDefault()
        axios.delete(`http://localhost:8000/api/child/${child._id}/${user._id}`,{data: {child: child}, withCredentials: true})
            .then(res => {
                console.log(res)
                if(res.data.deletedWishlist){
                    console.log("deleting both from dom")
                    const {deletedChild, deletedWishlist} = res.data
                    // update user DOM
                    setUser( prevUser => ({
                        ...prevUser, 
                            ["children"] : prevUser.children.filter(someChild => someChild._id !== deletedChild._id), 
                            ["wishlists"] : prevUser.wishlists.filter(someWishlist => someWishlist._id !== deletedWishlist._id)
                    }))
                } else {
                    const {deletedChild} = res.data
                    console.log("deleting child from dom")
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
    <div className='rounded rounded-2 m-1 w-100 shadow-lg overflow-auto' style={{maxHeight: "98%", backgroundColor: "#e9edc9"}}>
        <div className='mb-1 m-0 sticky-top'>
            <p className='fs-5 text-start m-0 ps-2 pe-2' style={{color: '#ffffff', backgroundColor: "#26637b"}}>{user.firstName} {user.lastName}</p>
        </div>

        {user.children.length > 0 && (
        <div className='rounded rounded-3 m-0 overflow-auto'>
                {user.children.map((child) => (
                    <div key={child['_id']} className='d-flex justify-content-between mb-1 ps-1 pe-1'>
                        <div className='d-flex justify-content-around p-1 ms-1 rounded rounded-1'>
                            {child["name"]}
                        </div>
                        <div className='d-flex column-gap-1'>
                            {/* Create ONCLICK events */}
                            <Link to={`/user/child/${child._id}`} onClick={() => setChild(child)} className='btn btn-sm' style={{backgroundColor: "#84a59d", color: "#ffffff"}}>view</Link>
                            <button onClick={(e) => deleteChild(e, child)} className='btn btn-sm' style={{backgroundColor: "#ffffff", color: "#84a59d"}}>delete</button>
                        </div>
                    </div>))}
        </div>)}
        </div>
  )
}

export default ProfileWidget