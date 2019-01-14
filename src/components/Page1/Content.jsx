import React, {Component} from "react";

import './style.scss'

class Content extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <h1>
        Main content page: {this.props.content}
      </h1>
    );
  }
}

export default Content;