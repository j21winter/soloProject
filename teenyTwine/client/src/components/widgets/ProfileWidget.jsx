import React, {useContext} from 'react'
import UserContext from '../../context/userContext'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

const ProfileWidget = () => {
    const { user, setUser, child: globalChild, setChild, displayWishlist, setDisplayWishList } = useContext(UserContext)
    const navigate = useNavigate()
    const deleteChild = (e, childItem) => {
        e.preventDefault()
        // update display child if any
        if(globalChild._id === childItem._id){
            if(user.children.length > 2){
                for( let i = 0; i < user.children.length; i++ ){
                    if(user.children[i]._id != childItem._id){
                        setChild(user.children[i])
                        break
                    }
                }
            } else if(user.children.length <= 1 ){
                setChild({})
                navigate('/user')
            }
        }

        // update display wishlist if any
        if(displayWishlist.child && childItem._id == displayWishlist.child._id){
            setDisplayWishList({})
        }

        axios.delete(`http://localhost:8000/api/child/${childItem._id}/${user._id}`,{data: {child: childItem}, withCredentials: true})
            .then(res => {

                if(res.data.deletedWishlist){

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
    <div className='rounded rounded-2 m-1 w-100 shadow-lg overflow-auto ' style={{maxHeight: "98%", backgroundColor: "#e9edc9"}}>
        <div className='mb-1 m-0 sticky-top'>
            <p className='fs-5 text-start m-0 ps-2 pe-2' style={{color: '#ffffff', backgroundColor: "#26637b"}}>{user.firstName} {user.lastName}</p>
        </div>

        {user.children.length > 0 ? (
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
        </div>) : (<p className='text-center m-1 p-1 border border-dark-subtle shadow rounded-2' style={{backgroundColor: "rgb(192, 214, 223)"}}>Add a child below to get started</p>)}
        </div>
  )
}

export default ProfileWidget