import React, { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import { fetchgeneral, formcentering, showLoader,hideLoader } from './generalfuncs';
const ForgotPassForm = () => {

    const[EmailVal, setEmailVal] = useState("")
    const[OTPVal, setOTPVal] = useState("")
    const[PassVal,setPassVal] = useState("")
    const[ConfirmPassVal,setConfirmPassVal] = useState("")
    const[InvalidData, setInvalidData] = useState(true)
    const[ShowEmail,setShowEmail] = useState(true)
    const [Noti, setNoti] = useState('');
    const[ElementHeight,setElementHeight] = useState(0)
    const ref = useRef(null)
  
    useEffect(() =>{
    if (ShowEmail){
        setInvalidData(() =>!(EmailVal)) 

    }
    else{
      setInvalidData(() =>!(OTPVal && PassVal && ConfirmPassVal))
    };
    setElementHeight(() => ref.current.clientHeight);
    formcentering(ElementHeight)
    // console.log(ElementHeight)

    })
  
    const onEmailChange = (e) => {
      setEmailVal(() => e.target.value)
    }
  
    const onOTPChange = (e) => {
      setOTPVal(() => e.target.value)
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
    //   e.preventDefault()
      $.ajax({
          type:'POST',
          url:'/forgotpassword',
          data:{
            email: EmailVal,
            emailOTP: OTPVal,
            password: PassVal,
            confirmation: ConfirmPassVal
          },
          success:function()
          {
            fetchgeneral("notifeeder", setNoti)
          }
        })  
    }
    const emailhandler = (e) =>{
        e.preventDefault()
        $.ajax({
            type:'POST',
            url:'/forgotpasswordemail',
            data:{
              email: EmailVal,
            },
            success:function()
            {
              fetchgeneral("notifeeder", setNoti)
            }
          });
        

    }

    const resendfunc = () => {
        fetch(`http://127.0.0.1:5000/sendforgotpasswordemail`,{
            'methods':'GET',
            headers : {
              'Content-Type':'application/json'
            }
          })    
    }  
  useEffect(()=>{
    // console.log(Noti.Noti)
    // console.log(Noti.Noti =="Show Form")
    if (Noti.Noti =="Show Form"){
        setShowEmail(() => false);
        resendfunc();
    };
    if (Noti.Noti == "Correct OTP"){
      window.location.href = "/login"  
    }

  },[Noti])
  useEffect(() => {
    hideLoader()
  },[])
  
  return(
<div className="container-fluid form-container" ref ={ref}>
    <p className = "login-title"> FORGOT PASSWORD </p>
  <Form action="/forgotpassword" method="post" >
    <div></div>
    {ShowEmail 
    
    ?(<div><Form.Group className="mb-3" controlId="Email">
      <Form.Label>Email</Form.Label>
      <Form.Control type="email" placeholder="Email:" value = {EmailVal} name = "email" className='w-auto mx-auto' onChange={onEmailChange} autoComplete = "on" />
    </Form.Group>
    <Button  type="submit" disabled={InvalidData} onClick = {emailhandler}>
      Verify 
    </Button></div>)
    :(
    <div>
    <Form.Group className="mb-3" controlId="Forgot-OTP">
      <Form.Label>Username</Form.Label>
      <Form.Control type="text" value = {OTPVal} placeholder="OTP:" name = "OTP" className='w-auto mx-auto' onChange={onOTPChange} autoComplete = "on"/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="Password">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" value = {PassVal} placeholder="Password:" name = "password" className='w-auto mx-auto' onChange={onPassChange} autoComplete = "on"/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="ConfirmPassword">
      <Form.Label>Confirm Password</Form.Label>
      <Form.Control type="password" value = {ConfirmPassVal} placeholder="Confirm Password:" name = "confirmation" className='w-auto mx-auto' onChange={onConfirmPassChange} autoComplete = "on"/>
    </Form.Group>
    <Button  type="submit" disabled={InvalidData} onClick = {submithandler}>
      Change 
    </Button>
    <div className="mb-3">
            <h4>Didn't Get An Email? Click <button onClick = {(e) => {e.preventDefault(); resendfunc()}} className="btn btn-link" id = "resendbutton" type="submit">Here</button>To Resend.</h4>
    </div>
    </div>
)
}
    {(Noti != "" && Noti.Noti != "Show Form") &&
      <div className = {`${Noti.Type}`}> {Noti.Noti} </div> 
    }

  </Form>
</div>
  
    )
  }
  export default ForgotPassForm;
  