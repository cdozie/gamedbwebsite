import React, { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import { fetchgeneral,formcentering, showLoader,hideLoader } from './generalfuncs';
// import {Link, useNavigate} from 'react-router-dom'
// import { Navigate } from 'react-router-dom';

const LoginForm = () => {

  const[UserVal, setUserVal] = useState("")
  const[PassVal, setPassVal] = useState("")
  const[InvalidData, setInvalidData] = useState("")
  const [Noti, setNoti] = useState('');
  const[ElementHeight,setElementHeight] = useState(0)
  const ref = useRef(null)


  useEffect(() =>{
    setInvalidData(() => !(UserVal && PassVal));
    setElementHeight(() => ref.current.clientHeight);
    formcentering(ElementHeight);
    if (Noti.Noti == "Logged In"){
      window.location.href= "/"
     } 
  })



  const onUserChange = (e) => {
    setUserVal(() => e.target.value)
  }

  const onPassChange = (e) => {
    setPassVal(() => e.target.value)
  }

  const submithandler = (e) => {
    e.preventDefault()
    $.ajax({
        type:'POST',
        url:'/login',
        data:{
          username: UserVal,
          password: PassVal,
        },
        success:function()
        {
          fetchgeneral("notifeeder", setNoti)
        }
      });
  }
  useEffect(()=>{
    hideLoader();
  },[])
  return(
<div className="container-fluid form-container" ref = {ref}>
    <p className = "login-title"> LOGIN </p>
<Form action="/login" method="post" >
  <Form.Group className="mb-3" controlId="formBasicUsername">
    <Form.Label>Username</Form.Label>
    <Form.Control type="text" placeholder="Username:" value = {UserVal} name = "username" className='w-75 mx-auto' onChange={onUserChange} autoComplete = "on" />
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" value = {PassVal} placeholder="Password" name = "password" className='w-75 mx-auto' onChange={onPassChange} autoComplete = "on"/>
  </Form.Group>
  <Button  type="submit" className = "w-50 mx-auto" disabled={InvalidData} onClick = {submithandler}>
    Login
  </Button>
  {(Noti != "" && Noti.Noti != "Logged In") &&
    <div className = {`${Noti.Type}`}> {Noti.Noti} </div> 
  }
{/* <hr/> */}
<div className="login-alts">
        <h4><a href="/register" className="login-altops">New around here? Register</a> </h4>
        <h4><a href="/forgotpassword" className="login-altops">Forgot password?</a></h4>
  </div>
{/* <hr/> */}
</Form>
</div>
  )
}
export default LoginForm;
