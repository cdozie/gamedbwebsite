import React, { useEffect, useState, useLayoutEffect} from "react";

// import { Routes, Route, useParams, useNavigate, BrowserRouter } from "react-router-dom";

import {Link}  from "react-router-dom";

const LinkBar = () => {
    
    return(
    <header>
        <div className="main_menu">
            <div className="row">
                <nav className="header-menu">

                    <Link to="/">Home</Link> 
                    <a href = "/logout">Log Out</a>
                    <Link to = "/mylist">My List</Link>
                    <Link to = "/account"> My Account</Link>
                    <Link to ="/aboutsite">About</Link>
            

                </nav>
            </div>
        </div>
    </header>    
    )
}

export default LinkBar; 