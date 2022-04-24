import React, { useEffect, useState, useLayoutEffect} from "react";

// import { Routes, Route, useParams, useNavigate, BrowserRouter } from "react-router-dom";

import {Link}  from "react-router-dom";

const NotLoggedLinkBar = () => {
    
    return(
    <header>
        <div className="main_menu">
            <div className="row">
                <nav className="header-menu">

                    <Link to="/register">Register</Link> 
                    <Link to = "/login">My List</Link>


                </nav>
            </div>
        </div>
    </header>    
    )
}

export default NotLoggedLinkBar; 