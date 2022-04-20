import React, { useEffect, useState, useLayoutEffect } from 'react';
import Header from './header';
import AccountBar from './accountbar';
const AccountLayout = (props) => {

    return(
        <div className = "full-page">
        <Header/>
        <AccountBar /> 
        {props.child}
        </div>

    )
}

export default AccountLayout;