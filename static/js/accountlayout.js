import React, { useEffect, useState, useLayoutEffect } from 'react';
import Header from './header';
import AccountBar from './accountbar';
const AccountLayout = (props) => {

    return(
        <div className = "full-page">
        <div className='header-items'>
        <Header/>
        </div>
        <AccountBar /> 
        {props.child}
        </div>

    )
}

export default AccountLayout;