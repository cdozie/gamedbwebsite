import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import { fetchgeneral } from './generalfuncs';

const ChangePassForm = () => {

  const[OldPassVal, setOldPassVal] = useState("")
  const[NewPassVal, setNewPassVal] = useState("")
  const[ConfirmPassVal,setConfirmPassVal] = useState("")
  const[InvalidData, setInvalidData] = useState("")
  const [Noti, setNoti] = useState('');

  useEffect(() =>{
    setInvalidData(() => !(OldPassVal && NewPassVal && ConfirmPassVal)) 
  })

  const onOldPassChange = (e) => {
    setOldPassVal(() => e.target.value)
  }

  const onNewPassChange = (e) => {
    setNewPassVal(() => e.target.value)
  }

  const onConfirmPassChange = (e) => {
      setConfirmPassVal(() => e.target.value)
  }
  const submithandler = (e) => {
    e.preventDefault()
    $.ajax({
        type:'POST',
        url:'/account/changepassword',
        data:{
          password: OldPassVal,
          newpassword: NewPassVal,
          confirmation: ConfirmPassVal
        },
        success:function()
        {
          fetchgeneral("notifeeder", setNoti)
        }
      })  
  }


return(
<Form action="/account/changepassword" method="post" >
  <Form.Group className="mb-3" controlId="OldPassword">
    <Form.Label>Username</Form.Label>
    <Form.Control type="text" placeholder="Old Password:" value = {OldPassVal} name = "password" className='w-auto mx-auto' onChange={onOldPassChange} autoComplete = "on" />
  </Form.Group>
  <Form.Group className="mb-3" controlId="NewPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" value = {NewPassVal} placeholder="New Password:" name = "newpassword" className='w-auto mx-auto' onChange={onNewPassChange} autoComplete = "on"/>
  </Form.Group>
  <Form.Group className="mb-3" controlId="ConfirmPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" value = {ConfirmPassVal} placeholder="Confirm Password" name = "confirmation" className='w-auto mx-auto' onChange={onConfirmPassChange} autoComplete = "on"/>
  </Form.Group>
  <Button  type="submit" disabled={InvalidData} onClick = {submithandler}>
    Change 
  </Button>
  {(Noti != "") &&
    <div className = {`${Noti.Type}`}> {Noti.Noti} </div> 
  }
</Form>

  )
}
export default ChangePassForm;
