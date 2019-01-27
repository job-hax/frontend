import React, {Component} from "react";
import Header from '../Header/Header.jsx';
import Dashboard from '../Dashboard/Dashboard.jsx';

import './style.scss'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1
    };
  }

  render() {
    return (
      <div className="main-container">
        <Header/>
        <Dashboard/>
      </div>

    );
  }
}

export default App;