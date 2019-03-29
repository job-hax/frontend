import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";

import Dashboard from '../Dashboard/Dashboard.jsx';
import Metrics from '../Metrics/Metrics.jsx';
import Home from '../Home/Home.jsx';
import AboutUs from '../AboutUs/AboutUs.jsx';
import Loading from '../Loading/Loading.jsx';
import UnderConstruction from '../UnderConstruction/UnderConstruction.jsx';
import SignIn from '../SignIn/SignIn.jsx';
import SignUp from '../SignUp/SignUp.jsx';
import {fetchApi} from '../../utils/api/fetch_api'

import {googleClientId} from "../../config/config.js";
import {
  authenticateRequest,
} from '../../utils/api/requests.js';

import './style.scss'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserAuthenticated: false,
      token: '',
      active:false,
      shallRequestToken:false,
    };
    this.token = '',
    this.active=false,
    this.isUserAuthenticated= false,
    this.onAuthUpdate = this.onAuthUpdate.bind(this);
    this.handleGoogleSignIn = this.handleGoogleSignIn.bind(this);
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
            isUserAuthenticated: this.googleAuth.isSignedIn.get()
          }));
          this.googleAuth.isSignedIn.listen(this.onAuthUpdate)
          console.log('shallRequestToken inside didMounth in app:',this.state.shallRequestToken);
          const {url, config} = authenticateRequest;
          config.body.token = this.googleAuth.currentUser
            .get()
            .getAuthResponse().access_token;
            config.body = JSON.stringify(config.body);
          fetchApi(url, config)
            .then(response => {
              if (response.ok) {
                this.token = `${response.json.data.token_type} ${response.json.data.access_token.trim()}`;
                console.log(this.token);
                this.active=!this.active;
                this.setState({
                    token: this.token,
                    active: this.active
                });
              }
            })
          config.body = JSON.parse(config.body);
        })  
    });
  }



  onAuthUpdate() {
    this.setState(() => ({
      isUserAuthenticated: this.googleAuth.isSignedIn.get()
    }));
  }

  handleGoogleSignIn() {
    this.googleAuth.signIn().then((response) =>{
      console.log('signIn response',response.Zi.token_type)
      if (response.Zi.token_type=='Bearer'){
        console.log('google access_token:',response.Zi.access_token);
        this.setState({
          shallRequestToken: true,
        });
        console.log('shallRequestToken in handle signIn:',this.state.shallRequestToken);
        if (this.state.shallRequestToken) {
          console.log('shallRequestToken inside condition in app:',this.state.shallRequestToken);
          const {url, config} = authenticateRequest;
          config.body.token = this.googleAuth.currentUser
            .get()
            .getAuthResponse().access_token;
          config.body = JSON.stringify(config.body);
          fetchApi(url, config)
            .then(response => {
              if (response.ok) {
                this.token = `${response.json.data.token_type} ${response.json.data.access_token.trim()}`;
                console.log(this.token);
                this.active=!this.active;
                this.setState({
                    token: this.token,
                    active: this.active
                });
              }
            })
          config.body = JSON.parse(config.body);
        }
      }
    });
  }

  render() {
    const {isUserAuthenticated} = this.state;
    console.log('token app:',this.state.token);
    console.log('active? app:',this.state.active);
    return isUserAuthenticated ?
      (<Router>
        <div className="main-container">
          <Route exact path="/loading" component={Loading}/>
          <Route exact path="/dashboard" render={() => 
          <Dashboard 
            active={this.state.active}
            token={this.state.token}
            googleAuth={this.googleAuth}
          />}/>
          <Route exact path="/metrics" render={() => 
          <Metrics 
            active={this.state.active}
            token={this.state.token}
            googleAuth={this.googleAuth}
          />}/>
          <Route exact path="/" render={() => <Home isUserAuthenticated={this.state.isUserAuthenticated}/>}/>
          <Route exact path="/aboutus" render={() => <AboutUs isUserAuthenticated={this.state.isUserAuthenticated}/>}/>
        </div>
      </Router>)
      :
      (<Router>
        <div className="main-container">
          <Route exact path="/" render={() => <Home isUserAuthenticated={this.state.isUserAuthenticated}/>}/>
          <Route exact path="/aboutus" render={() => <AboutUs isUserAuthenticated={this.state.isUserAuthenticated}/>}/>
          <Route exact path="/underconstruction" component={UnderConstruction}/>
          <Route exact path="/loading" component={Loading}/>
          <Route exact path="/signin" render={() =>
            <SignIn
              googleAuth={this.googleAuth}
              handleGoogleSignIn={this.handleGoogleSignIn}
              />}/>
          <Route exact path="/signup" render={() => 
            <SignUp 
              googleAuth={this.googleAuth}
              handleGoogleSignIn={this.handleGoogleSignIn}
            />}
          />
        </div>
      </Router>)
  }
}

export default App;
