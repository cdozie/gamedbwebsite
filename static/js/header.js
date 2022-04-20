import React, { useEffect, useState, useLayoutEffect } from 'react';
import {Link} from 'react-router-dom';
import LinkBar from './linkbar';
import SearchBar from './mainsearchbar';
const Header = () => {
return(
<div>
    <LinkBar />
    <h1> <Link to = "/"> UG Database </Link></h1>            
    <SearchBar />
    <div className = "mb-3"></div>
</div>  
)
}

export default Header;