import React, { useEffect, useState, useLayoutEffect } from 'react';
import { classnames  } from './mylistfunctions';
import { Routes, Route, useParams, useNavigate, BrowserRouter } from "react-router-dom";
import { Link } from "react-router-dom";


const DisplayRandList = (props) => {
    const[formval,setFormVal] = useState("")
    const submithandler = (e) => {
        setFormVal(() => e.target.id);
        
    }
    const value = () => {
        return props
    }
    return(
        <div>
        {/* {props.randmodules && */}
        <div className='hmpg-rand-list'>
        <h2 id = "Highest-Heading" className = "left-align"> RANDOM GAMES TO TRY</h2> 
        <ul className="hs full"> 
        {
            props.randmodules.map( 
                (randmodule) =>
                <form action="/search" className = "rand-game-list-form" id = {`rand-game-list-form${parseInt(randmodule.Rank) -1}`} method = "post" key = {`${randmodule.Name}`}>
                    <li className = "item"> <button className = "rnd-hmpg-button"><div className = "rand-name-forms item-text form-link" onClick = {submithandler} 
                    id = {`${randmodule.Slug}`}> {randmodule.Rank}. {randmodule.Name} </div></button>
                        <input name = "rand-game-slug" style={{display: "none"}} value={formval} onChange = {value}></input>
                        <img className = "game-image-items" src = {randmodule.BGimg}></img> 
                        
                        <div className = "gradientcolor">Metacritic Rating:</div > 
                            <div data-color ={`${randmodule.GOR}`} className = {`rankings inlinemarker ${classnames (randmodule.GOR)}`}>{randmodule.GOR}</div> 
                    </li> 
                </form>

            )
            
        }
        </ul>
        </div>
{/* } */}
        </div>

    )
}

const DisplayMyList = (props) => {
    
    return (
    <div>
    {/* {props.mylistmodules && */}
    <div className = 'hmpg-my-list'>
    <h2 id="add-list-label" className = "left-align"><a href ="/mylist" id="index-my-list-link">Your Games</a></h2> 
    <hr></hr>
    <ul className = "hs full main-page-game-list">
        {
            props.mylistmodules.map(
            (mylistmodule) => 
                <li className = "item" key = {`${mylistmodule.Name}`}> 
                    {/* <div className = "item-text" ><a href = {`/game/${mylistmodule.Slug}`}>{mylistmodule.Name} </a> </div> */}
                    <div className = "item-text" ><Link to  = {`/game/${mylistmodule.Slug}`}>{mylistmodule.Name}</Link> </div>
                    <img className = "add-list-images" alt = {`${mylistmodule.Name} Image`} src ={mylistmodule.BGimg}></img>          
                    <div className = "item-text">Your Rating:</div> 
                    <div data-color = {`${mylistmodule.GPR}`} className = {`rankings ${classnames(mylistmodule.GPR)}`}>{mylistmodule.GPR}</div>

                    <div className = "status item-text"> {mylistmodule.GST}</div> 
                </li>
            )
        }




    </ul> 
    </div>
{/* } */}
    </div>)
}

const Homepage = () => {

    const[RandList, setRandList] = useState([])
    const[MyList, setMyList] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:5000/gmlistfeeder',{
            'methods':'GET',
            headers : {
              'Content-Type':'application/json'
            }
          })
        .then(response => (response.json()))
        .then(response => {
          var gr = response
          console.log(gr);
         setMyList(() => gr)
        })
        .catch(error => console.log(error)) 
    },[])

    useLayoutEffect(() => {

        fetch('http://127.0.0.1:5000/rndgamefeeder',{
            'methods':'GET',
            headers : {
              'Content-Type':'application/json'
            }
          })
        .then(response => (response.json()))
        .then(response => {
          var gr = response
          console.log(gr);
         setRandList(() => gr)
        })
        .catch(error => console.log(error)) 



    },[]

    )

    return (
        // <BrowserRouter>
            <div>
            {(RandList != [] && MyList !=[]) &&
            <div className = "hmpg">
            <DisplayRandList randmodules = {RandList}/>
            <hr></hr>
            <DisplayMyList mylistmodules = {MyList}/>
            </div>
            } 
            </div>
        )
}

export default Homepage;