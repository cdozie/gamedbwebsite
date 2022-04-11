import React, { useEffect, useState, useLayoutEffect } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form';
import Table from'react-bootstrap/Table'; 
import DropDownFilter from './sortdropdown';
import FilterForm from './filterform';
import { ListFormat } from 'typescript';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


export default function MyList () {

 
    const[GameDict, setGameDict] = useState({})
    const[GameOptions, setGameOptions] = useState([])

    

    useLayoutEffect(() =>{
      var gamelistdict = []
      fetch('http://127.0.0.1:5000/mylistfeeder',{
        'methods':'GET',
        headers : {
          'Content-Type':'application/json'
        }
      })
    .then(response => (response.json()))
    .then(response => {
      var gr = response
      console.log(gr);
      var vargamedict = {Names: gr.name, BGimgs: gr.backgroundimages, GHP: gr.hoursplayed, GOR: gr.onlinerating, GPR: gr.personalrating, GRD: gr.releasedate,GST: gr.status, GWB: gr.website}
      for(let i = 0; i< (gr.name).length; i++){
        gamelistdict.push({Number: [i],Name: gr.name[i], BGimg: gr.backgroundimages[i], GHP: gr.hoursplayed[i], GOR: gr.onlinerating[i], GPR: gr.personalrating[i], GRD: gr.releasedate[i],GST: gr.status[i], GWB: gr.website[i]})
      }
      console.log(gamelistdict.map(x=> x))
    //  setGameDict(()=> vargamedict)
     setGameOptions(() => gamelistdict)
     console.log(GameOptions)
     console.log("hello")

    })
    .catch(error => console.log(error))} ,[] )

    const isBetween =  (x, min, max) => {
      return x >= min && x<=max
    }


    var mc = {
      '0-59'     : 'red',
      '60-79'    : 'orange',
      '80-99'   : 'green',
      '100-100'     : 'gold'
    }
    const tableclassnames = (val) => {
      var theclass = ""
      $.each(mc,function (numbs,classname){

        var min = parseInt(numbs.split("-")[0],10);
        var max = parseInt(numbs.split("-")[1],10);
        // console.log(classname)
        // console.log(classname)
        var valint = parseInt(val)
      
      if (isBetween(valint,min,max)){
        theclass = classname
      }
  
      }
      )
      return (theclass)


       
    } 


    return(

        <div className='mylistpage'>

            <FilterForm />
            <hr></hr>
            <DropDownFilter />
            <hr></hr> 
            <div className='my-list-table'>
                <Table  bordered hover>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Image</th>
                            <th scope="col">Name</th>
                            <th scope="col">Your Rating</th>
                            <th scope="col">Metacritic Rating</th>
                            <th scope="col">Hours Played</th>
                            <th scope="col">Status</th>
                            <th scope="col">Website</th>
                        </tr> 
                    </thead>

                    <tbody>
                    {

                    GameOptions.map(
                     (game) => 
                    <tr key = {`${game.Name}`}>
                         <th scope = "row">{parseInt(game.Number) + 1} </th>
                        <td><img className ="my-list-images" src = {`${game.BGimg}`}></img></td>
                        <td><a href ={`/game/${game.Name}`}>{game.Name}</a></td>
                        <td data-color = {game.GPR} className = {`tablerating ${tableclassnames(game.GPR)}`}>{game.GPR}</td>
                        <td data-color = {game.GOR} className = {`tablerating ${tableclassnames(game.GOR)}`}>{game.GOR}</td>
                        <td>{game.GHP}</td>
                        <td>{game.GST}</td>
                        <td><a className = "list-table-websites" href = {`${game.GWB}`}>{game.GWB}</a></td>
                      </tr>)
                    }
                    
                    </tbody>
                </Table> 
            </div>

        </div>


    )

}



import React, { useEffect, useState, useLayoutEffect } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form';
import Table from'react-bootstrap/Table'; 
import DropDownFilter from './sortdropdown';
import FilterForm from './filterform';
import { ListFormat } from 'typescript';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


export default function MyList () {

 
    // const[GameDict, setGameDict] = useState({})
    const[GameOptions, setGameOptions] = useState([])
    var gamelistdict = []

    

    useLayoutEffect(() =>{
      console.log("hello")
      fetch('http://127.0.0.1:5000/mylistfeeder',{
        'methods':'GET',
        headers : {
          'Content-Type':'application/json'
        }
      })
    .then(response => (response.json()))
    .then(response => {
      var gr = response
      console.log(gr);
      var vargamedict = {Names: gr.name, BGimgs: gr.backgroundimages, GHP: gr.hoursplayed, GOR: gr.onlinerating, GPR: gr.personalrating, GRD: gr.releasedate,GST: gr.status, GWB: gr.website}
      for(let i = 0; i< (gr.name).length; i++){
        gamelistdict.push({Number: [i],Name: gr.name[i], BGimg: gr.backgroundimages[i], GHP: gr.hoursplayed[i], GOR: gr.onlinerating[i], GPR: gr.personalrating[i], GRD: gr.releasedate[i],GST: gr.status[i], GWB: gr.website[i]})
      }
      console.log(gamelistdict.map(x=> x))
    //  setGameDict(()=> vargamedict)
     setGameOptions(() => gamelistdict)
     console.log(GameOptions)
     console.log("hello")

    })
    .catch(error => console.log(error))} ,[] )

    const isBetween =  (x, min, max) => {
      return x >= min && x<=max
    }


    var mc = {
      '0-59'     : 'red',
      '60-79'    : 'orange',
      '80-99'   : 'green',
      '100-100'     : 'gold'
    }
    const tableclassnames = (val) => {
      var theclass = ""
      $.each(mc,function (numbs,classname){

        var min = parseInt(numbs.split("-")[0],10);
        var max = parseInt(numbs.split("-")[1],10);
        // console.log(classname)
        // console.log(classname)
        var valint = parseInt(val)
      
      if (isBetween(valint,min,max)){
        theclass = classname
      }
  
      }
      )
      return (theclass)


       
    } 


    return(

        <div className='mylistpage'>

            <FilterForm />
            <hr></hr>
            <DropDownFilter />
            <hr></hr> 
            <div className='my-list-table'>
                <Table  bordered hover>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Image</th>
                            <th scope="col">Name</th>
                            <th scope="col">Your Rating</th>
                            <th scope="col">Metacritic Rating</th>
                            <th scope="col">Hours Played</th>
                            <th scope="col">Status</th>
                            <th scope="col">Website</th>
                        </tr> 
                    </thead>

                    <tbody>
                    {

                    GameOptions.map(
                     (game) => 
                    <tr key = {`${game.Name}`}>
                         <th scope = "row">{parseInt(game.Number) + 1} </th>
                        <td><img className ="my-list-images" src = {`${game.BGimg}`}></img></td>
                        <td><a href ={`/game/${game.Name}`}>{game.Name}</a></td>
                        <td data-color = {game.GPR} className = {`tablerating ${tableclassnames(game.GPR)}`}>{game.GPR}</td>
                        <td data-color = {game.GOR} className = {`tablerating ${tableclassnames(game.GOR)}`}>{game.GOR}</td>
                        <td>{game.GHP}</td>
                        <td>{game.GST}</td>
                        <td><a className = "list-table-websites" href = {`${game.GWB}`}>{game.GWB}</a></td>
                      </tr>)
                    }
                    
                    </tbody>
                </Table> 
            </div>

        </div>


    )

}