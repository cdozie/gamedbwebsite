import React, { useEffect, useState, useLayoutEffect } from 'react';
import { colorclassnames, fetchgeneral } from './generalfuncs';
import { Link } from 'react-router-dom';
import { hideLoader } from './generalfuncs';
const DisplayAccountWishlist = (props) => {

    // const[Counter,setCounter] = useState(0)
    // var counter = 0
    return ( 
    <div> 

    {/* <AccountBar />  */}
        <div className = "accnt-page">
        {props.games.map((game) => 
         <div key  = {`${game.Slug}`} className = "col-lg-3 col-md-3 col-sm-4 col-6" >
            <div className='account-item ' >

             <img className = "game-card-images" alt = {`${game.Name} Image`} src ={`${game.BGimg}`}></img> 
             <div className= "container">  
                 <div className = "account-text account-title" ><Link to= {`/game/${game.Slug}`}>{game.Name} </Link> </div>
                 <span  className = {`card-metacritic-rating account-text`}>Metacritic Rating:</span> 
                     <span  className={`card-metacritic-rating account-mcr ${colorclassnames(game.GOR)}`}> {game.GOR}</span> 
                <div className = {`${game.GWB}`}>  <a href={`${game.GWB}`} className = "wishlist-websites gradientcolor account-text">{game.GWB}</a> </div>
                        <div className = "status account-text"> Release Date: {game.GRD}</div> 
             </div> 
             </div> 
         </div>
        ) 
        }     
     </div>
     </div> 
    )}

const AccountWishlist = () => {

    const[GameList, setGameList] = useState([])
    var counter = 0

    useEffect(() =>{ 
       fetchgeneral("wishlistfeeder",setGameList);
       hideLoader();

    },[])
    var nvar
    var gmlistlen = GameList.length
    return(
        <div className='account-wishlist-page'>
        <DisplayAccountWishlist games = {GameList}/>  
        </div>
    )
}

export default AccountWishlist;