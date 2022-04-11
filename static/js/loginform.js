import React from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';

// onSubmit={handleSubmit}
export default class LoginForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {invalidData: true, username : "", password: ""};
        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);

    }
        
        // handleChange(e,f) {
        //     this.setState({username: e.target.value,password: f.target.value })
        //   }

        UNSAFE_componentWillUpdate(nextProps, nextState) {
            nextState.invalidData = !(nextState.username && nextState.password);
          }  
        
          onUsernameChange(event) {
            this.setState({ username: event.target.value });
          }
          
          onPasswordChange(event) {
            this.setState({ password: event.target.value });
          }
    render(){
        return(
<Form action="/login" method="post" >
  <Form.Group className="mb-3" controlId="formBasicUsername">
    <Form.Label>Username</Form.Label>
    <Form.Control type="text" placeholder="Username:" value = {this.state.username} name = "username" className='w-auto mx-auto' onChange={this.onUsernameChange} />
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" value = {this.state.password} placeholder="Password" name = "password" className='w-auto mx-auto' onChange={this.onPasswordChange}/>
  </Form.Group>
  <Button variant="primary" type="submit" disabled={this.state.invalidData}>
    Login
  </Button>
</Form>
        );
    }
}

// export default LoginForm;
