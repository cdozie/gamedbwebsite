import React, { useState, useEffect,useRef } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import { fetchgeneral,formcentering,hideLoader } from './generalfuncs';
const RegisterForm = () => {

    const[EmailVal, setEmailVal] = useState("")
    const[UserVal, setUserVal] = useState("")
    const[PassVal,setPassVal] = useState("")
    const[ConfirmPassVal,setConfirmPassVal] = useState("")
    const[InvalidData, setInvalidData] = useState(true)
    const [Noti, setNoti] = useState('');
    const[ElementHeight,setElementHeight] = useState(0)
    const ref = useRef(null)
  
    useEffect(() =>{
      setInvalidData(() => !(EmailVal && UserVal && PassVal && ConfirmPassVal)) 
      setElementHeight(() => ref.current.clientHeight);
      formcentering(ElementHeight)

    })
  
    const onEmailChange = (e) => {
      setEmailVal(() => e.target.value)
    }
  
    const onUserChange = (e) => {
      setUserVal(() => e.target.value)
    }
    const onPassChange = (e) => {
        setPassVal(()=> e.target.value)
    }
    const onConfirmPassChange = (e) => {
        setConfirmPassVal(() => e.target.value);
        if (e.target.value != PassVal){
            setNoti({Type: "error", Noti : "Confirmation Must Match Original"})
        }
        else{
            setNoti("")

        }   
    }
    const submithandler = (e) => {
      e.preventDefault()
      $.ajax({
          type:'POST',
          url:'/register',
          data:{
            email: EmailVal,
            username: UserVal,
            password: PassVal,
            confirmation: ConfirmPassVal
          },
          success:function()
          {
            fetchgeneral("notifeeder", setNoti)
          }
        })  
    }
    useEffect(()=> {
        if(Noti.Noti == "Verify Registration"){
            window.location.href = "/verify"}
    },[Noti])
    useEffect(()=> {
      hideLoader()
  },[])
  
  return(
<div className="container-fluid form-container" ref = {ref}>
    <p className = "login-title"> REGISTER </p>
  <Form action="/register" method="post" >
    <Form.Group className="mb-3" controlId="Email">
      <Form.Label>Email</Form.Label>
      <Form.Control type="text" placeholder="Email:" value = {EmailVal} name = "Email" className='w-auto mx-auto' onChange={onEmailChange} autoComplete = "on" />
    </Form.Group>
    <Form.Group className="mb-3" controlId="Username">
      <Form.Label>Username</Form.Label>
      <Form.Control type="text" value = {UserVal} placeholder="Username:" name = "username" className='w-auto mx-auto' onChange={onUserChange} autoComplete = "on"/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="Password">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" value = {PassVal} placeholder="Password:" name = "confirmation" className='w-auto mx-auto' onChange={onPassChange} autoComplete = "on"/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="ConfirmPassword">
      <Form.Label>Confirm Password</Form.Label>
      <Form.Control type="password" value = {ConfirmPassVal} placeholder="Confirm Password:" name = "confirmation" className='w-auto mx-auto' onChange={onConfirmPassChange} autoComplete = "on"/>
    </Form.Group>
    <Button  type="submit" disabled={InvalidData} onClick = {submithandler}>
      Register 
    </Button>
    {(Noti != "") &&
      <div className = {`${Noti.Type}`}> {Noti.Noti} </div> 
    }
  <div className="login-alts">
        <h4><a href="/login" className="login-altops">Back To Login</a> </h4>
        {/* <h4><a href="/forgotpassword" className="login-altops">Forgot password?</a></h4> */}
  </div>
  </Form>
  </div>
  
    )
  }
  export default RegisterForm;
  