import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";

import Dashboard from '../Dashboard/Dashboard.jsx';
import Metrics from '../Metrics/Metrics.jsx';
import Home from '../Home/Home.jsx';
import AboutUs from '../AboutUs/AboutUs.jsx';
import UnderConstruction from '../UnderConstruction/UnderConstruction.jsx';
import SignIn from '../SignIn/SignIn.jsx';
import SignUp from '../SignUp/SignUp.jsx';

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
        scope: 'email https://www.googleapis.com/auth/gmail.readonly'
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
          <Route exact path="/dashboard" render={() => <Dashboard googleAuth={this.googleAuth}/>}/>
          <Route exact path="/metrics" render={() => <Metrics googleAuth={this.googleAuth}/>}/>
          <Route exact path="/" component={Home}/>
        </div>
      </Router>)
      :
      (<Router>
        <div className="main-container">
          <Route exact path="/" component={Home}/>
          <Route exact path="/aboutus" component={AboutUs}/>
          <Route exact path="/underconstruction" component={UnderConstruction}/>
          <Route exact path="/signin" render={() => <SignIn googleAuth={this.googleAuth}/>}/>
          <Route exact path="/signup" render={() => <SignUp googleAuth={this.googleAuth}/>}/>
        </div>
      </Router>)
  }
}

export default App;
