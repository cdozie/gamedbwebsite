import React, { useEffect, useState } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import { listfetch } from './mylistfunctions';


export default function DropDownFilter() {


  const[formValue, setFormValue] = useState("")


  const UpdateFormValue = (e) => {
    setFormValue(() => (e.target.textContent).trim());
  }
  
const ddownsubmithandler = (e) => {
  e.preventDefault();
  $.ajax({
    type:'POST',
    url:'/mylistfeeder',
    data:{
      "sort-type" : formValue,
    },
    success:function()
    {
      listfetch(setGameOptions)
    }
  })
};

return(
  <Form action="/sortlist" method="post" onSubmit = {ddownsubmithandler} >
   
    <Form.Group className="" controlId="sort-dropdown-list">

      <DropdownButton id="dropdown-variants-Info" menuVariant = "dark" variant = "info" title="Order By">
        <Dropdown.Item as = "button" className = "sortitem" onClick = {UpdateFormValue}>Metacritic Ascending</Dropdown.Item>
        <Dropdown.Item as = "button" className = "sortitem" onClick = {UpdateFormValue}>Metacritic Descending</Dropdown.Item>
        <Dropdown.Item as = "button" className = "sortitem" onClick = {UpdateFormValue}>Personal Ascending</Dropdown.Item>
        <Dropdown.Item as = "button" className = "sortitem" onClick = {UpdateFormValue}>Personal Descending</Dropdown.Item>
        <Dropdown.Item as = "button" className = "sortitem" onClick = {UpdateFormValue}>Normal/Time Added</Dropdown.Item>
        <Form.Control name = "sort-type" value ={formValue} style = {{ display: "none"}} onChange= {UpdateFormValue} />
      </DropdownButton>
    </Form.Group>
  </Form>

    )

}
