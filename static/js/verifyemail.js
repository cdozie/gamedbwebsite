import React, { useState, useEffect,useRef } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import { fetchgeneral, formcentering,hideLoader  } from './generalfuncs';
const VerifyForm = () => {

    const[OTPVal, setOTPVal] = useState("")
    const[InvalidData, setInvalidData] = useState(true)
    const [Noti, setNoti] = useState('');
    const[ElementHeight,setElementHeight] = useState(0)
    const ref = useRef(null)

    useEffect(() =>{
      setInvalidData(() => !(OTPVal)) 
      setElementHeight(() => ref.current.clientHeight);
      formcentering(ElementHeight)

    })
  
    const onOTPChange = (e) => {
      setOTPVal(() => e.target.value)
    }
  
    const submithandler = (e) => {
    e.preventDefault()
      $.ajax({
          type:'POST',
          url:'/verify',
          data:{
            OTP: OTPVal,
          },
          success:function()
          {
            fetchgeneral("notifeeder", setNoti)
          }
        })  
    }
    const resendfunc = (e) => {
        fetch(`http://127.0.0.1:5000/verify`,{
            'methods':'GET',
            headers : {
              'Content-Type':'application/json'
            }
          })    
    }  
  useEffect(()=>{
      if(Noti.Noti == "Email Confirmed"){
          window.location.href = "/login"
      }
  },[Noti]
  )
  useEffect(()=>{
  hideLoader()
},[]
)
  return(
<div id = "verify-page">
    <div className="container-fluid form-container" ref = {ref}>
    <p className = "login-title"> VERIFY </p>
    <Form action="/verify" method="post" >
        <Form.Group className="mb-3" controlId="Register-OTP">
        <Form.Label>Email</Form.Label>
        <Form.Control type="text" placeholder="OTP:" value = {OTPVal} name = "OTP" className='w-auto mx-auto' onChange={onOTPChange} autoComplete = "on" />
        </Form.Group>
        <Button  type="submit" disabled={InvalidData} onClick = {submithandler} >
        Register 
        </Button>
        {(Noti != "") &&
        <div className = {`${Noti.Type}`}> {Noti.Noti} </div> 
        }
    </Form>
        <div className="mb-3">
                <h4>Didn't Get An Email? Click <button onClick = {resendfunc} class="btn btn-link" id = "resendbutton" type="submit">Here</button>To Resend.</h4>
        </div>
    </div>
</div>

    )
  }
  export default VerifyForm;
  