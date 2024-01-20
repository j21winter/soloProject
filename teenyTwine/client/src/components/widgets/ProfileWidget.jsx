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
    <div className='rounded rounded-2 p-2 m-1 w-100 overflow-auto ' style={{maxHeight: "49vh", backgroundColor: "#f5cac3"}}>
        <p className='fs-4 text-center m-0 ' style={{color: '#84a59d'}}>{user.firstName} {user.lastName}</p>

        {user.children.length > 0 && (
        <table className='table table-borderless rounded rounded-3 overflow-hidden' style={{maxHeight: "10vh"}}>
            <thead className='sticky-top'>
                <tr>
                    <th style={{color: '#f28482'}} className='text-center'>Children</th>
                    <th style={{color: '#f28482'}} className='text-center'>Options</th>
                </tr>
            </thead>
            <tbody >
                {user.children.map((child) => (
                    
                    <tr key={child['_id']}>
                        <td className='text-center p-auto' >{child["name"]}</td>
                        <td className='p-1'>
                            <div className='d-flex justify-content-around p-1 rounded rounded-1' style={{backgroundColor: "#f7ede2"}}>
                                {/* Create ONCLICK events */}
                                <Link to={`/user/child/${child._id}`} onClick={() => setChild(child)} className='btn btn-sm me-3' style={{backgroundColor: "#f6bd60", color: "#ffffff"}}>view</Link>
                                <button onClick={(e) => deleteChild(e, child)} className='btn btn-sm' style={{backgroundColor: "#f28482", color: "#ffffff"}}>delete</button>
                            </div>
                        </td>
                    </tr>))}
            </tbody>
        </table>)}
        </div>
  )
}

export default ProfileWidget