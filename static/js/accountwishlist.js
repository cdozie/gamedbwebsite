import React, { useEffect, useState, useLayoutEffect } from 'react';
import { classnames, fetchgeneral } from './generalfuncs';
import { Link } from 'react-router-dom';

const DisplayAccountWishlist = (props) => {

    // const[Counter,setCounter] = useState(0)
    // var counter = 0
    return ( 
    <div> 

    {/* <AccountBar />  */}
        <span className = "Game-Rows">
        {props.games.map((game) => 
         <span key  = {`${game.Slug}`} className = "game-card" >   
             <img className = "game-card-images" alt = {`${game.Name} Image`} src ={`${game.BGimg}`}></img> 
             <div className= "container">  
                 <div className = "account-text" ><Link to = {`/game/${game.Slug}`}>{game.Name} </Link> </div>
                 <div  className = {`card-metacritic-rating account-text ${classnames(game.GOR)}`}>Metacritic Rating: 
                     <div  className={`card-metacritic-rating account-mcr ${classnames(game.GOR)}`}>{game.GOR}</div> 
                </div> 
                <div className = {`${game.GWB}`}>  <a href={`${game.GWB}`} className = "wishlist-websites gradientcolor account-text">{game.GWB}</a> </div>
                        <div className = "status account-text"> Release Date: {game.GRD}</div> 
             </div>     
         </span>
        ) 
        }     
     </span>
     </div> 
    )}

const AccountWishlist = () => {

    const[GameList, setGameList] = useState([])
    var counter = 0

    useEffect(() =>{ 
       fetchgeneral("wishlistfeeder",setGameList)
    },[])
    var nvar
    var gmlistlen = GameList.length
    return(
        <div>
        <DisplayAccountWishlist games = {GameList}/>  
        </div>
    )
}

export default AccountWishlist;