import React, { Component } from "react";
import StudentsList from "./StudentsList";
import { Container, Form, Col, Row, Button } from "react-bootstrap";

class sendStudentForm extends Component {
  state = {
    list: [],
    formInfo: {
      name: "",
      surname: "",
      email: "",
      dateOfBirth: "",
      country: "",
    },
  };

  updateForm = (e) => {
    let id = e.currentTarget.id;
    let formInfo = this.state.formInfo;
    formInfo[id] = e.currentTarget.value;
    this.setState({ formInfo });
  };
  sendInfo = async () => {
    let response = await fetch("http://127.0.0.1:3003/pg/students/", {
      method: "POST",
      body: JSON.stringify(this.state.formInfo),
      headers: new Headers({
        "content-type": "application/json",
      }),
    });
    let text = await response;
    console.log(text);
    if (response.ok) {
      alert("Sent sucessfully");
    } else {
      alert("email exists");
    }
  };
  render() {
    return (
      <Container className="form">
        <p className="display-4 text-center mb-0">Student Entry Form</p>
        <Form>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Name
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                onChange={this.updateForm}
                id="name"
                type="text"
                placeholder="Name"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Surname
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                onChange={this.updateForm}
                id="surname"
                type="text"
                placeholder="Surname"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Email
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                onChange={this.updateForm}
                id="email"
                type="email"
                placeholder="Email"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Date of Birth
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                onChange={this.updateForm}
                id="dateOfBirth"
                type="date"
                placeholder="Birthday"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Country
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                onChange={this.updateForm}
                id="country"
                type="text"
                placeholder="Country"
              />
            </Col>
          </Form.Group>
          <Button
            variant="info"
            style={{ display: "block", margin: "auto" }}
            onClick={this.sendInfo}
          >
            Submit
          </Button>
        </Form>

        <StudentsList func={this.sendInfo} list={this.state.list} />
      </Container>
    );
  }
}

export default sendStudentForm;
