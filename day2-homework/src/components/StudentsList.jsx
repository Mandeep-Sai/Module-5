import React, { Component } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Pagin from "./Pagin";
import Pagination from "react-js-pagination";

export class StudentsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      students: [],
      show: false,
      currentStudent: [],
      activePage: 1,
      studentsPerPage: 1,
      numberOfStudents: "",
    };
  }
  componentDidMount = async () => {
    let defaultResponse = await fetch(`http://127.0.0.1:3002/students`, {
      method: "GET",
      headers: new Headers({ "content-type": "application/json" }),
    });
    let response = await fetch(
      `http://127.0.0.1:3002/students?limit=${this.state.studentsPerPage}`,
      {
        method: "GET",
        headers: new Headers({ "content-type": "application/json" }),
      }
    );
    let parsedJson = await response.json();
    let defaultParsed = await defaultResponse.json();
    this.setState({
      students: parsedJson,
      numberOfStudents: defaultParsed.length,
    });
    //console.log(parsedJson);
  };
  delStudent = async (id) => {
    let response = await fetch("http://127.0.0.1:3002/students/" + id, {
      method: "DELETE",
      headers: new Headers({
        "content-type": "application/json",
      }),
    });
    if (response.ok) {
      alert("Deleted sucessfully");
    } else {
      alert("Error");
    }
  };
  editStudent = async (student) => {
    this.setState({ show: true });
    // student.dateOfBirth = new Date(student.dateOfBirth);
    this.setState({ currentStudent: student });
  };
  closeModal = () => {
    this.setState({ show: false });
  };
  updateStudent = (e) => {
    let currentStudent = this.state.currentStudent;
    let id = e.currentTarget.id;
    currentStudent[id] = e.currentTarget.value;
    this.setState({ currentStudent });
  };
  sendInfo = async () => {
    let response = await fetch(
      "http://127.0.0.1:3002/students/" + this.state.currentStudent._id,
      {
        method: "PUT",
        body: JSON.stringify(this.state.currentStudent),
        headers: new Headers({
          "content-type": "application/json",
        }),
      }
    );
    if (response.ok) {
      this.setState({ show: false });
      alert("Updated sucessfully");
    } else {
      alert("Error");
    }
  };
  async handlePageChange(pageNumber) {
    const offset = pageNumber - 1 * this.state.studentsPerPage;
    this.setState({ activePage: pageNumber });
    let response = await fetch(
      `http://127.0.0.1:3002/students?offset=${offset}&limit=${this.state.studentsPerPage}`,
      {
        method: "GET",
        headers: new Headers({ "content-type": "application/json" }),
      }
    );
    let parsedJson = await response.json();
    this.setState({
      students: parsedJson,
    });
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
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {this.state.students.map((student) => {
              return (
                <tr>
                  <td>{student._id}</td>
                  <td>
                    <Link to={`/student/${student._id}`}>{student.name}</Link>
                  </td>
                  <td>{student.surname}</td>
                  <td>{student.email}</td>
                  <td>{student.dateOfBirth}</td>
                  <td>{student.country}</td>
                  <td>
                    {" "}
                    <Button
                      variant="danger"
                      onClick={() => this.delStudent(student._id)}
                    >
                      Delete
                    </Button>
                  </td>
                  <td>
                    {" "}
                    <Button
                      variant="info"
                      onClick={() => this.editStudent(student)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              );
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
                  <Form.Control
                    value={this.state.currentStudent.name}
                    onChange={this.updateStudent}
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
                    value={this.state.currentStudent.surname}
                    onChange={this.updateStudent}
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
                    value={this.state.currentStudent.email}
                    onChange={this.updateStudent}
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
                    onChange={this.updateStudent}
                    id="dob"
                    type="date"
                    placeholder="Birthday"
                    // value={this.state.currentStudent.dateOfBirth}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Country
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    value={this.state.currentStudent.country}
                    onChange={this.updateStudent}
                    id="country"
                    type="text"
                    placeholder="Country"
                  />
                </Col>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.sendInfo}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Pagination
          activePage={this.state.activePage}
          itemsCountPerPage={1}
          totalItemsCount={this.state.numberOfStudents}
          itemClass="page-item"
          linkClass="page-link"
          // pageRangeDisplayed={5}
          onChange={this.handlePageChange.bind(this)}
        />
      </Container>
    );
  }
}

export default StudentsList;
