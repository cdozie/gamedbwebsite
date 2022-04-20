import React, { useEffect, useState, useLayoutEffect } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form';
import Table from'react-bootstrap/Table'; 
import DropDownFilter from './sortdropdown';
// import FilterForm from './filterform';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { limittyping, limittypingmax, isNumbCheck, listfetch, tableclassnames, listfetchdictlist  } from './mylistfunctions';
import OutsideClickHandler from 'react-outside-click-handler';

var gnamehp = ""
var gnamest = ""
var gnamepr = ""

var notfirstload = false

export default function MyList () {
// Add Check Box for Filtering Out Unrated Ones




    const maxvalerr = "Minimum Values Cannot Be Greater Than Max Values"

    // Filter Form Hooks-------------------------------------------------------------------------------------------------------------------------
    const [invalidData, setinvalidData] = useState(true);
    const[metaminval, setmetaminval] = useState(0);
    const[metamaxval, setmetamaxval] = useState(100);
    const[perminval, setperminval] = useState(0);
    const[permaxval, setpermaxval] = useState(100);
    
    // Dropdown Menu Hooks------------------------------------------------------------------------------------------------------------------------
    const[formValue, setFormValue] = useState("")

    // Table Data Hooks--------------------------------------------------------------------------------------------------------------------------
    const[GameOptions, setGameOptions] = useState([]);


    const[HPVal, setHPVal] = useState("")
    const[PRVal, setPRVal] = useState("")
    const[STVal, setSTVal] = useState ("")
    

    const[GNameHP, setGNameHP] = useState("")
    const[GNamePR, setGNamePR] = useState("") 
    const[GNameST, setGNameST] = useState("")
    
    const preventval = (e) => {
      limittyping(e, e.target.value>100, 100)
      limittyping(e, e.target.value <0, 0)
    };
  //Editing Form--------------------------------------------------------------------------------------------------------------
  const setGNameStats = (status,pr,hp) =>{
    setGNameST(() => status )
    setGNamePR(() => pr)
    setGNameHP(() => hp)
  }
  const onStatusClick = (e) =>{
      setGNameStats(e.target.id,"","")
      setSTVal(() => e.target.textContent)
    }
    const onHPClick = (e)  =>{
      setGNameStats("","",e.target.id)
      setHPVal(() => e.target.textContent)
      ;
      // console.log(gname)

    }

    const onGPRClick = (e)  =>{
      setGNameStats("",e.target.id,"")
      setPRVal(() => e.target.textContent)  
    }

    const onHoursChange = (e) => {
      console.log(parseInt(e.target.value))
      if (parseInt(e.target.value) != NaN){
      setHPVal(() => e.target.value);
      }
      else{
        setHPVal(() => "Nope");

      }
      $.ajax({
        type:'POST',
        url:'/mylistfeeder',
        data:{
          hoursplayed: e.target.value,
          gamename: e.target.getAttribute('name')

        },
        success:function()
        {
          listfetch(setGameOptions)
        }
      });
    }
    const onPRChange = (e) => {
      if (e.target.value){
        setPRVal (() => e.target.value);
      }
      else{
        setPRVal (() => "");
      }
      $.ajax({
        type:'POST',
        url:'/mylistfeeder',
        data:{
          personalrating: e.target.value,
          gamename: e.target.getAttribute('name')
        },
        success:function()
        {
          listfetch(setGameOptions)
        }
      });
    }

    const onSTChange = (e) => {
      setSTVal(() => e.target.value);
      $.ajax({
        type:'POST',
        url:'/mylistfeeder',
        data:{
          status: e.target.value,
          gamename: e.target.getAttribute('name')

        },
        success:function()
        {
          listfetch(setGameOptions)
        }
      });
    }


    function EditStatus(props){
      if ((GNameST == `${props.Name}`)){
        return (
        <td id = "editST">
      {/* <Form action = "/mylistfeeder" controlId = "select"> */}
      <OutsideClickHandler onOutsideClick={() => {setGNameST(() => "")}}>
      <select value = {STVal} name=  {`${props.Name}`} autoComplete="off"  className = "form-select form-control mx-auto w-100 game-form"  placeholder = "Choose Status:" required onChange ={onSTChange}> ' + 
            <option disabled = {true} defaultValue value>Choose Status:</option>
            <option  id = {`${props.Name}`} value = "Plan to Play" onClick={onSTChange} onChange ={onSTChange}>Plan to Play</option>
            <option id = {`${props.Name}`} value = "Dropped" onClick={onSTChange} onChange ={onSTChange}>Dropped</option>
            <option id = {`${props.Name}`} value = "Playing" onClick={onSTChange} onChange ={onSTChange}>Playing</option>
            <option  id ={`${props.Name}`} value = "On Hold" onClick={onSTChange} onChange ={onSTChange}>On Hold</option>
            <option id = {`${props.Name}`} value = "Completed" onClick={onSTChange} onChange ={onSTChange}>Completed</option>
            <option  id = {`${props.Name}`} value = "Wishlist" onClick={onSTChange} onChange ={onSTChange}>Wishlist</option>
        </select>
        </OutsideClickHandler>
        {/* <Form.Control name = "gamename" value = {props.Name} style = {{display : "none"}}/> */}
        {/* </Form> */}
        </td>
        )
      }
      else {
        return(
        <td value = {props.GST} id = {`${props.Name}`} className = "table-status" onClick = {onStatusClick}>{props.GST}</td>
        )
      }
    }



    // Filter Form Functions---------------------------------------------------------------------------------------------------------------------


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

  //Dropdown Functions-----------------------------------------------------------------------------------------------------------------
    const UpdateFormValue = (e) => {
      setFormValue(() => (e.target.value).trim());
    }
    var dropdownlist =[]

    var dropdict = { Text : ["Metacritic Ascending", "Metacritic Descending", "Personal Ascending", "Personal Descending", "No Sort/Time Added", "Hours Played Descending", "Hours Played Ascending"],
    Value: ["MCA", "MCD", "PRA", "PRD", "NS/TA", "HPD", "HPA"]}

    for (let i = 0; i < (dropdict.Text).length;i++){
      dropdownlist.push({Text : (dropdict.Text[i]), Value: (dropdict.Value[i])})
    }

  // Submit Handlers-------------------------------------------------------------------------------------------------------------------
    const filtersubmithandler = (e) => {
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
          listfetch(setGameOptions)
        }
      })
    };

    const ddownsubmithandler = (e) => {
      e.preventDefault();
      $.ajax({
        type:'POST',
        url:'/mylistfeeder',
        data:{
          sorttype : e.target.value,

        },
        success:function()
        {
          listfetchdictlist(setGameOptions)
        }
      })
    }
    ;
  //Table Data Function-------------------------------------------------------------------------------------------

    // Effect Hooks-----------------------------------------------------------------------------------------------
    useEffect(() =>{
      setinvalidData(() => !(metaminval || metamaxval || perminval || permaxval));
      // displayerror(metaminval,metamaxval, perminval, permaxval,"metanv", maxvalerr,seterrorMessages);
  })
    useEffect(() =>{
      listfetch(setGameOptions)},[])


    return(

        <div className='mylistpage'>
          {/* FILTER FORM */}
            <Form action="/filterlist" method="post" onSubmit={filtersubmithandler} >
              <Form.Group className="" controlId="fminsmaxes">
                <Row>
                  <Col>
                    <Form.Label>Metacritic Min</Form.Label>
                    <Form.Control type="number" min ="0" max = "100" value = {metaminval} placeholder="Metacritic Min:"  name = "fmetamin" className='w-auto mx-auto' 
                    onChange={e => {preventval(e); updatemax(e,metamaxval,setmetamaxval); onMetaMinChange(e)}  }/>
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
              <Button variant="primary" type="submit" disabled={invalidData}>
                Filter
              </Button>
          </Form> 
            <hr></hr>
            {/* DROPDOWN MENU */}
            <Form action="/sortlist" method="post"  >
            {/* onSubmit = {ddownsubmithandler} */}
              <Form.Group className="" controlId="sort-dropdown-list">
                <DropdownButton id="dropdown-variants-Info" menuVariant = "dark" variant = "info" title="Order By">
                  {
                    dropdownlist.map((button) => 
                  <Dropdown.Item key = {`${button.Text} Button`}as = "button" className = "sortitem" value ={`${button.Value}`} onClick = { e => {UpdateFormValue(e); ddownsubmithandler(e)}}>{button.Text}</Dropdown.Item>
                  )}
                  <Form.Control name = "sort-type" value ={formValue} style = {{ display: "none"}} onChange= {UpdateFormValue} />
                </DropdownButton>
              </Form.Group>
              
          </Form>            
            <hr></hr> 
            {/* DATA TABLE */}
            <div className='my-list-table my-list'>
                <Table  bordered>
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
                        <td value = {game.Name}><a href ={`/game/${game.Slug}`}>{game.Name}</a></td>
                        
                        {GNamePR == `${game.Name}` 
                        ?(
                        <td id = "editPR">
                          <OutsideClickHandler onOutsideClick={() => {setGNamePR(()=> "");}}>
                          <Form action = "/mylistfeeder" >
                            <Form.Control type = "number" min = "0" max = "100" value = {PRVal} placeholder = "Personal Rating" name = {game.Name} className='w-auto mx-auto' onChange = {e => {preventval(e); onPRChange(e); }}/>
                         </Form>
                         </OutsideClickHandler>
 
                        </td>
                        )
                        :(<td  value = {game.GPR} onClick = {onGPRClick}  id = {`${game.Name}`} className = {`tablerating ${tableclassnames(game.GPR)} table-personal-rating`}>{game.GPR}</td>
                        )
                    }
                      {/* {GNamePR !== `${game.Name}` &&
                        <td data-color = {game.GPR} value = {game.GPR} onClick = {onGPRClick}  id = {`${game.Name}`} className = {`tablerating ${tableclassnames(game.GPR)} table-personal-rating`}>{game.GPR}</td>
                    } */}
                        <td  className = {`tablerating ${tableclassnames(game.GOR)}`}>{game.GOR}</td>
                        {/* <EditHoursPlayed GHP = {game.GHP} Name = {game.Name}/> */}
                          {GNameHP == `${game.Name}` 
                          ?(
                          <td id = "editHP">
                            <OutsideClickHandler onOutsideClick={() => {setGNameHP(()=> "");}}>
                            <Form >
                              <Form.Control type = "number" min = "0"  value = {HPVal} placeholder="Hours Played"  name = {game.Name} className='w-auto mx-auto' onChange = {e => {limittyping(e, e.target.value <0, 0); onHoursChange(e)}}/>
                            </Form>
                            </OutsideClickHandler>
                          </td>)
                          :(<td value = {game.GHP}  id = {`${game.Name}`} onClick = {onHPClick} className ="table-hours-played">{game.GHP}</td>    
                          )
                        }
                          {/* {GNameHP !== `${game.Name}` &&
                            <td value = {game.GHP}  id = {`${game.Name}`} onClick = {onHPClick} className ="table-hours-played">{game.GHP}</td>    
                            } */}
      
                        <EditStatus GST = {game.GST} Name = {game.Name}/> 
                        <td><a className = "list-table-websites" href = {`${game.GWB}`}>{game.GWB}</a></td>
                      </tr>
                      )
                    }   
                    </tbody>
                </Table> 
            </div>
        </div>
    )
}