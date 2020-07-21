import React from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      parsed: [],
      url: "",
    };
  }

  componentDidMount = async () => {
    let response = await fetch("http://localhost:3002/attendees/");
    let parsed = await response.json();

    console.log(parsed);
    this.setState({ parsed });
  };

  render() {
    return (
      <div className="App">
        {this.state.parsed.length > 0 &&
          this.state.parsed.map((post) => (
            <img src={`data:image/jpeg;base64,${post.image}`} />
          ))}
      </div>
    );
  }
}
/* 
 let array = parsed.image.data.data;
    let url = btoa(
      new Uint8Array(array).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );


  <img
                src={`data:image/${this.state.parsed.image.contentType};base64,${this.state.url}`}
              ></img>
*/

export default App;
