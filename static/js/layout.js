import React, { useEffect, useState, useLayoutEffect } from 'react';
import Header from './header';
import { Link } from 'react-router-dom';

const Layout = (props) => {

    return(

        <div className = "full-page">
        {props.Logged 
        ?(
            <div className='header-items'>
            <Header/>
            </div>)
        :( 
        <div className = 'header-items'>
            <div id = "notloggedbar">
            <header>
                <div className="main_menu">
                    <div className="row">
                        <nav className="header-menu">
        
                            <a href="/register">Register</a> 
                            <a href = "/login">Login</a>
        
        
                        </nav>
                    </div>
                </div>
            </header>
            
            <h1> <a href = "/login"> UG Database </a></h1>  

            </div>          
        </div>
        )
        }
        {props.child} 

        </div>

    )
}

export default Layout;