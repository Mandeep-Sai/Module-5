import React, { Component } from "react";

class Pagin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numberOfStudents: [],
    };
  }
  componentDidMount = () => {
    const { total } = this.props;
    this.setState({ numberOfStudents: total });

    console.log(total);
    console.log(this.props);
  };
  render() {
    return <div>{this.state.numberOfStudents}</div>;
  }
}

export default Pagin;
