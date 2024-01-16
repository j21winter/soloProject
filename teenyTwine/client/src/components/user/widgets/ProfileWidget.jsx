import React, {useContext} from 'react'
import UserContext from '../../context/userContext'
import {Link} from 'react-router-dom'
import axios from 'axios'

const ProfileWidget = () => {
    const { user, setUser } = useContext(UserContext)

    const deleteChild = (e, id) => {
        e.preventDefault()
        console.log('DELETING')
        console.log(id)
        axios.delete(`http://localhost:8000/api/child/${id}/${user._id}`,{withCredentials: true})
            .then(res => {
                console.log(res)
                // update user DOM
                setUser( prevUser => ({
                    ...prevUser, 
                        ["children"] : prevUser.children.filter(child => child._id !== id)
                }))
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
                {user.children.map((child, index) => (
                    
                    <tr key={child['_id']}>
                        <td>{child["name"]}</td>
                        {console.log(child)}
                        <td>
                        <div className='d-flex'>
                            {/* Create ONCLICK events */}
                            <Link to={`/user/child/${child._id}`} state={{ child : child}} className='btn btn-secondary'>Profile</Link>
                            <button onClick={(e) => deleteChild(e, child._id)} className='btn btn-danger' >Delete</button>
                        </div>
                        </td>
                    </tr>))}
            </tbody>
        </table>)}
        </div>
  )
}

export default ProfileWidget