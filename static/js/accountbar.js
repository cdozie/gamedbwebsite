import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchgeneral } from './generalfuncs';
const AccountBarDisplay = (props) => {

    return(
     <div className = "account-row">
        <div className="profile-content">
            <div className ="profile-head">
                <div className = "profile-head_name-wrapper">
                    <h3 className ="profile-name">
                        @{props.profile.Username}
                    </h3>
                <div className = "profile-avatar">
                    {props.profile.IconChars}
                </div>
                </div>

            </div>
     </div>
    <div className = "profile-row">
    <Link to="/account">Games</Link>
    <Link className="cpbutton" to= "/account/changepassword">Change Password</Link>
    <Link to= "/account/details">Details</Link>
    <Link to = "/account/wishlist">Wish List</Link>
    </div>
    </div>

    ) 
}

const AccountBar = () => {
    const[ProfileData, setProfileData] = useState([])
    useLayoutEffect(() => {
        fetchgeneral("/profilefeeder",setProfileData )
    },[])

    return(
        <AccountBarDisplay profile = {ProfileData}/>

    )
}

export default AccountBar;