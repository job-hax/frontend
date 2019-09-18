import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { withCookies } from "react-cookie";
import { Alert } from "antd";

import Header from "../Partials/Header/Header.jsx";
import Blog from "../Blog/Blog.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";
import Metrics from "../Metrics/Metrics.jsx";
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
import LinkedInOAuthAction from "../UserAuth/Action/LinkedInOAuthAction.jsx";
import ProfilePage from "../ProfilePage/ProfilePage.jsx";
import Mentors from "../Mentors/Mentors.jsx";
import Alumni from "../Alumni/Alumni.jsx";
import Events from "../Events/Events.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";

import {
  googleClientId,
  jobHaxClientId,
  jobHaxClientSecret
} from "../../config/config.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import {
  apiRoot,
  USERS,
  GET_POLL,
  NOTIFICATIONS
} from "../../utils/constants/endpoints.js";

import "../../assets/libraryScss/antd-scss/newantd.scss";
import "../../assets/libraryScss/area-code.scss";
import "./style.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.cookie("get", "jobhax_access_token"),
      active: false,
      isUserLoggedIn:
        this.cookie("get", "jobhax_access_token") == ("" || null)
          ? false
          : this.cookie("get", "user_type") == "0"
          ? "signup?=intro"
          : this.cookie("get", "user_type") == null
          ? "signup?=intro"
          : this.cookie("get", "user_type") == "signup?=intro"
          ? false
          : true,
      isAuthenticationChecking: true,
      isInitialRequest: "beforeRequest",
      isGapiReady: false,
      isPollChecking: true,
      isPollShowing: false,
      isAlertShowing: false,
      isNotificationsShowing: false,
      isAppReRenderRequested: false,
      alertType: "",
      alertMessage: "",
      profilePhotoUrl: "",
      pollData: [],
      notificationsList: [],
      syncResponseTimestamp: null,
      user: {}
    };
    this.notificationsList = [];
    this.handleSignOut = this.handleSignOut.bind(this);
    this.toggleIsPollShowing = this.toggleIsPollShowing.bind(this);
    this.checkNotifications = this.checkNotifications.bind(this);
    this.toggleNotificationsDisplay = this.toggleNotificationsDisplay.bind(
      this
    );
    this.setIsUserLoggedIn = this.setIsUserLoggedIn.bind(this);
    this.setIsAuthenticationChecking = this.setIsAuthenticationChecking.bind(
      this
    );
    this.reRunComponentDidUpdate = this.reRunComponentDidUpdate.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.cookie = this.cookie.bind(this);
    this.handleTokenExpiration = this.handleTokenExpiration.bind(this);
    this.passStatesFromHeader = this.passStatesFromHeader.bind(this);
  }

  componentDidMount() {
    IS_CONSOLE_LOG_OPEN && console.log("loading gapi");
    window.gapi.load("client:auth2", () => {
      window.gapi.client.init({
        clientId: googleClientId,
        scope: "email https://www.googleapis.com/auth/gmail.readonly",
        prompt: "select_account"
      });
      IS_CONSOLE_LOG_OPEN && console.log("gapi loaded");
      this.handleTokenExpiration("app getPollAndProfileData").then(() => {
        this.setState({
          isInitialRequest: true,
          isAuthenticationChecking: false
        });
        if (
          this.state.isUserLoggedIn == "signup?=intro" &&
          this.cookie("get", "user_type") != "signup?=intro"
        ) {
          this.props.cookies.set("user_type", "signup?=intro", { path: "/" });
          window.location = "/signup?=intro";
        }
      });
    });
  }

  componentDidUpdate() {
    if (
      this.state.isInitialRequest === true &&
      this.state.isUserLoggedIn === true
    ) {
      this.setState({
        isInitialRequest: false
      });
      let config = { method: "GET" };
      axiosCaptcha(GET_POLL, config).then(response => {
        if (response.statusText === "OK") {
          if (response.data.success) {
            this.pollData = response.data.data;
            this.setState({ pollData: this.pollData, isPollChecking: false });
            this.state.pollData.map(
              poll =>
                poll.is_published === true &&
                this.setState({ isPollShowing: true })
            );
          }
        }
      });
      axiosCaptcha(USERS("profile/?basic=true"), config).then(response => {
        IS_CONSOLE_LOG_OPEN && console.log("photo first");
        if (response.statusText === "OK") {
          if (response.data.success == true) {
            this.props.cookies.set("user_type", response.data.data.user_type, {
              path: "/"
            });
            let profilePhotoUrl =
              response.data.data.profile_photo != ("" || null)
                ? apiRoot + response.data.data.profile_photo
                : "../../../src/assets/icons/User@3x.png";
            this.setState(
              {
                active: true,
                profilePhotoUrl: profilePhotoUrl,
                user: response.data.data
              },
              IS_CONSOLE_LOG_OPEN &&
                console.log("profilePhotoUrl", profilePhotoUrl)
            );
          }
        }
      });
      this.setState({
        isAuthenticationChecking: false
      });
    }
  }

  reRunComponentDidUpdate() {
    this.setState({ isInitialRequest: true });
  }

  async handleTokenExpiration(whatRequested) {
    IS_CONSOLE_LOG_OPEN &&
      console.log("token expiration check requested by:\n", whatRequested);
    let date = new Date();
    let now = date.getTime();
    let jobhax_access_token = this.props.cookies.get("jobhax_access_token");
    let jobhax_access_token_expiration = parseFloat(
      this.props.cookies.get("jobhax_access_token_expiration")
    );
    let remember_me = this.props.cookies.get("remember_me");
    if (jobhax_access_token === null) {
      this.handleSignOut();
      this.showAlert(5000, "info", "Your session time is over!");
    } else {
      if (jobhax_access_token_expiration === null) {
        this.handleSignOut();
        this.showAlert(5000, "info", "Your session time is over!");
      }
      let expiresIn = jobhax_access_token_expiration - parseFloat(now);
      let expirationWarning = 5 * 60 * 1000;
      if (expiresIn < expirationWarning) {
        IS_CONSOLE_LOG_OPEN &&
          console.log(
            "jobhax token expiration time checked",
            jobhax_access_token_expiration,
            now,
            "\n jobhax token expires in",
            expiresIn,
            expirationWarning
          );
        if (remember_me === "true") {
          await this.refreshJobhaxToken();
        } else {
          this.cookie("remove_all");
          this.handleSignOut();
          this.showAlert(5000, "info", "Your session time is over!");
        }
      } else {
        await this.checkGoogleTokenExpiration(now);
      }
    }
  }

  async refreshJobhaxToken() {
    this.jobhax_refresh_token = this.props.cookies.get("jobhax_refresh_token");
    let config = { method: "POST", body: {} };
    config.body["refresh_token"] = this.jobhax_refresh_token;
    config.body["client_id"] = jobHaxClientId;
    config.body["client_secret"] = jobHaxClientSecret;
    const response = await axiosCaptcha(USERS("refreshToken"), config, false);
    if (response.statusText === "OK") {
      if (response.data.success == true) {
        this.token = `${
          response.data.data.token_type
        } ${response.data.data.access_token.trim()}`;
        this.refresh_token = response.data.data.refresh_token;
        this.setState({
          token: this.token,
          isUserLoggedIn: true,
          active: true
        });
        let date = new Date();
        date.setSeconds(date.getSeconds() + response.data.data.expires_in);
        this.props.cookies.set(
          "jobhax_access_token",
          this.token,
          { path: "/" },
          date
        );
        this.props.cookies.set(
          "jobhax_access_token_expiration",
          parseFloat(date.getTime()),
          { path: "/" }
        );
        this.props.cookies.set("jobhax_refresh_token", this.refresh_token, {
          path: "/"
        });
      }
    }
  }

  async checkGoogleTokenExpiration(now) {
    let google_access_token_expiration = parseFloat(
      this.props.cookies.get("google_access_token_expiration")
    );
    let expiresIn = google_access_token_expiration - parseFloat(now);
    let expirationWarning = 10 * 60 * 1000;
    IS_CONSOLE_LOG_OPEN &&
      console.log(
        "google token expiration time checked",
        google_access_token_expiration,
        now,
        "\n google token expires in",
        expiresIn,
        expirationWarning
      );
    if (
      google_access_token_expiration &&
      google_access_token_expiration - parseFloat(now) < expirationWarning
    ) {
      IS_CONSOLE_LOG_OPEN && console.log("updating google access token");
      this.reloadGoogle = await window.gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .reloadAuthResponse();
      let newGoogleToken = this.reloadGoogle.access_token;
      let newExpiresIn = this.reloadGoogle.expires_in;
      let googleAccessTokenExpiresOn = new Date();
      googleAccessTokenExpiresOn.setSeconds(
        googleAccessTokenExpiresOn.getSeconds() + newExpiresIn
      );
      this.props.cookies.set(
        "google_access_token_expiration",
        googleAccessTokenExpiresOn.getTime(),
        { path: "/" }
      );
      let config = { method: "POST" };
      config["body"] = { token: newGoogleToken };
      axiosCaptcha(USERS("updateGmailToken"), config, false);
      IS_CONSOLE_LOG_OPEN &&
        console.log("google token refreshed", newGoogleToken);
    } else {
      IS_CONSOLE_LOG_OPEN && console.log("google is also okay!");
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

  passStatesFromHeader(timestamp) {
    this.setState({ syncResponseTimestamp: timestamp });
  }

  setIsUserLoggedIn(isUserLoggedIn) {
    this.reRunComponentDidUpdate();
    this.setState({
      isUserLoggedIn: isUserLoggedIn,
      token: this.cookie("get", "jobhax_access_token")
    });
  }

  setIsAuthenticationChecking(isAuthenticationChecking) {
    this.setState({ isAuthenticationChecking: isAuthenticationChecking });
  }

  cookie(method, name, data, path, expires) {
    const { cookies } = this.props;
    if (method.toUpperCase() === "GET") {
      return cookies.get(name);
    } else if (method.toUpperCase() === "SET") {
      cookies.set(name, data, { path: path, expires: expires });
    } else if (method === "remove_all") {
      IS_CONSOLE_LOG_OPEN && console.log("cookies removing");
      cookies.remove("jobhax_access_token", { path: "/" });
      cookies.remove("jobhax_refresh_token", { path: "/" });
      cookies.remove("google_access_token_expiration", { path: "/" });
      cookies.remove("google_login_first_instance", { path: "/" });
      cookies.remove("jobhax_access_token_expiration", { path: "/" });
      cookies.remove("remember_me", { path: "/" });
      cookies.remove("user_type", { path: "/" });
    } else if (method === "remove") {
      IS_CONSOLE_LOG_OPEN && console.log("cookies removing");
      cookies.remove(name, { path: "/" });
    }
  }

  async checkNotifications() {
    await this.handleTokenExpiration("app checkNotifications");
    let config = { method: "GET" };
    axiosCaptcha(NOTIFICATIONS, config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          this.notificationsList = response.data.data;
          this.setState({
            notificationsList: this.notificationsList
          });
          return this.notificationsList;
        }
      }
    });
  }

  handleSignOut() {
    IS_CONSOLE_LOG_OPEN && console.log("handle signout first");
    this.cookie("remove_all");
    this.setState({
      isUserLoggedIn: false
    });
    event && event.preventDefault();
    let config = { method: "POST" };
    config["body"] = {
      client_id: jobHaxClientId,
      client_secret: jobHaxClientSecret
    };
    config.body.token = this.state.token.replace("Bearer ", "");
    axiosCaptcha(USERS("logout"), config, false).then(response => {
      if (response.statusText === "OK") {
        IS_CONSOLE_LOG_OPEN && console.log(response.data);
        if (response.data.success === true) {
          window.gapi.auth2.getAuthInstance().signOut();
          this.setState({
            token: "",
            active: false,
            pollData: [],
            notificationsList: [],
            profileData: []
          });
          IS_CONSOLE_LOG_OPEN &&
            console.log(
              "handle signOut isUserLoggedIn",
              this.state.isUserLoggedIn
            );
        } else {
          IS_CONSOLE_LOG_OPEN &&
            console.log(response, response.data.error_message);
          this.showAlert(
            5000,
            "error",
            "Error: " + response.data.error_message
          );
        }
      } else {
        this.showAlert(5000, "error", "Something went wrong!");
      }
    });
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
          position: "fixed",
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
    const { isUserLoggedIn } = this.state;
    IS_CONSOLE_LOG_OPEN &&
      console.log(
        "app isUserLoggedIn",
        isUserLoggedIn,
        "\n--token",
        this.state.token,
        "\n--active?",
        this.state.active,
        "\n cookies",
        this.props.cookies.getAll()
      );
    if (this.state.isAuthenticationChecking)
      return <Spinner message="Connecting..." />;
    else if (isUserLoggedIn && !this.state.active)
      return <Spinner message="Reaching your account..." />;
    else
      return isUserLoggedIn && this.state.active ? (
        <Router>
          <div className="main-container">
            {window.location.pathname != "/home" && (
              <Header
                handleSignOut={this.handleSignOut}
                alert={this.showAlert}
                notificationsList={this.state.notificationsList}
                notificationCheck={this.checkNotifications}
                isNotificationsShowing={this.state.isNotificationsShowing}
                toggleNotifications={this.toggleNotificationsDisplay}
                profilePhotoUrl={this.state.profilePhotoUrl}
                cookie={this.cookie}
                handleTokenExpiration={this.handleTokenExpiration}
                passStatesFromHeader={this.passStatesFromHeader}
              />
            )}
            <FeedBack
              alert={this.showAlert}
              handleTokenExpiration={this.handleTokenExpiration}
            />
            {this.state.isPollShowing && (
              <PollBox
                data={this.pollData}
                togglePollDisplay={this.toggleIsPollShowing}
                alert={this.showAlert}
                cookie={this.cookie}
                handleTokenExpiration={this.handleTokenExpiration}
              />
            )}
            {this.state.isAlertShowing && <div>{this.generateAlert()}</div>}
            <Route
              exact
              path="/profile"
              render={() => (
                <ProfilePage
                  alert={this.showAlert}
                  handleTokenExpiration={this.handleTokenExpiration}
                  cookie={this.cookie}
                  setProfilePhotoUrlInHeader={this.reRunComponentDidUpdate}
                  notificationsList={this.state.notificationsList}
                  notificationCheck={this.checkNotifications}
                />
              )}
            />
            <Route
              exact
              path="/blogs"
              render={() => (
                <Blog
                  alert={this.showAlert}
                  handleTokenExpiration={this.handleTokenExpiration}
                  cookie={this.cookie}
                  user={this.state.user}
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
                  alert={this.showAlert}
                  handleTokenExpiration={this.handleTokenExpiration}
                  cookie={this.cookie}
                  syncResponseTimestamp={this.state.syncResponseTimestamp}
                />
              )}
            />
            <Route
              exact
              path="/metrics"
              render={() => (
                <Metrics
                  alert={this.showAlert}
                  handleTokenExpiration={this.handleTokenExpiration}
                  cookie={this.cookie}
                />
              )}
            />
            <Route
              exact
              path="/alumni"
              render={() => (
                <Alumni
                  alert={this.showAlert}
                  handleTokenExpiration={this.handleTokenExpiration}
                  cookie={this.cookie}
                />
              )}
            />
            <Route
              exact
              path="/events"
              render={() => (
                <Events
                  alert={this.showAlert}
                  handleTokenExpiration={this.handleTokenExpiration}
                  cookie={this.cookie}
                  user={this.state.user}
                />
              )}
            />
            <Route
              exact
              path="/mentors"
              render={() => (
                <Mentors
                  alert={this.showAlert}
                  handleTokenExpiration={this.handleTokenExpiration}
                  cookie={this.cookie}
                />
              )}
            />
            <Route
              exact
              path="/companies"
              render={() => (
                <Companies
                  alert={this.showAlert}
                  handleTokenExpiration={this.handleTokenExpiration}
                  cookie={this.cookie}
                />
              )}
            />
            <Route
              exact
              path="/signin"
              render={() =>
                window.location.search.split("=")[1] ===
                "reCapthcaCouldNotPassed" ? (
                  <Spinner message="checking reCaptcha..." />
                ) : (
                  <Redirect to="/dashboard" />
                )
              }
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
            <Route exact path="/faqs" render={() => <FAQ />} />
            <Route
              exact
              path="/action"
              render={() => <Action alert={this.showAlert} />}
            />
            <Route
              exact
              path="/action-linkedin-oauth2"
              render={() => <LinkedInOAuthAction alert={this.showAlert} />}
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
              render={() => (
                <Home
                  isUserLoggedIn={this.state.isUserLoggedIn}
                  setIsUserLoggedIn={this.setIsUserLoggedIn}
                  setIsAuthenticationChecking={this.setIsAuthenticationChecking}
                  alert={this.showAlert}
                  cookie={this.cookie}
                />
              )}
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
              path="/alumni"
              render={() => <Redirect to="signin" />}
            />
            <Route
              exact
              path="/events"
              render={() => <Redirect to="signin" />}
            />
            <Route
              exact
              path="/mentors"
              render={() => <Redirect to="signin" />}
            />
            <Route
              exact
              path="/metrics"
              render={() => <Redirect to="/signin" />}
            />
            <Route
              exact
              path="/companies"
              render={() => <Redirect to="/signin" />}
            />
            <Route
              exact
              path="/profile"
              render={() => <Redirect to="/signin" />}
            />
            <Route
              exact
              path="/events"
              render={() => <Redirect to="/signin" />}
            />
            <Route
              exact
              path="/signin"
              render={() => (
                <SignIn
                  googleAuth={this.googleAuth}
                  setIsUserLoggedIn={this.setIsUserLoggedIn}
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
                  setIsAuthenticationChecking={this.setIsAuthenticationChecking}
                  setIsUserLoggedIn={this.setIsUserLoggedIn}
                  cookie={this.cookie}
                />
              )}
            />
            <Route exact path="/faqs" render={() => <FAQ />} />
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
            <Route
              exact
              path="/action"
              render={() => <Action alert={this.showAlert} />}
            />
            <Route
              exact
              path="/action-linkedin-oauth2"
              render={() => <LinkedInOAuthAction alert={this.showAlert} />}
            />
          </div>
        </Router>
      );
  }
}

export default withCookies(App);
