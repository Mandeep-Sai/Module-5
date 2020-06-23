import React from 'react';
import logo from './logo.svg';
import {Container,Form,Col,Row,Button} from 'react-bootstrap'
import './App.css';
import StudentsList from './StudentsList'

import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component{
  state = {
    list :[],
    formInfo :{
      name:'',
      surname:'',
      email :'',
      dob:''
    }
  }
  componentDidMount = async()=>{
    let response = await fetch('http://127.0.0.1:3001/students',{
      method :'GET',
      headers: new Headers({'content-type': 'application/json'})
    })
    let parsedJson = await response.json()
    this.setState({list : parsedJson})
    console.log(parsedJson)
  }
  updateForm =(e)=>{
    let id = e.currentTarget.id
    let formInfo = this.state.formInfo
    formInfo[id] = e.currentTarget.value
    this.setState({formInfo})
  }
  sendInfo = async()=>{
    let response = await fetch('http://127.0.0.1:3001/students',{
      method :'POST',
      body : JSON.stringify(this.state.formInfo),
      headers : new Headers({
        "content-type": 'application/json'
      })
    })
    if(response.ok){
      alert('Sent sucessfully')
    }else {
      alert('Error')
    }
  }
  render(){
  return (
    <Container className='form'>
    <Form>
        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            Name
          </Form.Label>
          <Col sm={10}>
            <Form.Control onChange={this.updateForm} id='name' type="text" placeholder="Name" />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            Surname
          </Form.Label>
          <Col sm={10}>
            <Form.Control  onChange={this.updateForm} id='surname' type="text" placeholder="Surname" />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            Email
          </Form.Label>
          <Col sm={10}>
            <Form.Control  onChange={this.updateForm} id='email' type="email" placeholder="Email" />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            Date of Birth
          </Form.Label>
          <Col sm={10}>
            <Form.Control onChange={this.updateForm} id='dob' type="date" placeholder="Birthday" />
          </Col>
        </Form.Group>
        <Button variant="info" onClick ={this.sendInfo}>Submit</Button>
    </Form>

    <StudentsList func={this.sendInfo} list = {this.state.list}/>
    </Container>
  );
}
}

export default App;
