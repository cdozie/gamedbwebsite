import React, { useEffect, useState, useLayoutEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { classnames, fetchgeneral } from './generalfuncs';
import AccountBar from './accountbar';
import { Link } from 'react-router-dom';

const DisplayAccountGames = (props) => {

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
                 <div className = "account-text" ><Link to= {`/game/${game.Slug}`}>{game.Name} </Link> </div>
                 <span  className = {`card-metacritic-rating account-text ${classnames(game.GOR)}`}>Metacritic Rating:</span> 
                     <span  className={`card-metacritic-rating account-mcr ${classnames(game.GOR)}`}>{game.GOR}</span> 
                 <div  className = {`rankings2 accountranks rating-border ${classnames(game.GPR)}`}>{game.GPR}</div>
                     <div className = "status account-text"> Status: {game.GST}</div> 
             </div>     
         </span>
        ) 
        }     
     </span>
     </div> 
    )}

const AccountGames = () => {

    const[GameList, setGameList] = useState([])
    var counter = 0

    useEffect(() =>{ 
       fetchgeneral("userlistfeeder",setGameList)
    },[])
    var nvar
    var gmlistlen = GameList.length
    return(
        <div>
        <DisplayAccountGames games = {GameList}/>  
        </div>
    )
}

export default AccountGames;