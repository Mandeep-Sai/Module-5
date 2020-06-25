import React, { Component } from 'react'
import { Container, Col,Row } from 'react-bootstrap'

export class student extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             studentId : this.props.match.params.id,
             studentInfo :[]
        }
    }
    componentDidMount = async()=>{
        let response = await fetch('http://127.0.0.1:3001/students/'+this.state.studentId,{
            method:'GET'
        })
        let studentInfo = await response.json()
        this.setState({studentInfo})
        console.log(studentInfo)
    }
    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        {/* <img src={`file:///http://127.0.0.1:3000/day2-homework/public/img/students/3qhn439fwkburb6qw.png`} alt=""/> */}
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default student
