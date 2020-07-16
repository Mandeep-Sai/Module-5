import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";

class ProjectsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
    };
  }
  componentDidMount = async () => {
    let response = await fetch("http://127.0.0.1:3003/pg/students/projects");
    let projects = await response.json();
    this.setState({ projects });
  };
  render() {
    return (
      <>
        <p className="text-center display-4">All Projects</p>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Creation Date</th>
              <th>Repo URL</th>
              <th>Student Name</th>
              <th>Student Email</th>
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
                  <td>{project.sname}</td>
                  <td>{project.email}</td>
                  <td>
                    {" "}
                    <Button
                      variant="danger"
                      onClick={() => this.delStudent(project._id)}
                    >
                      Delete
                    </Button>
                  </td>
                  <td>
                    {" "}
                    <Button
                      variant="info"
                      onClick={() => this.editStudent(project._id)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </>
    );
  }
}

export default ProjectsList;
