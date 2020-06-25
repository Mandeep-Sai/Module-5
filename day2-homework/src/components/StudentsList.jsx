import React, { Component } from 'react'
import { Container,Table,Button,Modal,Form,Row,Col} from 'react-bootstrap'
import {Link} from 'react-router-dom'

export class StudentsList extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             show : false,
             currentStudent : []
        }
    }
    delStudent = async(id)=>{
        let response = await fetch('http://127.0.0.1:3001/students/'+id,{
            method :'DELETE',
            headers : new Headers({
              "content-type": 'application/json'
            })
          })
          if(response.ok){
            alert('Deleted sucessfully')
          }else {
            alert('Error')
          }
    }
    editStudent = async(student)=>{
        this.setState({show : true})
        this.setState({currentStudent : student})
    }
    closeModal =()=>{
        this.setState({show : false})
    }
    updateStudent = (e)=>{
        let currentStudent = this.state.currentStudent
        let id = e.currentTarget.id
        currentStudent[id] = e.currentTarget.value
        this.setState({currentStudent})
    }
    render() {
        return (
            <Container>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Email</th>
                        <th>Birthday</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.props.list.map(student =>{
                        return(
                            <tr>
                                <td>{student.id}</td>
                                <td><Link to={ `/student/${student.id}`}>{student.name}</Link></td>
                                <td>{student.surname}</td>
                                <td>{student.email}</td>
                                <td>{student.dob}</td>
                                <td> <Button variant="danger" onClick ={()=>this.delStudent(student.id)}>Delete</Button></td>
                                <td> <Button variant="info" onClick ={() =>this.editStudent(student)}>Edit</Button></td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>

                <Modal show={this.state.show} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                    <Modal.Title>Edit Student Info</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Name
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control value={this.state.currentStudent.name} onChange={this.updateStudent} id='name' type="text" placeholder="Name" />
                        </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Surname
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control value={this.state.currentStudent.surname}  onChange={this.updateStudent} id='surname' type="text" placeholder="Surname" />
                        </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Email
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control value={this.state.currentStudent.email}  onChange={this.updateStudent} id='email' type="email" placeholder="Email" />
                        </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Date of Birth
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control  onChange={this.updateStudent} id='dob' type="date" placeholder="Birthday" />
                        </Col>
                        </Form.Group>
                        <Button variant="info" onClick ={this.sendInfo}>Submit</Button>
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary" onClick={this.props.sendInfo}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </Modal>
                
            </Container>
        )
    }
}

export default StudentsList
