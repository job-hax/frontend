import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Header from '../Header/Header.jsx';
import Dashboard from '../Dashboard/Dashboard.jsx';
import Home from '../Home/Home.jsx';
import DetailsModal from '../DetailsModal/DetailsModal.jsx';
import Login from '../Login/Login.jsx';

import {googleClientId} from "../../config/config.js";

import './style.scss'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserLoggedIn: false
    };
    this.onAuthUpdate = this.onAuthUpdate.bind(this);
  }

  componentDidMount() {
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        clientId: googleClientId,
        scope: 'email'
      })
        .then(() => {
          this.googleAuth = window.gapi.auth2.getAuthInstance();
          this.setState(() => ({
            isUserLoggedIn: this.googleAuth.isSignedIn.get()
          }));
          this.googleAuth.isSignedIn.listen(this.onAuthUpdate)
        })
    });
  }

  onAuthUpdate() {
    this.setState(() => ({
      isUserLoggedIn: this.googleAuth.isSignedIn.get()
    }));
  }

  render() {
    const {isUserLoggedIn} = this.state;

    return isUserLoggedIn ?
      (<Router>
        <div className="main-container">
          <Header googleAuth={this.googleAuth}/>
          <Route exact path="/dashboard" component={Dashboard}/>
          <Route exact path="/" component={Home}/>
          <Route exact path="/modal" component={DetailsModal}/>
        </div>
      </Router>)
      : <Login googleAuth={this.googleAuth}/>
  }
}

export default DragDropContext(HTML5Backend)(App);