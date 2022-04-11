import React, { useEffect, useState, useLayoutEffect } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form';
import Table from'react-bootstrap/Table'; 
import DropDownFilter from './sortdropdown';
import FilterForm from './filterform';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


export default function MyList () {

  const [invalidData, setinvalidData] = useState(true);

    const maxvalerr = "Minimum Values Cannot Be Greater Than Max Values"

    // const displayerror = (min, max, min2, max2, name, message) => {
    //   var existencebool = (min && max) || (min2 && max2)
    //   var comparebool = (min > max) || (min2>max2)
    //   if (existencebool){
    //     if ((comparebool)   && errorMessages.message != message){
    //       seterrorMessages(() => ({name: name, message : message}))
    //     }  
    //     else if (!(comparebool) && errorMessages.message != ""){
    //       seterrorMessages(() => ({name: name, message : ""}))
    //   }}
    //   else if (!(existencebool) && errorMessages.message != ""){
    //     seterrorMessages(() => ({name: name, message : ""}))

    //   }
    // }
    const[metaminval, setmetaminval] = useState(0);
    const[metamaxval, setmetamaxval] = useState(100);
    const[perminval, setperminval] = useState(0);
    const[permaxval, setpermaxval] = useState(100);


    const[metavalid, setMetaValid] = useState(true);
    const[pervalid, setPerValid] = useState(true);
    const[boolsubmit, setboolsubmit] = useState(true);



    const[errorMessages, seterrorMessages] = useState({})
   
    const rendererrormessages = (name) =>  name ===errorMessages.name && (
      <div className='filtererrors'>{errorMessages.message}</div>
    )

    const limittyping = (e,bool, int) =>{ 
     if ((bool) 
      && e.key !=="Delete" // keycode for delete
      && e.key !== "Backspace" // keycode for backspace
     ) 
     {
        e.preventDefault();
        e.target.value = int
      }
}


const limittypingmax =(e,bool,func) => {
  if ((bool)
  && e.key !=="Delete" // keycode for delete
  && e.key !== "Backspace" // keycode for backspace
 ){
  func(()=> isNumbCheck(e.target.value) )
 }
}

const isNumbCheck  =(val) => {
  if (val == "" ||!(val)){
    return ""
  }
  else {
  var valnumb = parseInt(val)
  if (isNaN(valnumb)){
    return 0
  }
  else{
    return valnumb
  }
}
}

  const preventval = (e) => {
    limittyping(e, e.target.value>100, 100)
    limittyping(e, e.target.value <0, 0)
  }
;


  const updatemax = (e,val, func) => {
    limittypingmax(e,isNumbCheck(e.target.value) > val,func)
  }
  const updatemin = (e, val, func) => {
    limittypingmax(e,isNumbCheck(e.target.value) < val, func)
  }

    const onMetaMinChange = (event) => setmetaminval(() => isNumbCheck(event.target.value));
    const onMetaMaxChange = (event) => setmetamaxval(() => isNumbCheck(event.target.value));
    const onPerMinChange = (event) => setperminval(() => isNumbCheck(event.target.value));
    const onPerMaxChange = (event) => setpermaxval(() => isNumbCheck(event.target.value));

    const[GameOptions, setGameOptions] = useState([])

    const submithandling = (e) => {
      e.preventDefault()
      $.ajax({
        type:'POST',
        url:'/mylistfeeder',
        data:{
          fmetamin : metaminval,
          fmetamax: metamaxval,
          fpermin: perminval,
          fpermax: permaxval,
        },
        success:function()
        {
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
         console.log(GameOptions);
         console.log("hello");
         console.log("rerendering");
    
        })
        .catch(error => console.log(error))
        }
      })
    };

    var gamelistdict = []

    useEffect(() =>{
      setinvalidData(() => !(metaminval || metamaxval || perminval || permaxval));
      // displayerror(metaminval,metamaxval, perminval, permaxval,"metanv", maxvalerr);
  })
    useEffect(() =>{

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
     console.log(GameOptions);
     console.log("hello");
     console.log("rerendering");

    })
    .catch(error => console.log(error))},[])

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
            <Form action="/filterlist" method="post" onSubmit={submithandling} >
   
            <Form.Group className="" controlId="fminsmaxes">
              <Row>
                <Col>
                  <Form.Label>Metacritic Min</Form.Label>
                  <Form.Control type="number" min ="0" max = "100" value = {metaminval} placeholder="Metacritic Min:"  name = "fmetamin" className='w-auto mx-auto' 
                  onChange={e => {preventval(e); updatemax(e,metamaxval,setmetamaxval);  ;onMetaMinChange(e)}  }/>
                </Col>
              
                <Col>
                  <Form.Label>Metacritic Max</Form.Label>
                  <Form.Control type="number" min = "0" max = "100" value = {metamaxval} placeholder="Metacritic Max" name = "fmetamax" className='w-auto mx-auto' 
                  onChange={e => { preventval(e); updatemin(e,metaminval,setmetaminval);  onMetaMaxChange(e);} }/>
                </Col>
              <Col>
                  <Form.Label>Personal Min</Form.Label>
                  <Form.Control type="number" min = "0" max = "100" value = {perminval} placeholder="Personal Min" name = "fpermin" className='w-auto mx-auto' 
                  onChange={e => {preventval(e);updatemax(e,permaxval,setpermaxval);  onPerMinChange(e);}}/>
                </Col>
                <Col>
                  <Form.Label>Personal Max</Form.Label>
                  <Form.Control type="number" min = "0" max = "100" value = {permaxval} placeholder="Personal Max" name = "fpermax" className='w-auto mx-auto' 
                  onChange={e => {preventval(e); updatemin(e,perminval,setperminval);onPerMaxChange(e);}}/>
                </Col>
              </Row>
            </Form.Group>
            {rendererrormessages("metanv")}
            <Button variant="primary" type="submit" disabled={invalidData}>
              Filter
            </Button>
          </Form> 
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




import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
// import DropdownButton from 'react-bootstrap/DropdownButton'
// import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form';
import Table from'react-bootstrap/Table'; 
// import DropDownFilter from './sortdropdown';
// import FilterForm from './filterform';
// import { ListFormat } from 'typescript';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


export default function MyList() {

  const [invalidData, setinvalidData] = useState(true);

    // const maxvalerr = "Minimum Values Cannot Be Greater Than Max Values"
    // const prmaxvalerr = "Personal Min Value Cannot Be Greater Than Max Value"

    // const errmsgbool = (metaminval && metamaxval) || (perminval && permaxval)
    
    // const displayerror = (min, max, min2, max2, name, message) => {
    //   var existencebool = (min && max) || (min2 && max2)
    //   var comparebool = (min > max) || (min2>max2)
    //   if (existencebool){
    //     if ((comparebool)   && errorMessages.message != message){
    //       seterrorMessages(() => ({name: name, message : message}))
    //     }  
    //     else if (!(comparebool) && errorMessages.message != ""){
    //       seterrorMessages(() => ({name: name, message : ""}))
    //   }}
    //   else if (!(existencebool) && errorMessages.message != ""){
    //     seterrorMessages(() => ({name: name, message : ""}))

    //   }
    // }
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []); 
    const[metaminval, setmetaminval] = useState(0);
    const[metamaxval, setmetamaxval] = useState(100);
    const[perminval, setperminval] = useState(0);
    const[permaxval, setpermaxval] = useState(100);


    // const[metavalid, setMetaValid] = useState(true);
    // const[pervalid, setPerValid] = useState(true);
    const[boolsubmit, setboolsubmit] = useState(true);



    // const[errorMessages, seterrorMessages] = useState({})
   
    // const rendererrormessages = (name) =>  name ===errorMessages.name && (
    //   <div className='filtererrors'>{errorMessages.message}</div>
    // )

    const limittyping = (e,bool, int) =>{ 
     if ((bool) 
      && e.key !=="Delete" // keycode for delete
      && e.key !== "Backspace" // keycode for backspace
     ) 
     {
        e.preventDefault();
        e.target.value = int
      }
}


const limittypingmax =(e,bool,func) => {
  if ((bool)
  && e.key !=="Delete" // keycode for delete
  && e.key !== "Backspace" // keycode for backspace
 ){
  func(()=> isNumbCheck(e.target.value) )
 }
}

const isNumbCheck  =(val) => {
  if (val == "" ||!(val)){
    return ""
  }
  else {
  var valnumb = parseInt(val)
  if (isNaN(valnumb)){
    return 0
  }
  else{
    return valnumb
  }
}
}




  const preventval = (e) => {
    limittyping(e, e.target.value>100, 100)
    limittyping(e, e.target.value <0, 0)
  }
;


  const updatemax = (e,val, func) => {
    limittypingmax(e,isNumbCheck(e.target.value) > val,func)
  }
  const updatemin = (e, val, func) => {
    limittypingmax(e,isNumbCheck(e.target.value) < val, func)
  }

    const onMetaMinChange = (event) => setmetaminval(() => isNumbCheck(event.target.value));
    const onMetaMaxChange = (event) => setmetamaxval(() => isNumbCheck(event.target.value));
    const onPerMinChange = (event) => setperminval(() => isNumbCheck(event.target.value));
    const onPerMaxChange = (event) => setpermaxval(() => isNumbCheck(event.target.value));


    const submithandling = (e) => {
      e.preventDefault()
      $.ajax({
        type:'POST',
        url:'/mylistfeeder',
        data:{
          fmetamin : metaminval,
          fmetamax: metamaxval,
          fpermin: perminval,
          fpermax: permaxval,
        },
        success:function()
        {
          console.log("Neegs")
          forceUpdate()
          // setboolsubmit(()=>!(boolsubmit))
          
        }
      })
    };
    // const[GameDict, setGameDict] = useState({})
    const[GameOptions, setGameOptions] = useState([])

    var gamelistdict = []

    useEffect(() =>{
      console.log("hello2")
      setinvalidData(() => !(metaminval || metamaxval || perminval || permaxval));
      // displayerror(metaminval,metamaxval, perminval, permaxval,"metanv", maxvalerr);
      console.log("rerendering2")
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
      // var vargamedict = {Names: gr.name, BGimgs: gr.backgroundimages, GHP: gr.hoursplayed, GOR: gr.onlinerating, GPR: gr.personalrating, GRD: gr.releasedate,GST: gr.status, GWB: gr.website}
      for(let i = 0; i< (gr.name).length; i++){
        gamelistdict.push({Number: [i],Name: gr.name[i], BGimg: gr.backgroundimages[i], GHP: gr.hoursplayed[i], GOR: gr.onlinerating[i], GPR: gr.personalrating[i], GRD: gr.releasedate[i],GST: gr.status[i], GWB: gr.website[i]})
      }
      console.log(gamelistdict.map(x=> x))
    //  setGameDict(()=> vargamedict)
     setGameOptions(() => gamelistdict)
     console.log(GameOptions);
     console.log("hello");
     console.log("rerendering");

    })
    .catch(error => console.log(error))} ,[] )

    // const isBetween =  (x, min, max) => {
    //   return x >= min && x<=max
    // }


    // var mc = {
    //   '0-59'     : 'red',
    //   '60-79'    : 'orange',
    //   '80-99'   : 'green',
    //   '100-100'     : 'gold'
    // }
    // const tableclassnames = (val) => {
    //   var theclass = ""
    //   $.each(mc,function (numbs,classname){

    //     var min = parseInt(numbs.split("-")[0],10);
    //     var max = parseInt(numbs.split("-")[1],10);
    //     // console.log(classname)
    //     // console.log(classname)
    //     var valint = parseInt(val)
      
    //   if (isBetween(valint,min,max)){
    //     theclass = classname
    //   }
  
    //   }
    //   )
    //   return (theclass)


       
    // } 


    return(

        <div className='mylistpage'>
            <Form action="/filterlist" method="post" onSubmit={submithandling} >
   
   <Form.Group className="" controlId="fminsmaxes">
     <Row>
       <Col>
         <Form.Label>Metacritic Min</Form.Label>
         <Form.Control type="number" min ="0" max = "100" value = {metaminval} placeholder="Metacritic Min:"  name = "fmetamin" className='w-auto mx-auto' 
         onChange={e => {preventval(e); updatemax(e,metamaxval,setmetamaxval);  ;onMetaMinChange(e)}  }/>
       </Col>
     
       <Col>
         <Form.Label>Metacritic Max</Form.Label>
         <Form.Control type="number" min = "0" max = "100" value = {metamaxval} placeholder="Metacritic Max" name = "fmetamax" className='w-auto mx-auto' 
         onChange={e => { preventval(e); updatemin(e,metaminval,setmetaminval);  onMetaMaxChange(e);} }/>
       </Col>
     <Col>
         <Form.Label>Personal Min</Form.Label>
         <Form.Control type="number" min = "0" max = "100" value = {perminval} placeholder="Personal Min" name = "fpermin" className='w-auto mx-auto' 
         onChange={e => {preventval(e);updatemax(e,permaxval,setpermaxval);  onPerMinChange(e);}}/>
       </Col>
       <Col>
         <Form.Label>Personal Max</Form.Label>
         <Form.Control type="number" min = "0" max = "100" value = {permaxval} placeholder="Personal Max" name = "fpermax" className='w-auto mx-auto' 
         onChange={e => {preventval(e); updatemin(e,perminval,setperminval);onPerMaxChange(e);}}/>
       </Col>
     </Row>
   </Form.Group>
   {/* {rendererrormessages("metanv")} */}
   <Button variant="primary" type="submit" disabled={invalidData}>
     Filter
   </Button>
 </Form> 
            <hr></hr>
            {/* <DropDownFilter /> */}
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
                        <td data-color = {game.GPR} className = {`tablerating`}>{game.GPR}</td>
                        <td data-color = {game.GOR} className = {`tablerating `}>{game.GOR}</td>
                        <td>{game.GHP}</td>
                        <td>{game.GST}</td>
                        <td><a className = "list-table-websites" href = {`${game.GWB}`}>{game.GWB}</a></td>
                      </tr>)
                    }
                    
                    </tbody>
                </Table> 
            </div>

        </div>


    );

}