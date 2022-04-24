import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Routes, Route, useParams, useNavigate, BrowserRouter, Link } from "react-router-dom";
import { colorclassnames } from './vargamefuncs';
import { fetchgeneral,dropdownlist, limittyping, showLoader, hideLoader } from './generalfuncs';
import OutsideClickHandler from 'react-outside-click-handler';
import AddList from './addlist';
import Form from 'react-bootstrap/Form';
import classNames from 'classnames';



const GamePage = (props) => {

    // FOR DETERMINING WHETHER TO DISPLAY THE EDIT OR NOT
    const[GNameHP, setGNameHP] = useState(false)
    const[GNamePR, setGNamePR] = useState(false) 
    const[GNameST, setGNameST] = useState(false)
    const[HPVal, setHPVal] = useState("")
    const[PRVal, setPRVal] = useState("")
    const[STVal, setSTVal] = useState ("")
    
    let params = useParams()
    console.log(params)
    const [gameProps, setgameProps] = useState({})
    const [showAddList,setshowAddList] = useState(false)
    const [ErrorNoti,setErrorNoti] = useState({})

    const removeListHandler = (e) =>{
        e.preventDefault()
        showLoader();

        $.ajax({
            type:'POST',
            url:"/removelist",
            data:{
            deletedgame : e.target.getAttribute('slug')
            },
            success:function(){
                $.ajax({
                    type:'POST',
                    url:`/game/${e.target.getAttribute('slug')}`,
                    data:{
                    slug : e.target.getAttribute('slug')
                    },
                    success:function(){
                        fetchgeneral("gamegetter",setgameProps)
                        hideLoader();
 
                    }

                });
             }

          }); 

    }
    const addListHandler = (e) =>{
        e.preventDefault();
        setshowAddList(true);
        $('html').css("overflow-y","hidden")

    }
    useEffect(()=> {
    $.ajax({
        type:'POST',
        url:`/game/${params.game}`,
        data:{
        slug : params.game
        },
        success:function()
        {           
          hideLoader();

            fetchgeneral("gamegetter",setgameProps);
            if (!gameProps.RD || gameProps.RD ==""){
              gameProps.RD = "None"
            }

        }
      });
    },[])


    
  
    
  //Editing Form--------------------------------------------------------------------------------------------------------------
  const preventval = (e) => {
    limittyping(e, e.target.value>100, 100)
    limittyping(e, e.target.value <0, 0)
  };
  const setGNameStats = (status,pr,hp) =>{
    setGNameST(() => status )
    setGNamePR(() => pr)
    setGNameHP(() => hp)
  }

  const onHPClick = (e)  =>{
    setGNameStats(false,false,true)
    setHPVal(() =>gameProps.HP)
    ;
    // console.log(gname)

  }

  const onGPRClick = (e)  =>{
    setGNameStats(false,true,false)
    setPRVal(() => gameProps.PR)  
  }

  const onStatusClick = (e) =>{
    setGNameStats(true,false,false)
    setSTVal(() => gameProps.ST)
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
        gamename: gameProps.Name

      },
      success:function()
      {
        fetchgeneral("gamegetter",setgameProps)
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
        gamename: gameProps.Name

      },
      success:function()
      {
        fetchgeneral("gamegetter",setgameProps)
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
        gamename: gameProps.Name

      },
      success:function()
      {
        fetchgeneral("gamegetter",setgameProps)
      }
    });
  }

    return(
        <div className={`${classNames({ 'var-game-page': true, 'hide-overflow' : showAddList, })}`}>
        <div className ={`${classNames({'disable-bg-page': showAddList, })}`}></div>

        <div className = {`${params.game}-page`}>

            <div>
            { gameProps.Name &&
            <div className="container-fluid var-page-container" >
            
            <div className = "var-page-heading"> 
                <h2 className = "var-game-title gradientcolor"> <a href = {`${gameProps.GWB}`} > {gameProps.Name} </a></h2>
                <div className = "var-online-rating">
                <span className = "vargamelabels gradientcolor "> Metacritic Rating: </span>
                <div data-color ={`${gameProps.MCR}`} className = {`vargamerankings var-online-rating-data ${colorclassnames(gameProps.MCR)}`}>{gameProps.MCR}</div>
                </div>
                <h6 data-color ={`${gameProps.MCR}`} className = {`onlinerankdescription ${colorclassnames(gameProps.MCR)}`}> {gameProps.MCRWORD}</h6>  
                

            </div> 
            <hr></hr>
            <form action = "/editgamepage" id = "var-edit-form"  method = "post">
            <div className = "var-page-main"> 
                
                        <img className = "var-game-image" src = {`${gameProps.BGimg}`}></img>
                        <div className = "var-user-analytics">
                            <h6 className = "var-personal-rating analytic"> Your Rating : 
                            {(GNamePR && gameProps.DisplayRemove =="Yes")
                            ?(
                            <OutsideClickHandler onOutsideClick={() => {setGNamePR(()=> "");}}>
                            {/* <Form action = "/mylistfeeder" > */}
                              <Form.Control type = "number" min = "0" max = "100" value = {PRVal} placeholder = "Personal Rating"  className='w-auto mx-auto' onChange = {e => {preventval(e); onPRChange(e); }}/>
                           {/* </Form> */}
                           </OutsideClickHandler>)
                            :(<div onClick = {(e) => {setGNamePR(true); onGPRClick(e)}} data-color = {`${gameProps.PR}`} className = {`var-personal-rating-data varpersonalrankings var-rating-border ${colorclassnames(gameProps.PR)}`}>{gameProps.PR}</div>) 
                            }
                            </h6>

                            <h6 className = "var-status analytic"> Game Status:
                            {(GNameST && gameProps.DisplayRemove =="Yes")
                            ?(
                            <OutsideClickHandler onOutsideClick={() => {setGNameST(() => false)}}>
                                <select value = {STVal} name=  {`${props.name}`} autoComplete="off"  className = "form-select form-control mx-auto w-auto center-status"  placeholder = "Choose Status:" required onChange ={onSTChange}> ' + 
                                    <option disabled = {true} >Choose Status:</option>
                                    { 
                                        dropdownlist.map(
                                            (option) =>
                                            <option  key = {option} id = {option} value = {option} onClick={onSTChange} onChange ={onSTChange}>{option}</option>
                                        )
                                    }
                                </select>
                            </OutsideClickHandler>)
                            :(<div onClick = {onStatusClick} className = "var-status-data gradientcolorpinkwhite "> {gameProps.ST}</div>)
                                }
                            </h6>
                            <h6 className = "var-release-date analytic"> Game Release Date:
                            <div className= "gradientcolorpinkwhite">{gameProps.RD}</div>
                            </h6>
                            <h6 className = "var-hours-played analytic"> Game Hours Played:

                            {(GNameHP &&  gameProps.DisplayRemove =="Yes")
                            ?(
                            <OutsideClickHandler onOutsideClick={() => {setGNameHP(()=> false);}}>
                            {/* <Form > */}
                              <Form.Control type = "number" min = "0"  value = {HPVal} placeholder="Hours Played" className='w-auto mx-auto' onChange = {e => {limittyping(e, e.target.value <0, 0); onHoursChange(e)}}/>
                            {/* </Form> */}
                            </OutsideClickHandler>)

                            :(<div onClick = {(e) => onHPClick(e)} className = "var-hours-played-data gradientcolorpinkwhite"> {gameProps.HP}</div>)
                        }</h6>

                        </div>
                        <h6 className = "var-platforms gradientcolorpinkwhite" > Platforms: {gameProps.PLT}</h6>

                    <button type = "button"  className = "btn btn-warning var-edit-button var-buttons" style = {{display : "none"}}> Submit Changes </button>  
                    
                    {/* Link To Add List Module To Be Reactified */}
                    {
                    gameProps.DisplayAdd =="Yes" &&
                    <button type="button" className="btn var-add-button var-buttons" onClick = {addListHandler} slug = {`${gameProps.Slug}`} >Add to List</button>
                    }

                    {
                        showAddList &&
                    <OutsideClickHandler onOutsideClick={() => {setshowAddList(() => false); $('html').css("overflow-y","auto")}}>
                        <AddList slug = {gameProps.Slug} status = {true} name = {gameProps.Name} setgameProps = {setgameProps} bgimg ={gameProps.BGimg} setshowAddList = {setshowAddList} setErrorNoti = {setErrorNoti} />
                    </OutsideClickHandler>
                    }
            </div>
            </form>
                    {gameProps.DisplayRemove =="Yes" &&
                    <button type = "submit" onClick = {removeListHandler} className="btn btn-danger var-remove-button var-buttons" slug = {`${gameProps.Slug}`} style = {{display : `${gameProps.DisplayRemove}`}}>Remove from List</button>
                    }
            {ErrorNoti != {} && 
            <div className = {`${ErrorNoti.Type}`}>{ErrorNoti.Noti}</div>
            }
                    {/* </form> */}
            
        </div>
        
        }</div>
        </div>
        </div>
    )
}

export default GamePage