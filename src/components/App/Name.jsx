import React, {Component} from "react";

class Name extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "is awesome"
    };
  }

  render() {
    return (
      <div>
        <button onClick={() => this.setState({status: 'sucks'})}>
          Click
        </button>
        <h1>
          {this.props.name} {this.state.status}
        </h1>
      </div>
    );
  }
}

export default Name;