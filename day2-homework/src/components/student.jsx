import React, { Component } from "react";
import { Container, Col, Row, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
export class student extends Component {
  constructor(props) {
    super(props);

    this.state = {
      studentId: this.props.match.params.id,
      studentInfo: [],
      projects: [],
    };
  }
  componentDidMount = async () => {
    let response = await fetch(
      "http://127.0.0.1:3003/pg/students/" + this.state.studentId,
      {
        method: "GET",
      }
    );
    let projectsResponse = await fetch(
      "http://127.0.0.1:3003/pg/projects/" + this.state.studentId
    );
    let projects = await projectsResponse.json();
    let parsedJson = await response.json();
    let studentInfo = parsedJson[0];
    console.log(projects);
    this.setState({ studentInfo, projects });
    // this.setState({ studentInfo, projects: studentInfo.projects });
  };
  delProject = async (id) => {
    let response = await fetch("http://127.0.0.1:3003/pg/projects/" + id, {
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
              Date of Birth: <b>{this.state.studentInfo.dob}</b>
            </p>
          </Col>
        </Row>
        <Row className="mt-5">
          <p className="display-4 text-center">Projects</p>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Creation Date</th>
                <th>Repo URL</th>
              </tr>
            </thead>
            <tbody>
              {this.state.projects.map((project) => {
                return (
                  <tr>
                    <td>{project.name}</td>
                    <td>{project.description}</td>
                    <td>{project.creationdate.slice(0, -14)}</td>
                    <td>{project.repourl}</td>
                    <td>
                      {" "}
                      <Button
                        variant="danger"
                        onClick={() => this.delProject(project._id)}
                      >
                        Delete
                      </Button>
                    </td>
                    <td>
                      {" "}
                      <Button
                        variant="info"
                        // onClick={() => this.editStudent(student)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Row>
      </Container>
    );
  }
}

export default student;
