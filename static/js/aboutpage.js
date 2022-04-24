import React, { useEffect, useState, useLayoutEffect } from 'react';
import Zoom from 'react-reveal/Zoom';
import { hideLoader } from './generalfuncs';



function AboutDo (props) {

  return(
    <div className = "about-page">
    <h1 className = "about-title gradientcolor">About this Website:</h1>
    <div className = "about-main-page">
    {
      props.abtmodule.map(
        (abtmodule) =>
        <div className = "row" key = {abtmodule.Text}>
        {/* <div className = "col-lg-2 col-md-3 col-sm-4 col-6" key = {abtmodule.Text}> */}
        <div className = "txt-img-pair">
        {/* <hr></hr> */}
        <Zoom left>
        <h4 className ="about-text gradientcolorpinkwhite">{abtmodule.Text} </h4>
        </Zoom>
        <Zoom right>
        <img className = "about-rand-imgs inline" src ={`${abtmodule.Picture}`}></img>
        </Zoom>
        </div>
        {/* </div> */}
        </div>

      )   
    }
    </div>
    </div>
  )

  }


  export default function About () {

    const[gameOptions, setgameOptions] = useState([])
  
    useEffect(()=> {
      // var pictures = [] 
      fetch('http://127.0.0.1:5000/databasefeeder',{
        'methods':'GET',
        headers : {
          'Content-Type':'application/json'
        }
      })
    .then(response => (response.json()))
    .then(response => {
      var gr = response
      console.log(gr);
     setgameOptions(() => gr)
     console.log("hello");
    
    })

    .catch(error => console.log(error))},[])

    useEffect(()=>{
      hideLoader();
    },[])
    return(
      <AboutDo abtmodule = {gameOptions} />

    )
  }
