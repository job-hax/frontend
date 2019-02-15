import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import Header from '../Header/Header.jsx';
import Dashboard from '../Dashboard/Dashboard.jsx';
import Home from '../Home/Home.jsx';
import DetailsModal from '../DetailsModal/DetailsModal.jsx';

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
      <Router>
        <div className="main-container">
          <Header/>
          <Route path="/dashboard" component={Dashboard}/>
          <Route exact path="/" component={Home}/>
          <Route path="/modal" component={DetailsModal}/>
        </div>
      </Router>
    );
  }
}

export default App;