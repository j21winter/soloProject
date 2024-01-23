import React, {useEffect, useState, useContext} from 'react'
import UserContext from '../context/userContext'
import axios from 'axios'

const QuickSearch = () => {
    const {user,setUser, quickSearchInput, setQuickSearchInput} = useContext(UserContext)
    const [formInput, setFormInput] = useState({height: quickSearchInput.height, weight: quickSearchInput.weight})
    const [matches, setMatches] = useState([])
    const [filterData, setFilterData] = useState({})
    const [filterSelection, setFilterSelection] = useState("")

    // get the search
    useEffect(() => {
        if(quickSearchInput.height != "" && quickSearchInput.weight != ""){
            axios.get(`http://localhost:8000/api/items/${quickSearchInput.height}/${quickSearchInput.weight}`, {withCredentials: true})
                .then(res => {
                setMatches(res.data)
                getFilterData(res.data)
                })
                .catch(err => console.log(err))
        }
    },[quickSearchInput])

    // get filter data
    const getFilterData = data => {

        setFilterData({})
        const filterList = {brands : [], sizes: []}
        data.forEach(item => {
            if(!filterList.hasOwnProperty(item.brand)){
                filterList.brands[item.brand] = item.brand
            }
            if(!filterList.hasOwnProperty(item.size)){
                filterList.sizes[item.size] = item.size
            }
        })
        setFilterData(filterList)
    }

    // HANDLE CHANGE IN THE FORM
    const handleChange = e => {
        e.preventDefault()
        setFormInput(prevInput =>  ({
            ...prevInput,
                [e.target.name] : e.target.value
        }))
        }
    
    // submit new search
    const submitSearch = async (e) => {
        e.preventDefault()
        if(formInput.height != null && formInput.weight != null){
            try{
                const updated = await setQuickSearchInput({...formInput})
            } catch (err){
                console.log(err)
            }
        }
    }

    // calculate matchtype in form
    const matchType = item => {
        let {height, weight} = quickSearchInput
        let {minHeight, maxHeight, minWeight, maxWeight} = item
        if(height >= minHeight && height <= maxHeight && weight >= minWeight && weight <= maxWeight){
            return "100%"
        } else {
            return "50%"
        }
    }

    // Add Item to wishlist
    const addToWishList = (e, item) => {
        e.preventDefault()
        const wishlistId = e.target.elements.addToList.value

        axios.patch(`http://localhost:8000/api/wishlist/add/${wishlistId}/${item._id}`,{}, {withCredentials: true})
            .then(res => {
                setUser(prevUser => ({
                    ...prevUser, 
                        ['wishlists'] : prevUser["wishlists"].map((wishlist) => (
                            wishlist._id === res.data._id ? res.data : wishlist
                ))
            }))
        })
        .catch(err => console.log(err))
    }


  return (
    <div className='h-100 d-flex flex-column align-items-center justify-content-center '>
      {/* HEADER */}

            <div className="left p-2 text-center mb-3">
                <p className='fs-2 m-0' style={{color:"#26637b"}}>Quick Search</p>
            </div>

            {/* Search */}
            <div className="stats rounded rounded-1 mb-3 ">
                <form className='rounded rounded-2 overflow-hidden m-1' style={{backgroundColor: "#e9edc9"}} onSubmit={(e) => submitSearch(e)}>
                <div className='ps-2 pe-2 d-flex justify-content-between '  style={{color: '#26637b', backgroundColor: "#c0d6df"}}>
                    <p className='fs-6  m-0 text-center'>New Search</p>
                </div>
                <div className="d-flex">
                    <div className="input-group input-group-sm m-1 w-50">
                        <label htmlFor="height" className='input-group-text border-0 ' style={{backgroundColor: "#ffffff"}}>Height (in) </label>
                        <input type="number" name='height' value={formInput.height} className="form-control text-end border-0 " onChange={e => handleChange(e)} />
                    </div>
                    <div className="input-group input-group-sm m-1 w-50">
                        <label htmlFor="weight" className='input-group-text border-0 ' style={{backgroundColor: "#ffffff"}}>Weight (lbs) </label>
                        <input type="number" name='weight' value={formInput.weight} className="form-control input-sm text-end border-0 " onChange={e => handleChange(e)} />
                    </div>
                </div>
                <button className="btn btn-sm w-100 rounded-top-0 " style={{backgroundColor: "#84a59d", color: "#ffffff"}} type="submit">search</button>
                </form>
            </div>


        {/* MATCHES TABLE */}
        <div className="matches p-2 rounded rounded-2" style={{width: "95%", backgroundColor: "#eaeaea"}}>
            <p className='fs-3 text-center m-0' style={{color:"#26637b"}}>Matching Garments</p>
            {/* Add filterable options here! */}
            <div className="searchFilters d-flex justify-content-center column-gap-3">
            {/* use an onchange to sort matching list */}
                <form>
                    <label htmlFor="filter">Filter by:</label>
                    <select name="filter" id="filter" onChange={(e) => setFilterSelection(e.target.value)}>
                    {/* POPULATE WITH OPTIONS FROM THE LIST */}
                    <option value="" disabled selected>Filter</option>
                    <option value={""}>All</option>
                    <option value="" className='text-center'disabled>-- Brands --</option>
                    {filterData.brands ? (Object.keys(filterData.brands).map((brandName) => (
                        <option key={brandName} value={brandName}> {brandName} </option>
                    ))) : ("")}
                    <option value="" disabled>-- Sizes --</option>
                    {filterData.sizes ? (Object.keys(filterData.sizes).map((sizeName) => (
                        <option key={sizeName} value={sizeName}> {sizeName} </option>
                    ))) : ("")}
                    </select>
                </form>
            </div>

            {/* Match display */}
            <div className="myTable d-flex justify-content-start overflow-scroll w-100 rounded rounded-2">
            <div className='p-1 text-start col-2' style={{width: "15%", color: '#26637b', backgroundColor: "#c0d6df"}}>
                <p className='mb-1'>Brand</p>
                <p className='mb-1'>Type</p>
                <p className='mb-1'>Size</p>
                <p className='mb-3'>Match</p>
                <p className='mb-1'>Add To...</p>
            </div>
            {filterSelection ? (matches.filter((item) => item["brand"] === filterSelection || item["size"] == filterSelection).map((item) => (
            <div key={item._id} className='text-center ms-1 m-0 p-0 bg-white rounded rounded-3 overflow-auto col-1 '>
                <p className='fw-semibold mb-1' style={{backgroundColor:"#f7e1d7"}}>{item.brand}</p>
                <p className='mb-1'>{item.type}</p>
                <p className='mb-1'>{item.size}</p>
                <p className='mb-1'>{matchType(item)}</p>
                <div>
                    <form onSubmit={(e) => addToWishList(e, item)} className='m-0'>
                        <select name="addToList" id="addToList" className="border-0"style={{width: "90%"}}>
                            {user.wishlists.map((wishlist) => (
                                <option key={wishlist._id} value={wishlist._id} >{wishlist.title}</option>
                            ))}
                        </select>
                        <button type='submit' className='w-100 btn m-0 btn-sm rounded-top-0 ' style={{backgroundColor: "#f7e1d7"}}>Add</button>
                    </form>
                </div>
            </div> 
            ))) : ((matches.map((item) => (
            <div key={item._id} className='text-center ms-1 m-0 p-0 bg-white rounded rounded-3 overflow-auto col-1 '>
                <p className='fw-semibold mb-1' style={{backgroundColor:"#f7e1d7"}}>{item.brand}</p>
                <p className='mb-1'>{item.type}</p>
                <p className='mb-1'>{item.size}</p>
                <p className='mb-1'>{matchType(item)}</p>
                <div className=''>
                    <form onSubmit={(e) => addToWishList(e, item)} className='m-0'>
                        <select name="addToList" id="addToList" className="border-0"style={{width: "90%"}}>
                            {user.wishlists.map((wishlist) => (
                                <option key={wishlist._id} value={wishlist._id} >{wishlist.title}</option>
                            ))}
                        </select>
                        <button type='submit' className='w-100 btn m-0 btn-sm rounded-top-0 ' style={{backgroundColor: "#f7e1d7"}}>Add</button>

                    </form>
                </div>
            </div> 
            ))))}
            {/* {matches.map((item) => (
                <div key={item._id} className='text-center ms-1 m-0 p-0 bg-white rounded rounded-3 overflow-auto col-1 '>
                    <p className='fw-semibold mb-1' style={{backgroundColor:"#f7e1d7"}}>{item.brand}</p>
                    <p className='mb-1'>{item.type}</p>
                    <p className='mb-1'>{item.size}</p>
                    <p className='mb-1'>{matchType(item)}</p>
                <div className=''>
                    <form onSubmit={(e) => addToWishList(e, item)} className='m-0'>
                    <select name="addToList" id="addToList" className="border-0"style={{width: "90%"}}>
                        {user.wishlists.map((wishlist) => (
                        <option key={wishlist._id} value={wishlist._id} >{wishlist.title}</option>
                        ))}
                    </select>
                    <button type='submit' className='w-100 btn m-0 btn-sm rounded-top-0 ' style={{backgroundColor: "#f7e1d7"}}>Add</button>
                    </form>
                </div>
            </div>
            ))} */}
            </div>
        </div>
    </div>
  )
}

export default QuickSearch