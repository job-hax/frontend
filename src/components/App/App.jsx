import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Redirect } from "react-router-dom";

import Header from "../Partials/Header/Header.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";
import Metrics from "../Metrics/Metrics.jsx";
import MetricsGlobal from "../MetricsGlobal/MetricsGlobal.jsx";
import Reviews from "../Reviews/Reviews.jsx";
import Home from "../StaticPages/Home/Home.jsx";
import AboutUs from "../StaticPages/AboutUs/AboutUs.jsx";
import Spinner from "../Partials/Spinner/Spinner.jsx";
import PollBox from "../Partials/PollBox/PollBox.jsx";
import UnderConstruction from "../StaticPages/UnderConstruction/UnderConstruction.jsx";
import SignIn from "../SignIn/SignIn.jsx";
import SignUp from "../SignUp/SignUp.jsx";
import ProfilePage from "../ProfilePage/ProfilePage.jsx";
import { fetchApi } from "../../utils/api/fetch_api";

import { googleClientId } from "../../config/config.js";
import { mockPoll } from "../../utils/api/mockResponses.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import {
  authenticateRequest,
  registerUserRequest,
  loginUserRequest,
  logOutUserRequest,
  getPollRequest,
  notificationsRequest,
  updateProfilePhotoRequest,
  getProfileRequest
} from "../../utils/api/requests.js";

import "./style.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserAuthenticated: false,
      token: "",
      active: false,
      shallRequestToken: false,
      toDashboard: false,
      toSignIn: false,
      isUserLoggedIn: false,
      isAuthenticationChecking: true,
      isPollChecking: true,
      isPollShowing: false,
      isNotificationsShowing: false,
      profilePhotoUrl: "",
      pollData: [],
      notificationsList: [],
      profileData: []
    };
    this.token = "";
    this.active = false;
    this.isUserAuthenticated = false;
    this.isUserLoggedIn = false;
    this.toDashboard = false;
    this.notificationsList = [];
    this.onAuthUpdate = this.onAuthUpdate.bind(this);
    this.handleGoogleSignIn = this.handleGoogleSignIn.bind(this);
    this.generateSignUpForm = this.generateSignUpForm.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.generateSignInForm = this.generateSignInForm.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.toggleIsPollShowing = this.toggleIsPollShowing.bind(this);
    this.checkNotifications = this.checkNotifications.bind(this);
    this.toggleNotificationsDisplay = this.toggleNotificationsDisplay.bind(
      this
    );
  }

  componentDidMount() {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          clientId: googleClientId,
          scope: "email https://www.googleapis.com/auth/gmail.readonly"
        })
        .then(() => {
          this.googleAuth = window.gapi.auth2.getAuthInstance();
          this.setState(() => ({
            isUserAuthenticated: this.googleAuth.isSignedIn.get()
          }));
          this.googleAuth.isSignedIn.listen(this.onAuthUpdate);
          IS_CONSOLE_LOG_OPEN &&
            console.log(
              "shallRequestToken inside didMounth in app:",
              this.state.shallRequestToken
            );
          const { url, config } = authenticateRequest;
          config.body.token = this.googleAuth.currentUser
            .get()
            .getAuthResponse().access_token;
          config.body = JSON.stringify(config.body);
          fetchApi(url, config).then(response => {
            if (response.ok) {
              this.token = `${
                response.json.data.token_type
              } ${response.json.data.access_token.trim()}`;
              IS_CONSOLE_LOG_OPEN && console.log(this.token);
              this.active = true;
              this.setState({
                token: this.token,
                active: this.active,
                isUserLoggedIn: true
              });
            }
          });
          this.setState({ isAuthenticationChecking: false });
          config.body = JSON.parse(config.body);
        });
    });
  }

  componentDidUpdate() {
    if (this.state.token != "" && this.state.isPollChecking) {
      getPollRequest.config.headers.Authorization = this.state.token;
      fetchApi(getPollRequest.url, getPollRequest.config).then(response => {
        if (response.ok) {
          this.pollData = response.json.data;
          this.setState({ pollData: this.pollData, isPollChecking: false });
          this.state.pollData.map(
            poll =>
              poll.is_published === true &&
              this.setState({ isPollShowing: true })
          );
        }
      });
    }
    if (this.state.token != "" && this.state.profileData.length == 0) {
      getProfileRequest.config.headers.Authorization = this.state.token;
      fetchApi(getProfileRequest.url, getProfileRequest.config).then(
        response => {
          if (response.ok) {
            this.profileData = response.json.data;
            this.setState({ profileData: this.profileData });
            console.log("profileData", this.state.profileData);
          }
        }
      );
    }
  }

  toggleIsPollShowing() {
    this.setState({ isPollShowing: !this.state.isPollShowing });
  }

  toggleNotificationsDisplay(open) {
    this.setState({
      isNotificationsShowing: open
    });
  }

  checkNotifications() {
    notificationsRequest.config.headers.Authorization = this.state.token;
    fetchApi(notificationsRequest.url, notificationsRequest.config).then(
      response => {
        if (response.ok) {
          this.notificationsList = response.json.data;
          this.setState({
            notificationsList: this.notificationsList
          });
          console.log(this.state.notificationsList);
        }
      }
    );
  }

  onAuthUpdate() {
    this.setState(() => ({
      isUserAuthenticated: this.googleAuth.isSignedIn.get()
    }));
  }

  postGoogleProfilePhoto(photoURL, token) {
    updateProfilePhotoRequest.config.headers.Authorization = token;
    updateProfilePhotoRequest.config.body = JSON.stringify({
      photo_url: photoURL
    });
    console.log(updateProfilePhotoRequest);
    fetchApi(
      updateProfilePhotoRequest.url,
      updateProfilePhotoRequest.config
    ).then(response => {
      if (response.ok) {
        console.log(response);
      }
    });
  }

  handleGoogleSignIn() {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          clientId: googleClientId,
          scope: "email https://www.googleapis.com/auth/gmail.readonly"
        })
        .then(() => {
          this.googleAuth = window.gapi.auth2.getAuthInstance();
          this.setState(() => ({
            isUserAuthenticated: this.googleAuth.isSignedIn.get()
          }));
          this.googleAuth.isSignedIn.listen(this.onAuthUpdate);
          this.googleAuth.signIn().then(response => {
            IS_CONSOLE_LOG_OPEN && console.log("signIn response", response);
            if (response.Zi.token_type == "Bearer") {
              IS_CONSOLE_LOG_OPEN &&
                console.log("google access_token:", response.Zi.access_token);
              this.setState({
                shallRequestToken: true,
                profilePhotoUrl: response.w3.Paa
              });
              IS_CONSOLE_LOG_OPEN &&
                console.log(
                  "shallRequestToken in handle signIn:",
                  this.state.shallRequestToken
                );
              if (this.state.shallRequestToken) {
                IS_CONSOLE_LOG_OPEN &&
                  console.log(
                    "shallRequestToken inside condition in app:",
                    this.state.shallRequestToken
                  );
                const { url, config } = authenticateRequest;
                config.body.token = this.googleAuth.currentUser
                  .get()
                  .getAuthResponse().access_token;
                config.body = JSON.stringify(config.body);
                fetchApi(url, config).then(response => {
                  if (response.ok) {
                    this.token = `${
                      response.json.data.token_type
                    } ${response.json.data.access_token.trim()}`;

                    this.postGoogleProfilePhoto(
                      this.state.profilePhotoUrl,
                      this.token
                    );
                    IS_CONSOLE_LOG_OPEN && console.log(this.token);
                    this.active = true;
                    this.setState({
                      token: this.token,
                      active: this.active
                    });
                    this.setState({ isUserLoggedIn: true });
                  }
                });
                this.setState({ isAuthenticationChecking: false });
                config.body = JSON.parse(config.body);
              }
            }
          });
        });
    });
  }

  handleSignUp(event) {
    IS_CONSOLE_LOG_OPEN && console.log("handle sign up first");
    event.preventDefault();
    registerUserRequest.config.body.first_name = event.target[0].value;
    registerUserRequest.config.body.last_name = event.target[1].value;
    registerUserRequest.config.body.username = event.target[2].value;
    registerUserRequest.config.body.email = event.target[3].value;
    registerUserRequest.config.body.password = event.target[4].value;
    registerUserRequest.config.body.password2 = event.target[5].value;
    IS_CONSOLE_LOG_OPEN &&
      console.log(
        "handle sign up config body",
        registerUserRequest.config.body
      );
    registerUserRequest.config.body = JSON.stringify(
      registerUserRequest.config.body
    );
    fetchApi(registerUserRequest.url, registerUserRequest.config).then(
      response => {
        if (response.ok) {
          this.setState({
            toSigIn: true
          });
          IS_CONSOLE_LOG_OPEN &&
            console.log("handle sign up state set", this.state.toSigIn);
        }
      }
    );
    registerUserRequest.config.body = JSON.parse(
      registerUserRequest.config.body
    );
  }

  generateSignUpForm() {
    return (
      <form onSubmit={this.handleSignUp} className="form-container">
        <div className="form-element-container">
          <label>First Name</label>
          <input className="input-box" />
        </div>
        <div className="form-element-container">
          <label>Last Name</label>
          <input className="input-box" />
        </div>
        <div className="form-element-container">
          <label>User Name</label>
          <input className="input-box" />
        </div>
        <div className="form-element-container">
          <label>Email</label>
          <input className="input-box" />
        </div>
        <div className="form-element-container">
          <label>Password</label>
          <input type="password" className="input-box" />
        </div>
        <div className="form-element-container">
          <label>Re-enter Password</label>
          <input type="password" className="input-box" />
        </div>
        <button className="social-buttons form-button">Sign up</button>
      </form>
    );
  }

  handleSignIn(event) {
    IS_CONSOLE_LOG_OPEN && console.log("handle sign in first");
    event.preventDefault();
    loginUserRequest.config.body.username = event.target[0].value;
    loginUserRequest.config.body.password = event.target[1].value;
    IS_CONSOLE_LOG_OPEN &&
      console.log("handle sign in config body", loginUserRequest.config.body);
    loginUserRequest.config.body = JSON.stringify(loginUserRequest.config.body);
    fetchApi(loginUserRequest.url, loginUserRequest.config).then(response => {
      if (response.ok) {
        this.token = `${
          response.json.data.token_type
        } ${response.json.data.access_token.trim()}`;
        IS_CONSOLE_LOG_OPEN && console.log(this.token);
        this.setState({
          token: this.token,
          active: true
        });
        this.setState({
          isUserLoggedIn: true,
          isAuthenticationChecking: false,
          toDashboard: true
        });
        IS_CONSOLE_LOG_OPEN &&
          console.log(
            "handle signIn isUserLoggedIn",
            this.state.isUserLoggedIn,
            "\n--redirect to Dashboard",
            this.state.toDashboard,
            "\n--token",
            this.state.token,
            "\n--active?",
            this.state.active
          );
      }
    });
    loginUserRequest.config.body = JSON.parse(loginUserRequest.config.body);
  }

  generateSignInForm() {
    return (
      <form onSubmit={this.handleSignIn} className="form-container">
        <div className="form-element-container">
          <label>Username</label>
          <input className="input-box" />
        </div>
        <div className="form-element-container">
          <label>Password</label>
          <input type="password" className="input-box" />
        </div>
        <button className="social-buttons form-button">Sign in</button>
      </form>
    );
  }

  handleSignOut() {
    IS_CONSOLE_LOG_OPEN && console.log("handle signout first");
    event.preventDefault();
    IS_CONSOLE_LOG_OPEN &&
      console.log("handle signout config body", logOutUserRequest.config.body);
    logOutUserRequest.config.body.token = this.state.token;
    logOutUserRequest.config.body = JSON.stringify(
      logOutUserRequest.config.body
    );
    fetchApi(logOutUserRequest.url, logOutUserRequest.config).then(response => {
      if (response.ok) {
        this.googleAuth.signOut();
        this.googleAuth.disconnect();
        this.setState({
          isUserAuthenticated: false,
          token: "",
          active: false,
          isUserLoggedIn: false,
          profilePhotoUrl: "",
          pollData: [],
          notificationsList: [],
          profileData: []
        });
        IS_CONSOLE_LOG_OPEN &&
          console.log(
            "handle signOut isUserLoggedIn",
            this.state.isUserLoggedIn
          );
      }
    });
    logOutUserRequest.config.body = JSON.parse(logOutUserRequest.config.body);
  }

  render() {
    const { isUserLoggedIn, isUserAuthenticated } = this.state;
    IS_CONSOLE_LOG_OPEN &&
      console.log(
        "app isUserLoggedIn",
        isUserLoggedIn,
        "\n--token",
        this.state.token,
        "\n--active?",
        this.state.active
      );
    if (this.state.isAuthenticationChecking)
      return <Spinner message="Connecting..." />;
    else
      return isUserLoggedIn || isUserAuthenticated ? (
        <Router>
          <div className="main-container">
            {window.location.href.slice(-4) != "home" && (
              <Header
                handleSignOut={this.handleSignOut}
                notificationsList={this.state.notificationsList}
                notificationCheck={this.checkNotifications}
                isNotificationsShowing={this.state.isNotificationsShowing}
                toggleNotifications={this.toggleNotificationsDisplay}
                userData={this.state.profileData}
              />
            )}
            {this.state.isPollShowing && (
              <PollBox
                data={this.pollData}
                togglePollDisplay={this.toggleIsPollShowing}
                token={this.state.token}
              />
            )}
            <Route
              exact
              path="/profile"
              render={() => (
                <ProfilePage
                  data={this.state.profileData}
                  token={this.state.token}
                />
              )}
            />
            <Route
              exact
              path="/home"
              render={() => <Home isUserLoggedIn={this.state.isUserLoggedIn} />}
            />
            <Route
              exact
              path="/dashboard"
              render={() => (
                <Dashboard
                  active={this.state.active}
                  token={this.state.token}
                />
              )}
            />
            <Route
              exact
              path="/metrics"
              render={() => (
                <Metrics active={this.state.active} token={this.state.token} />
              )}
            />
            <Route
              exact
              path="/metricsGlobal"
              render={() => (
                <MetricsGlobal
                  active={this.state.active}
                  token={this.state.token}
                />
              )}
            />
            <Route
              exact
              path="/reviews"
              render={() => (
                <Reviews active={this.state.active} token={this.state.token} />
              )}
            />
            <Route
              exact
              path="/signin"
              render={() => <Redirect to="/dashboard" />}
            />
            <Route
              exact
              path="/signup"
              render={() => <Redirect to="/dashboard" />}
            />
            <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
            <Route
              exact
              path="/aboutus"
              render={() => (
                <AboutUs isUserLoggedIn={this.state.isUserLoggedIn} />
              )}
            />
            <Route
              exact
              path="/underconstruction"
              render={() => (
                <UnderConstruction
                  isUserLoggedIn={this.state.isUserLoggedIn}
                  active={this.state.active}
                />
              )}
            />
          </div>
        </Router>
      ) : (
        <Router>
          <div className="main-container">
            <Route exact path="/home" render={() => <Redirect to="/" />} />
            <Route
              exact
              path="/"
              render={() => <Home isUserLoggedIn={this.state.isUserLoggedIn} />}
            />
            <Route
              exact
              path="/aboutus"
              render={() => (
                <AboutUs isUserLoggedIn={this.state.isUserLoggedIn} />
              )}
            />
            <Route
              exact
              path="/underconstruction"
              render={() => (
                <UnderConstruction
                  isUserLoggedIn={this.state.isUserLoggedIn}
                  active={this.state.active}
                />
              )}
            />
            <Route
              exact
              path="/dashboard"
              render={() => <Redirect to="signin" />}
            />
            <Route
              exact
              path="/signin"
              render={() => (
                <SignIn
                  googleAuth={this.googleAuth}
                  handleGoogleSignIn={this.handleGoogleSignIn}
                  generateSignInForm={this.generateSignInForm}
                  toDashboard={this.state.toDashboard}
                />
              )}
            />
            <Route
              exact
              path="/signup"
              render={() => (
                <SignUp
                  googleAuth={this.googleAuth}
                  handleGoogleSignIn={this.handleGoogleSignIn}
                  generateSignUpForm={this.generateSignUpForm}
                  toSigIn={this.state.toSigIn}
                />
              )}
            />
          </div>
        </Router>
      );
  }
}

export default App;
