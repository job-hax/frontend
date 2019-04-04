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
import {IS_CONSOLE_LOG_OPEN} from '../../utils/constants/constants.js';
import {
  authenticateRequest,
  registerUserRequest,
  loginUserRequest,
  logOutUserRequest,
} from '../../utils/api/requests.js';

import './style.scss'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserAuthenticated: false,
      token: '',
      active: false,
      shallRequestToken: false,
      toDashboard: false,
      toSignIn: false,
      isUserLoggedIn: false,
    };
    this.token = '',
    this.active = false,
    this.isUserAuthenticated = false,
    this.isUserLoggedIn = false,
    this.toDashboard = false,
    this.onAuthUpdate = this.onAuthUpdate.bind(this);
    this.handleGoogleSignIn = this.handleGoogleSignIn.bind(this);
    this.generateSignUpForm = this.generateSignUpForm.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.generateSignInForm = this.generateSignInForm.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
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
          IS_CONSOLE_LOG_OPEN && console.log('shallRequestToken inside didMounth in app:',this.state.shallRequestToken);
          const {url, config} = authenticateRequest;
          config.body.token = this.googleAuth.currentUser
            .get()
            .getAuthResponse().access_token;
            config.body = JSON.stringify(config.body);
          fetchApi(url, config)
            .then(response => {
              if (response.ok) {
                this.token = `${response.json.data.token_type} ${response.json.data.access_token.trim()}`;
                IS_CONSOLE_LOG_OPEN && console.log(this.token);
                this.active=true;
                this.setState({
                    token: this.token,
                    active: this.active,
                    isUserLoggedIn: true,
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
    window.gapi.load('client:auth2', () => {
    window.gapi.client.init({
      clientId: googleClientId,
      scope: 'email https://www.googleapis.com/auth/gmail.readonly'
    })
      .then(() => {
        this.googleAuth = window.gapi.auth2.getAuthInstance();
        this.setState(() => ({
          isUserAuthenticated: this.googleAuth.isSignedIn.get(),
        }));
        this.googleAuth.isSignedIn.listen(this.onAuthUpdate)
        this.googleAuth.signIn().then((response) =>{
          IS_CONSOLE_LOG_OPEN && console.log('signIn response',response.Zi.token_type)
          if (response.Zi.token_type=='Bearer'){
            IS_CONSOLE_LOG_OPEN && console.log('google access_token:',response.Zi.access_token);
            this.setState({
              shallRequestToken: true,
            });
            IS_CONSOLE_LOG_OPEN && console.log('shallRequestToken in handle signIn:',this.state.shallRequestToken);
            if (this.state.shallRequestToken) {
              IS_CONSOLE_LOG_OPEN && console.log('shallRequestToken inside condition in app:',this.state.shallRequestToken);
              const {url, config} = authenticateRequest;
              config.body.token = this.googleAuth.currentUser
                .get()
                .getAuthResponse().access_token;
              config.body = JSON.stringify(config.body);
              fetchApi(url, config)
                .then(response => {
                  if (response.ok) {
                    this.token = `${response.json.data.token_type} ${response.json.data.access_token.trim()}`;
                    IS_CONSOLE_LOG_OPEN && console.log(this.token);
                    this.active=true;
                    this.setState({
                        token: this.token,
                        active: this.active,
                        isUserLoggedIn: true,
                    });
                  }
                })
              config.body = JSON.parse(config.body);
            }
          }
        });
      });
    });
  }

  handleSignUp(event) {
    IS_CONSOLE_LOG_OPEN && console.log('handle sign up first');
    event.preventDefault();
    registerUserRequest.config.body.first_name = event.target[0].value;
    registerUserRequest.config.body.last_name = event.target[1].value;
    registerUserRequest.config.body.username = event.target[2].value;
    registerUserRequest.config.body.email = event.target[3].value;
    registerUserRequest.config.body.password = event.target[4].value;
    registerUserRequest.config.body.password2 = event.target[5].value;
    IS_CONSOLE_LOG_OPEN && console.log('handle sign up config body',registerUserRequest.config.body);
    registerUserRequest.config.body = JSON.stringify(registerUserRequest.config.body);
    fetchApi(registerUserRequest.url, registerUserRequest.config)
      .then(response => {
        if (response.ok) {
          this.setState({
            toSigIn: true,
          });
          IS_CONSOLE_LOG_OPEN && console.log('handle sign up state set',this.state.toSigIn);
        }
      });
    registerUserRequest.config.body = JSON.parse(registerUserRequest.config.body);
  }

  generateSignUpForm() {
    return (
      <form onSubmit={this.handleSignUp} className="form-container">
        <div className="form-element-container">
          <label>First Name</label>
          <input className="input-box"></input>
        </div>
        <div className="form-element-container">
          <label>Last Name</label>
          <input className="input-box"></input>
        </div>
        <div className="form-element-container">
          <label>User Name</label>
          <input className="input-box"></input>
        </div>
        <div className="form-element-container">
          <label>Email</label>
          <input className="input-box"></input>
        </div>
        <div className="form-element-container">
          <label>Password</label>
          <input type='password' className="input-box"></input>
        </div>
        <div className="form-element-container">
          <label>Re-enter Password</label>
          <input type='password' className="input-box"></input>
        </div>
        <button className="social-buttons form-button">Sign up</button>
      </form>
    )
  }

  handleSignIn(event) {
    IS_CONSOLE_LOG_OPEN && console.log('handle sign in first');
    event.preventDefault();
    loginUserRequest.config.body.username = event.target[0].value;
    loginUserRequest.config.body.password = event.target[1].value;
    IS_CONSOLE_LOG_OPEN && console.log('handle sign in config body',loginUserRequest.config.body);
    loginUserRequest.config.body = JSON.stringify(loginUserRequest.config.body);
    fetchApi(loginUserRequest.url, loginUserRequest.config)
      .then(response => {
        if (response.ok) {
          this.token = `${response.json.data.token_type} ${response.json.data.access_token.trim()}`;
          IS_CONSOLE_LOG_OPEN && console.log(this.token);
          this.setState({
            isUserLoggedIn: true,
            toDashboard: true,
            token: this.token,
            active: true,
          });
          IS_CONSOLE_LOG_OPEN && console.log('handle signIn isUserLoggedIn',this.state.isUserLoggedIn, '\n--redirect to Dashboard',this.state.toDashboard, '\n--token',this.state.token,'\n--active?', this.state.active);
        }
      });
      loginUserRequest.config.body = JSON.parse(loginUserRequest.config.body);
  }

  generateSignInForm() {
    return (
      <form onSubmit={this.handleSignIn} className="form-container">
        <div className="form-element-container">
          <label>Username</label>
          <input className="input-box"></input>
        </div>
        <div className="form-element-container">
          <label>Password</label>
          <input type='password' className="input-box"></input>
        </div>
        <button className="social-buttons form-button">Sign in</button>
      </form>
    )
  }

  handleSignOut() {
    IS_CONSOLE_LOG_OPEN && console.log('handle signout first');
    event.preventDefault();
    IS_CONSOLE_LOG_OPEN && console.log('handle signout config body',logOutUserRequest.config.body);
    logOutUserRequest.config.body.token = this.state.token;
    logOutUserRequest.config.body = JSON.stringify(logOutUserRequest.config.body);
    fetchApi(logOutUserRequest.url, logOutUserRequest.config)
      .then(response => {
        if (response.ok) {
          this.googleAuth.signOut();
          this.googleAuth.disconnect();
          this.setState({
            isUserLoggedIn: false,
            isUserAuthenticated: false,
          });
          IS_CONSOLE_LOG_OPEN && console.log('handle signOut isUserLoggedIn',this.state.isUserLoggedIn);
        }
      });
    logOutUserRequest.config.body = JSON.parse(logOutUserRequest.config.body);
  }

  render() {
    const {isUserLoggedIn, isUserAuthenticated} = this.state;
    IS_CONSOLE_LOG_OPEN && console.log('app isUserLoggedIn',isUserLoggedIn,'\n--token',this.state.token,'\n--active?',this.state.active);
    return isUserLoggedIn||isUserAuthenticated ?
      (<Router>
        <div className="main-container">
          <Route exact path="/loading" component={Loading}/>
          <Route exact path="/dashboard" render={() => 
          <Dashboard 
            active={this.state.active}
            token={this.state.token}
            handleSignOut={this.handleSignOut}
          />}/>
          <Route exact path="/metrics" render={() => 
          <Metrics 
            active={this.state.active}
            token={this.state.token}
            hansleSignOut={this.handleSignOut}
          />}/>
          <Route exact path="/signin" render={() =>
            <Dashboard 
              active={this.state.active}
              token={this.state.token}
              handleSignOut={this.handleSignOut}
          />}/>
          <Route exact path="/signup" render={() =>
            <Dashboard 
              active={this.state.active}
              token={this.state.token}
              handleSignOut={this.handleSignOut}
          />}/>
          <Route exact path="/" render={() => <Home isUserLoggedIn={this.state.isUserLoggedIn}/>}/>
          <Route exact path="/aboutus" render={() => <AboutUs isUserLoggedIn={this.state.isUserLoggedIn}/>}/>
          <Route exact path="/underconstruction" render={() => <UnderConstruction isUserLoggedIn={this.state.isUserLoggedIn}/>}/>
        </div>
      </Router>)
      :
      (<Router>
        <div className="main-container">
          <Route exact path="/" render={() => <Home isUserLoggedIn={this.state.isUserLoggedIn}/>}/>
          <Route exact path="/aboutus" render={() => <AboutUs isUserLoggedIn={this.state.isUserLoggedIn}/>}/>
          <Route exact path="/underconstruction" render={() => <UnderConstruction isUserLoggedIn={this.state.isUserLoggedIn}/>}/>
          <Route exact path="/loading" component={Loading}/>
          <Route exact path="/dashboard" render={() =>
            <SignIn
              googleAuth={this.googleAuth}
              handleGoogleSignIn={this.handleGoogleSignIn}
              generateSignInForm={this.generateSignInForm}
              toDashboard={this.state.toDashboard}
          />}/>
          <Route exact path="/signin" render={() =>
            <SignIn
              googleAuth={this.googleAuth}
              handleGoogleSignIn={this.handleGoogleSignIn}
              generateSignInForm={this.generateSignInForm}
              toDashboard={this.state.toDashboard}
          />}/>
          <Route exact path="/signup" render={() => 
            <SignUp 
              googleAuth={this.googleAuth}
              handleGoogleSignIn={this.handleGoogleSignIn}
              generateSignUpForm={this.generateSignUpForm}
              toSigIn={this.state.toSigIn}
            />}
          />
        </div>
      </Router>)
  }
}

export default App;
