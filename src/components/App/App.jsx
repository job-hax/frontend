import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { withCookies } from "react-cookie";
import { Alert } from "antd";

import Header from "../Partials/Header/Header.jsx";
import Blog from "../Blog/Blog.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";
import Metrics from "../Metrics/Metrics.jsx";
import MetricsGlobal from "../MetricsGlobal/MetricsGlobal.jsx";
import Companies from "../Companies/Companies.jsx";
import Home from "../StaticPages/Home/Home.jsx";
import AboutUs from "../StaticPages/AboutUs/AboutUs.jsx";
import PrivacyPolicy from "../StaticPages/PrivacyPolicy/PrivacyPolicy.jsx";
import UserAgreement from "../StaticPages/UserAgreement/UserAgreement.jsx";
import Spinner from "../Partials/Spinner/Spinner.jsx";
import PollBox from "../Partials/PollBox/PollBox.jsx";
import FeedBack from "../Partials/FeedBack/FeedBack.jsx";
import UnderConstruction from "../StaticPages/UnderConstruction/UnderConstruction.jsx";
import FAQ from "../StaticPages/FAQ/FAQ.jsx";
import SignIn from "../UserAuth/SignIn/SignIn.jsx";
import SignUp from "..//UserAuth/SignUp/SignUp.jsx";
import Action from "../UserAuth/Action/Action.jsx";
import ProfilePage from "../ProfilePage/ProfilePage.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";

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
import "../../assets/libraryScss/antd-scss/antd.scss";

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
      isAlertShowing: false,
      alertType: "",
      alertMessage: "",
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
    this.setIsProfileUpdated = this.setIsProfileUpdated.bind(this);
    this.passStatesFromSignin = this.passStatesFromSignin.bind(this);
    this.setIsUserLoggedIn = this.setIsUserLoggedIn.bind(this);
    this.setIsUserAuthenticated = this.setIsUserAuthenticated.bind(this);
    this.setIsAuthenticationChecking = this.setIsAuthenticationChecking.bind(
      this
    );
    this.showAlert = this.showAlert.bind(this);
    this.cookie = this.cookie.bind(this);
  }

  componentDidMount() {
    window.gapi.load("client:auth2", () => {
      window.gapi.client.init({
        apiKey: "AIzaSyBnF8loY6Vqhs4QWTM_fWCP93Xidbh1kYo",
        clientId: googleClientId,
        scope: "email https://www.googleapis.com/auth/gmail.readonly"
      });
    });
    let token = this.props.cookies.get("jobhax_access_token");
    if (token) {
      this.setState({ token: token, active: true, isUserLoggedIn: true });
    }
    this.setState({ isAuthenticationChecking: false });
  }

  componentDidUpdate() {
    if (this.state.token != "" && this.state.isPollChecking) {
      getPollRequest.config.headers.Authorization = this.props.cookies.get(
        "jobhax_access_token"
      );
      axiosCaptcha(getPollRequest.url, getPollRequest.config).then(response => {
        if (response.statusText === "OK") {
          this.pollData = response.data.data;
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
      getProfileRequest.config.headers.Authorization = this.props.cookies.get(
        "jobhax_access_token"
      );
      axiosCaptcha(getProfileRequest.url, getProfileRequest.config).then(
        response => {
          if (response.statusText === "OK") {
            this.profileData = response.data.data;
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

  cookie(method, name, data, path, expires) {
    const { cookies } = this.props;
    if (method.toUpperCase() === "GET") {
      cookies.get(name);
    } else if (method.toUpperCase() === "SET") {
      cookies.set(name, data, { path: path, expires: expires });
    } else if (method === "remove_all") {
      cookies.get("jobhax_access_token") &&
        cookies.remove("jobhax_access_token", { path: "/" });
      cookies.remove("jobhax_refresh_token", { path: "/" });
      cookies.remove("jobhax_expires_in", { path: "/" });
      cookies.remove("google_access_token", { path: "/" });
      cookies.remove("google_refresh_token", { path: "/" });
      cookies.remove("google_expires_in", { path: "/" });
      cookies.remove("remember_me", { path: "/" });
    }
  }

  checkNotifications() {
    notificationsRequest.config.headers.Authorization = this.state.token;
    axiosCaptcha(notificationsRequest.url, notificationsRequest.config).then(
      response => {
        if (response.statusText === "OK") {
          this.notificationsList = response.data.data;
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
    axiosCaptcha(logOutUserRequest.url, logOutUserRequest.config, false).then(
      response => {
        if (response.statusText === "OK") {
          console.log(response.data);
          if (response.data.success === true) {
            window.gapi.auth2.getAuthInstance().signOut();
            this.cookie("remove_all");
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
            console.log(response, response.data.error_message);
            showAlert(5000, "error", "Error: " + response.data.error_message);
          }
        } else {
          showAlert(5000, "error", "Something went wrong!");
        }
      }
    );
  }

  showAlert(time, type, message) {
    this.setState({
      isAlertShowing: true,
      alertType: type,
      alertMessage: message
    });
    new Promise(wait => setTimeout(wait, time)).then(() =>
      this.setState({ isAlertShowing: false, alertType: "", alertMessage: "" })
    );
  }

  generateAlert() {
    const bottom = "30px";
    return (
      <div
        style={{
          position: "absolute",
          bottom: bottom,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          zIndex: 100
        }}
      >
        <div>
          <Alert
            type={this.state.alertType}
            message={this.state.alertMessage}
            showIcon
          />
        </div>
      </div>
    );
  }

  render() {
    const { isUserLoggedIn, isUserAuthenticated } = this.state;
    IS_CONSOLE_LOG_OPEN &&
      console.log(
        "app isUserLoggedIn",
        isUserLoggedIn,
        "app isUserAuthenticated",
        isUserAuthenticated,
        "\n--token",
        this.state.token,
        "\n--active?",
        this.state.active,
        "\n profile updated?",
        this.state.isProfileUpdated,
        "\n cookies",
        this.props.cookies.getAll()
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
                token={this.state.token}
                alert={this.showAlert}
                notificationsList={this.state.notificationsList}
                notificationCheck={this.checkNotifications}
                isNotificationsShowing={this.state.isNotificationsShowing}
                toggleNotifications={this.toggleNotificationsDisplay}
                userData={this.state.profileData}
              />
            )}
            <FeedBack token={this.state.token} alert={this.showAlert} />
            {this.state.isPollShowing && (
              <PollBox
                data={this.pollData}
                togglePollDisplay={this.toggleIsPollShowing}
                token={this.state.token}
                alert={this.showAlert}
              />
            )}
            {this.state.isAlertShowing && <div>{this.generateAlert()}</div>}
            <Route
              exact
              path="/profile"
              render={() => (
                <ProfilePage
                  token={this.state.token}
                  active={this.state.active}
                  setIsProfileUpdated={this.setIsProfileUpdated}
                  alert={this.showAlert}
                />
              )}
            />
            <Route
              exact
              path="/blogs"
              render={() => (
                <Blog
                  token={this.state.token}
                  active={this.state.active}
                  alert={this.showAlert}
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
                  alert={this.showAlert}
                />
              )}
            />
            <Route
              exact
              path="/metrics"
              render={() => (
                <Metrics
                  active={this.state.active}
                  token={this.state.token}
                  alert={this.showAlert}
                />
              )}
            />
            <Route
              exact
              path="/metricsGlobal"
              render={() => (
                <MetricsGlobal
                  active={this.state.active}
                  token={this.state.token}
                  alert={this.showAlert}
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
                  alert={this.showAlert}
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
              path="/useragreement"
              render={() => <UserAgreement />}
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
            <Route
              exact
              path="/action"
              render={() => <Action alert={this.showAlert} />}
            />
          </div>
        </Router>
      ) : (
        <Router>
          <div className="main-container">
            {this.state.isAlertShowing && <div>{this.generateAlert()}</div>}
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
                  passStatesFromSignin={this.passStatesFromSignin}
                  setIsUserLoggedIn={this.setIsUserLoggedIn}
                  setIsUserAuthenticated={this.setIsUserAuthenticated}
                  setIsAuthenticationChecking={this.setIsAuthenticationChecking}
                  alert={this.showAlert}
                  cookie={this.cookie}
                />
              )}
            />
            <Route
              exact
              path="/signup"
              render={() => (
                <SignUp
                  googleAuth={this.googleAuth}
                  alert={this.showAlert}
                  setIsUserAuthenticated={this.setIsUserAuthenticated}
                  setIsAuthenticationChecking={this.setIsAuthenticationChecking}
                  passStatesFromSignin={this.passStatesFromSignin}
                  setIsUserLoggedIn={this.setIsUserLoggedIn}
                  cookie={this.cookie}
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
            <Route
              exact
              path="/useragreement"
              render={() => <UserAgreement />}
            />
            <Route exact path="/action" render={() => <Action />} />
          </div>
        </Router>
      );
  }
}

export default withCookies(App);
