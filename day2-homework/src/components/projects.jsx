import React, { Component } from 'react'
import { Container,Table } from 'react-bootstrap'

export class projects extends Component {
    constructor(props) {
        super(props)
        this.state = {
            projs: []
        }
    }
    
    componentDidMount = async()=>{
        console.log(this.props)
        let response = await fetch(`http://127.0.0.1:3001/projects/${this.props.match.params.studentsId}/projects`)
        // console.log(await response.json())
        this.setState({projs : await response.json()})
    }
    render() {
        return (
            <Container>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Repo URL</th>
                        <th>Live URL</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.projs.map(proj =>{
                        return(
                            <tr>
                                <td>{proj.name}</td>
                                <td>{proj.description}</td>
                                <td>{proj.repoUrl}</td>
                                <td>{proj.liveUrl}</td>
                                {/* <td> <Button variant="danger" onClick ={()=>this.delStudent(student.id)}>Delete</Button></td>
                                <td> <Button variant="info" onClick ={() =>this.editStudent(student)}>Edit</Button></td> */}
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </Container>
        )
    }
}

export default projects
