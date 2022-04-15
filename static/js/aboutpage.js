import React, { useEffect, useState, useLayoutEffect } from 'react';
import Zoom from 'react-reveal/Zoom';



function AboutDo (props) {

  return(
    <div className = "about-page">
    <h1 className = "about-title gradientcolor">About this Website:</h1>

    {
      props.abtmodule.map(
        (abtmodule) =>
        <div className = "txt-img-pair" key = {abtmodule.Text}>
        <hr></hr>
        <Zoom left>
        <h4 className ="about-text gradientcolorpinkwhite">{abtmodule.Text} </h4>
        </Zoom>
        <Zoom right>
        <img className = "about-rand-imgs" src ={`${abtmodule.Picture}`}></img>
        </Zoom>
        </div>

      )   
    }
    </div>
  )

  }


  export default function About () {
    var abouttext = [`This site was created by Chidozie as a way to delve into Web Development and 
    learn more about JavaScript, CSS, HTML, and SQLite. It also acted as a gateway to get into ReactJS as well. This specifc page was made entirely with React
    as a start to learning how it works`, 
    `This website was my first foray into Web Development and I hope to learn more.
    Especially about React since it is very powerful for creating dynamic UI and this page of the website was my first experience with it before I learned more about it
    and remade this page`,
    `This Website was first made entirely with plain Javascript and CSS on the Front End as a way to learn the fundamentals, then much of it got implemented in react
    as a way to eliminate loading screens and have seamless updating.`,
    `Thank You for taking the time to explore this website and seeing the work put in.
    Your time is appreciated deeply and we hope you enjoy your time on the site and if you are not a gamer, I hope this gets you GAMING.`
    ]
    var txt_pic_dictlst = []
  

    const[gameOptions, setgameOptions] = useState([])
    const[txtpicmodule, settxtPicModule] = useState([])
  
    useEffect(()=> {
      // var pictures = [] 
      var md_dict_list = []
      fetch('http://127.0.0.1:5000/databasefeeder',{
        'methods':'GET',
        headers : {
          'Content-Type':'application/json'
        }
      })
    .then(response => (response.json()))
    .then(response => {
      var gr = response
      console.log(gr)
      for ( let i = 0; i < gr.length; i++){
        md_dict_list.push({Text: abouttext[i], Picture: gr[i]})

       };
     setgameOptions(() => md_dict_list)
     console.log("hello");
    
    })
    .catch(error => console.log(error))},[])


    return(
      <AboutDo abtmodule = {gameOptions} />

    )
  }
