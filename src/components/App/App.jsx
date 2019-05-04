import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Redirect } from "react-router-dom";

import Header from "../Partials/Header/Header.jsx";
import Blog from "../Blog/Blog.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";
import Metrics from "../Metrics/Metrics.jsx";
import MetricsGlobal from "../MetricsGlobal/MetricsGlobal.jsx";
import Companies from "../Companies/Companies.jsx";
import Home from "../StaticPages/Home/Home.jsx";
import AboutUs from "../StaticPages/AboutUs/AboutUs.jsx";
import PrivacyPolicy from "../StaticPages/PrivacyPolicy/PrivacyPolicy.jsx";
import Spinner from "../Partials/Spinner/Spinner.jsx";
import PollBox from "../Partials/PollBox/PollBox.jsx";
import FeedBack from "../Partials/FeedBack/FeedBack.jsx";
import UnderConstruction from "../StaticPages/UnderConstruction/UnderConstruction.jsx";
import FAQ from "../StaticPages/FAQ/FAQ.jsx";
import SignIn from "../UserAuth/SignIn/SignIn.jsx";
import SignUp from "..//UserAuth/SignUp/SignUp.jsx";
import Action from "../UserAuth/Action/Action.jsx";
import ProfilePage from "../ProfilePage/ProfilePage.jsx";
import { fetchApi } from "../../utils/api/fetch_api";

import { googleClientId } from "../../config/config.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import {
  authenticateRequest,
  logOutUserRequest,
  getPollRequest,
  notificationsRequest,
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
      isUserLoggedIn: false,
      isAuthenticationChecking: true,
      isProfileUpdated: true,
      isPollChecking: true,
      isPollShowing: false,
      isNotificationsShowing: false,
      pollData: [],
      notificationsList: [],
      profileData: []
    };
    this.notificationsList = [];
    this.onAuthUpdate = this.onAuthUpdate.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.toggleIsPollShowing = this.toggleIsPollShowing.bind(this);
    this.checkNotifications = this.checkNotifications.bind(this);
    this.toggleNotificationsDisplay = this.toggleNotificationsDisplay.bind(
      this
    );
    this.passStatesFromSignin = this.passStatesFromSignin.bind(this);
    this.setIsUserLoggedIn = this.setIsUserLoggedIn.bind(this);
    this.setIsUserAuthenticated = this.setIsUserAuthenticated.bind(this);
    this.setIsAuthenticationChecking = this.setIsAuthenticationChecking.bind(
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
          const { url, config } = authenticateRequest;
          config.body.token = this.googleAuth.currentUser
            .get()
            .getAuthResponse().access_token;
          config.body = JSON.stringify(config.body);
          fetchApi(url, config).then(response => {
            console.log(config, response);
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

  passStatesFromSignin(token, active, isProfileUpdated) {
    this.setState({
      token: token,
      active: active,
      isProfileUpdated: isProfileUpdated
    });
  }

  setIsUserLoggedIn(isUserLoggedIn) {
    this.setState({ isUserLoggedIn: isUserLoggedIn });
  }

  setIsUserAuthenticated(isUserAuthenticated) {
    this.setState({ isUserAuthenticated: isUserAuthenticated });
  }

  setIsAuthenticationChecking(isAuthenticationChecking) {
    this.setState({ isAuthenticationChecking: isAuthenticationChecking });
  }

  setIsProfileUpdated(isProfileUpdated) {
    this.setState({ isProfileUpdated: isProfileUpdated });
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
        console.log(response.json);
        if (response.json.success === true) {
          this.googleAuth.signOut();
          this.googleAuth.disconnect();
          this.setState({
            isUserAuthenticated: false,
            token: "",
            isProfileUpdated: false,
            active: false,
            isUserLoggedIn: false,
            pollData: [],
            notificationsList: [],
            profileData: []
          });
          IS_CONSOLE_LOG_OPEN &&
            console.log(
              "handle signOut isUserLoggedIn",
              this.state.isUserLoggedIn
            );
          <Redirect to="/home" />;
        } else {
          console.log(response, response.json.error_message);
          alert(
            "Error: \n Code " +
              response.json.error_code +
              "\n" +
              response.json.error_message
          );
        }
      } else {
        alert("Something went wrong! \n Error: \n Code \n " + response.status);
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
        this.state.active,
        "\n profile updated?",
        this.state.isProfileUpdated
      );
    if (this.state.isAuthenticationChecking)
      return <Spinner message="Connecting..." />;
    else if ((isUserLoggedIn || isUserAuthenticated) && !this.state.active)
      return <Spinner message="Reaching your account..." />;
    else
      return (isUserLoggedIn || isUserAuthenticated) && this.state.active ? (
        <Router>
          <div className="main-container">
            {window.location.pathname != "/home" && (
              <Header
                handleSignOut={this.handleSignOut}
                notificationsList={this.state.notificationsList}
                notificationCheck={this.checkNotifications}
                isNotificationsShowing={this.state.isNotificationsShowing}
                toggleNotifications={this.toggleNotificationsDisplay}
                userData={this.state.profileData}
              />
            )}
            <FeedBack token={this.state.token} />
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
                  token={this.state.token}
                  active={this.state.active}
                  setIsProfileUpdated={this.setIsProfileUpdated}
                />
              )}
            />
            <Route
              exact
              path="/blogs"
              render={() => (
                <Blog token={this.state.token} active={this.state.active} />
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
              path="/companies"
              render={() => (
                <Companies
                  active={this.state.active}
                  token={this.state.token}
                />
              )}
            />
            <Route
              exact
              path="/signin"
              render={() =>
                this.state.isProfileUpdated === true ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <Redirect to="/profile" />
                )
              }
            />
            <Route
              exact
              path="/signup"
              render={() => <Redirect to="/profile" />}
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
              path="/privacypolicy"
              render={() => <PrivacyPolicy />}
            />
            <Route
              exact
              path="/underconstruction"
              render={() => <UnderConstruction />}
            />
            <Route
              exact
              path="/faqs"
              render={() => <FAQ active={this.state.active} />}
            />
            <Route exact path="/action" render={() => <Action />} />
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
              render={() => <UnderConstruction />}
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
                  passStatesFromSignin={this.passStatesFromSignin}
                  setIsUserLoggedIn={this.setIsUserLoggedIn}
                  setIsUserAuthenticated={this.setIsUserAuthenticated}
                  setIsAuthenticationChecking={this.setIsAuthenticationChecking}
                  onAuthUpdate={this.onAuthUpdate}
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
                />
              )}
            />
            <Route
              exact
              path="/faqs"
              render={() => <FAQ active={this.state.active} />}
            />
            <Route
              exact
              path="/blogs"
              render={() => <Redirect to="/signin" />}
            />
            <Route
              exact
              path="/privacypolicy"
              render={() => <PrivacyPolicy />}
            />
            <Route exact path="/action" render={() => <Action />} />
          </div>
        </Router>
      );
  }
}

export default App;
