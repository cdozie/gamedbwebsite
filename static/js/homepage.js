import React, { useEffect, useState, useLayoutEffect } from 'react';
// import { classnames  } from './mylistfunctions';
import { Routes, Route, useParams, useNavigate, BrowserRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { showLoader, hideLoader,colorclassnames} from './generalfuncs';
// const loader = document.querySelector('.loader');

// if you want to show the loader when React loads data again

const DisplayRandList = (props) => {
    const[formval,setFormVal] = useState("")
    const submithandler = (e) => {
        setFormVal(() => e.target.id);
        
    }
    const value = () => {
        return props
    }

    hideLoader();

    return(
        <div>
        {/* {props.randmodules && */}
        <div className='hmpg-rand-list'>
            <div className = 'hmpg-list'>
                <div className = "hmpg-headings">
                <h2 className = "left-align hmpg-list-title"> RANDOM GAMES TO TRY</h2> 
                </div>
                <div className="hs full"> 
                {
                    props.randmodules.map( 
                        (randmodule) =>
                        // <form action="/search" className = "rand-game-list-form" id = {`rand-game-list-form${parseInt(randmodule.Rank) -1}`} method = "post" key = {`${randmodule.Name}`}>
                        <div className='col-lg-2 col-md-3 col-sm-4 col-6' key = {`${randmodule.Slug}`}>
                        <Link to = {`/game/${randmodule.Slug}`} >
                            <div className = "item" > 
                                {/* <div className='img-cell'> */}
                                {/* <input name = "rand-game-slug" style={{display: "none"}} value={formval} onChange = {value}></input> */}
                                <img  className = "game-image-items" src = {randmodule.BGimg}></img> 
                                {/* </div> */}
                                <div className = "item-text"
                                id = {`${randmodule.Slug}`}>{randmodule.Name}</div>
                                <div className = "gradientcolor">Metacritic Rating:</div > 
                                    <div  className = {`rankings inlinemarker ${colorclassnames (randmodule.GOR)}`}>{randmodule.GOR}</div> 
                            </div> 
                        </Link>
                        </div>
                    )     
                }
                </div>
            </div>
    {/* } */}
            </div>
        </div>

    )
}

const DisplayMyList = (props) => {
    
    return (
    <div>

    {/* {props.mylistmodules && */}
    <div className = 'hmpg-my-list'>
        <div className = 'hmpg-list'>
            <div className = "hmpg-headings">
                <Link to ="/mylist" id="index-my-list-link">
                <h2 id="game-list-label" className = "left-align inline hmpg-list-title">
                    Your Games</h2> 
                    <h5 className = 'inline view-all-redirect'> View All{'>'}{'>'}{'>'} </h5>
                </Link>
            </div>
        {/* <hr></hr> */}
            <div className = "hs full main-page-game-list">
                {
                    props.mylistmodules.map(
                    (mylistmodule) => 
                    <div className='col-lg-2 col-md-3 col-sm-4 col-6' key = {`${mylistmodule.Name}`}>
                    <Link to  = {`/game/${mylistmodule.Slug}`}>
                        <div className = "item" > 

                            <img className = "game-image-items" alt = {`${mylistmodule.Name} Image`} src ={mylistmodule.BGimg}></img>
                            {/* </div> */}
                            <div className = "item-text" >{mylistmodule.Name} </div>
                
                            <div className = "gradientcolor">Your Rating:</div> 
                            <div className = {`rankings inlinemarker ${colorclassnames(mylistmodule.GPR)}`}>{mylistmodule.GPR}</div>

                            {/* <div className = "status item-text"> {mylistmodule.GST}</div>  */}
                        </div>
                    </Link>
                    </div>
                    )
                }




            </div> 
        </div>
        </div>
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
        .catch(error => console.log(error));
        // hideLoader();
        if (!$('main').hasClass('overflow-auto')){
            $('main').addClass('overflow-auto');
          }
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
        .catch(error => console.log(error)); 
    },[]

    )

    return (           
         <div>
            {/* <LinkBar />
            <SearchBar />
            <hr></hr> */}
            {(RandList != [] && MyList !=[]) &&
            <div className = "hmpg">
            <DisplayRandList randmodules = {RandList}/>
            {/* <hr></hr> */}
            <DisplayMyList mylistmodules = {MyList}/>
            </div>
            } 
            </div>
        )
}

export default Homepage;