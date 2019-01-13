import React, {Component} from "react";

import './style.scss'

class Name extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "is awesome"
    };
  }

  render() {
    return (
      <div
        className="name-container"
        onClick={() => this.setState({status: 'sucks'})}>
        <h1>
          {this.props.name} {this.state.status}
        </h1>
      </div>
    );
  }
}

export default Name;