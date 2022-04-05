import React from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

class DropdownOption extends React.Component {
    render(){
        return(
  <DropdownButton id="dropdown-basic-button" title="Order By">
  <Dropdown.Item href="#/action-1">Ascending by Metacritic</Dropdown.Item>
  <Dropdown.Item href="#/action-2">Ascending by Personal Rating</Dropdown.Item>
  <Dropdown.Item href="#/action-3">Descending by Metacritic</Dropdown.Item>
  <Dropdown.Item href="#/action-4">Descending by Personal Rating</Dropdown.Item>

</DropdownButton>);
}}

export default DropdownOption;
