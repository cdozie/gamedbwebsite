import React, { useEffect, useState, useLayoutEffect } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { limittyping } from './mylistfunctions';
import { fetchgeneral, isNumbCheck,dropdownlist } from './generalfuncs';

const preventval = (e) => {
    limittyping(e, e.target.value>100, 100)
    limittyping(e, e.target.value <0, 0)
  };

const AddList = (props) =>{
    // INITIALIZED STATES
    const[gameInput, setGameInput] = useState("")
    const[prVal, setPRVal] = useState("")
    const[hpVal, setHPVal] = useState("")
    const[invalidData,setinvalidData] = useState(true)
    const[STVal, setSTVal] = useState("Plan to Play")
    const[show, setShow] = useState(props.status)
    // CHANGE FUNCTIONS
    
    const onHPChange = (e) => {
        console.log(parseInt(e.target.value))
        if (parseInt(e.target.value) != NaN){
        setHPVal(() => isNumbCheck(e.target.value));
        }
        else{
        setHPVal(() => "");

        };
    }
    
    const onPRChange = (e) => {
        if (e.target.value){
        setPRVal (() => isNumbCheck(e.target.value));
        }
        else{
        setPRVal (() => "");
        };
    }
    const onSTChange = (e) => {
        setSTVal(() => e.target.value);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        $.ajax({
            type:'POST',
            url:'/addlist',
            data:{
              slug: props.slug,
              status: STVal,
              rating:prVal,
              hoursplayed:hpVal
    
            },
            success:function()
            {
              fetchgeneral("gamegetter",props.setgameProps)
            }
          });
          setShow(() => false)
        

    }

    // RENDER FUNCTIONS
    useEffect(() =>{
        setinvalidData(!(STVal))
    }
    )



    // var dropdownlist = ["Plan to Play", "Dropped", "Playing", "On Hold", "Completed", "Wishlist"]
    return(
        <div>
            {show &&
        <div className = "add-list-form" >
        <img className = "add-list-picture" src = {`${props.bgimg}`}></img>

        <h2 id = "add-list-title"> {props.name}</h2>
        
        <Form.Group action ="/addlist" controlId = "add-list-form" className = 'mb-3'>
            {/* <Row>
                <Col>
                    <Form.Control type = "text" className='w-auto mx-auto' onChange = {onGameSearchChange} value ={gameInput} placeholder = "Search Game:" />
                </Col>
            </Row> */}
            <Row className = 'mb-3'>
                <Col>
                <select value = {STVal} name=  {`${props.name}`} autoComplete="off"  className = "form-select form-control mx-auto w-auto center-status"  placeholder = "Choose Status:" required onChange ={onSTChange}> ' + 
                    <option disabled = {true} >Choose Status:</option>
                    { 
                        dropdownlist.map(
                            (option) =>
                            <option  key = {option} id = {option} value = {option} onClick={onSTChange} onChange ={onSTChange}>{option}</option>
                        )
                    }
                </select>
                </Col>
                <Col>
                    <Form.Control   min  = "0" type = "number" className ='w-auto mx-auto' onChange = {(e) => {limittyping(e, e.target.value <0, 0); onHPChange(e)}} value = {hpVal} placeholder = "Hours Played:"/>
                </Col>
            </Row>
        </Form.Group>
        <Form.Group className = 'mb-3'>

            <Row>
                {/* <Col> */}
                    <Form.Control  min = "0" max  = "100" type = "number" className ='w-25 mx-auto' onChange = {(e) => {preventval(e); onPRChange(e)}} value = {prVal} placeholder = "Personal Rating:"/>
                {/* </Col> */}
            </Row>

        </Form.Group>
        <Row>
                <Button variant="primary" className = 'w-auto mx-auto' disabled={invalidData} onClick ={submitHandler}>
                    Add to List
                </Button>
        </Row>
    </div>
}
    </div>
    )
}

export default AddList