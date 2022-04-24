import React, { useEffect, useState, useLayoutEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { colorclassnames, fetchgeneral } from './generalfuncs';
import AccountBar from './accountbar';
import { Link } from 'react-router-dom';
import { hideLoader } from './generalfuncs';

const DisplayAccountGames = (props) => {

    // const[Counter,setCounter] = useState(0)
    // var counter = 0
    return ( 

        <div className = "accnt-page">
        {props.games.map((game) => 
        <div key  = {`${game.Slug}`} className = "col-lg-3 col-md-3 col-sm-4 col-6"  >   
        <Link to= {`/game/${game.Slug}`}>
            <div className = "account-item">
             <img className = "game-card-images" alt = {`${game.Name} Image`} src ={`${game.BGimg}`}></img> 
             <div className= "container">  
                 <div className = "account-text account-title" >{game.Name}</div>
                 <span  className = {`card-metacritic-rating account-text ${colorclassnames(game.GOR)}`}>Metacritic Rating:</span> 
                     <span  className={`card-metacritic-rating account-mcr ${colorclassnames(game.GOR)}`}> {game.GOR}</span> 
                 <div  className = {`rankings2 accountranks rating-border ${colorclassnames(game.GPR)}`}>{game.GPR}</div>
                     <div className = "status account-text"> Status: {game.GST}</div> 
             </div>     
             </div>
         </Link>
         </div>

        ) 
        }     
     </div>
    )}

const AccountGames = () => {

    const[GameList, setGameList] = useState([])
    var counter = 0

    useEffect(() =>{ 
       fetchgeneral("userlistfeeder",setGameList);
       hideLoader();
    },[])
    var nvar
    var gmlistlen = GameList.length
    return(
        <div className = "account-main-page">
        <DisplayAccountGames games = {GameList}/>  
        </div>
    )
}

export default AccountGames;