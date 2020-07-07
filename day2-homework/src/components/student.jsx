import React, { Component } from "react";
import { Container, Col, Row } from "react-bootstrap";

export class student extends Component {
  constructor(props) {
    super(props);

    this.state = {
      studentId: this.props.match.params.id,
      studentInfo: [],
    };
  }
  componentDidMount = async () => {
    let response = await fetch(
      "http://127.0.0.1:3002/students/" + this.state.studentId,
      {
        method: "GET",
      }
    );
    let studentInfo = await response.json();
    this.setState({ studentInfo });
    console.log(studentInfo);
  };
  render() {
    return (
      <Container className="mt-5">
        <Row>
          <Col xs={4}>
            <img src={`https://placehold.it/200x200`} alt="" />
          </Col>
          <Col>
            <p>
              Name: <b>{this.state.studentInfo.name}</b>
            </p>
            <p>
              Surname: <b>{this.state.studentInfo.surname}</b>
            </p>
            <p>
              Email: <b>{this.state.studentInfo.email}</b>
            </p>
            <p>
              Date of Birth: <b>{this.state.studentInfo.dateOfBirth}</b>
            </p>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default student;
