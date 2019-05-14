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
  refreshTokenRequest,
  updateGoogleTokenRequest,
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
      isFirstLogin: false,
      isPollChecking: true,
      isPollShowing: false,
      isAlertShowing: false,
      isNotificationsShowing: false,
      isAppReRenderRequested: false,
      alertType: "",
      alertMessage: "",
      profilePhotoUrl: "",
      pollData: [],
      notificationsList: []
    };
    this.notificationsList = [];
    this.onAuthUpdate = this.onAuthUpdate.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.toggleIsPollShowing = this.toggleIsPollShowing.bind(this);
    this.checkNotifications = this.checkNotifications.bind(this);
    this.toggleNotificationsDisplay = this.toggleNotificationsDisplay.bind(
      this
    );
    this.setIsFirstLogin = this.setIsFirstLogin.bind(this);
    this.passStatesFromSignin = this.passStatesFromSignin.bind(this);
    this.setIsUserLoggedIn = this.setIsUserLoggedIn.bind(this);
    this.setIsUserAuthenticated = this.setIsUserAuthenticated.bind(this);
    this.setIsAuthenticationChecking = this.setIsAuthenticationChecking.bind(
      this
    );
    this.showAlert = this.showAlert.bind(this);
    this.cookie = this.cookie.bind(this);
    this.handleTokenExpiration = this.handleTokenExpiration.bind(this);

    window.gapi.load("client:auth2", () => {
      window.gapi.client.init({
        clientId: googleClientId,
        scope: "email https://www.googleapis.com/auth/gmail.readonly",
        prompt: "select_account"
      });
    });
  }

  async componentDidMount() {
    await this.handleTokenExpiration();
    let token = this.props.cookies.get("jobhax_access_token");
    if (token) {
      this.setState({ token: token, active: true, isUserLoggedIn: true });
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
      axiosCaptcha(getProfileRequest.url, getProfileRequest.config).then(
        response => {
          if (response.statusText === "OK") {
            this.profilePhotoUrl = response.data.data.profile_photo;
            this.setState(
              { profilePhotoUrl: this.profilePhotoUrl },
              IS_CONSOLE_LOG_OPEN &&
                console.log("profilePhotoUrl", this.state.profilePhotoUrl)
            );
          }
        }
      );
    }
    this.setState({ isAuthenticationChecking: false });
  }

  async handleTokenExpiration() {
    IS_CONSOLE_LOG_OPEN && console.log("test");
    let date = new Date();
    let now = date.getTime();
    let jobhax_access_token = this.props.cookies.get("jobhax_access_token");
    this.jobhax_refresh_token = this.props.cookies.get("jobhax_refresh_token");
    let jobhax_access_token_expiration = parseFloat(
      this.props.cookies.get("jobhax_access_token_expiration")
    );
    let google_access_token_expiration = parseFloat(
      this.props.cookies.get("google_access_token_expiration")
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
      let expirationWarning = 59 * 60 * 1000;
      if (expiresIn < expirationWarning) {
        IS_CONSOLE_LOG_OPEN &&
          console.log(
            "expiration time checked",
            jobhax_access_token_expiration,
            now,
            "\n expires in",
            expiresIn,
            expirationWarning,
            "jobhax_refresh_token",
            this.jobhax_refresh_token
          );
        if (remember_me === "true") {
          const { url, config } = refreshTokenRequest;
          config.body["refresh_token"] = this.jobhax_refresh_token;
          const response = await axiosCaptcha(url, config, false);
          if (response.statusText === "OK") {
            this.token = `${
              response.data.data.token_type
            } ${response.data.data.access_token.trim()}`;
            this.refresh_token = response.data.data.refresh_token;
            this.setState({ token: this.token });
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
            IS_CONSOLE_LOG_OPEN && console.log("I am returning ok? true");
            return true;
          }
        } else {
          this.cookie("remove_all");
          this.handleSignOut();
          this.showAlert(5000, "info", "Your session time is over!");
        }
      } else {
        IS_CONSOLE_LOG_OPEN &&
          console.log(
            "expiration time checked else",
            jobhax_access_token_expiration,
            now,
            "\n expires in",
            expiresIn,
            expirationWarning
          );
        if (
          google_access_token_expiration &&
          google_access_token_expiration - parseFloat(now) < 5 * 60 * 1000
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
          const { url, config } = updateGoogleTokenRequest;
          config["body"] = { token: newGoogleToken };
          axiosCaptcha(url, config, false);
          IS_CONSOLE_LOG_OPEN &&
            console.log("google token refreshed", newGoogleToken);
          return true;
        } else {
          IS_CONSOLE_LOG_OPEN && console.log("google is also okay!");
          return true;
        }
      }
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

  passStatesFromSignin(token, active, isFirstLogin) {
    this.setState({
      token: token,
      active: active,
      isFirstLogin: isFirstLogin
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

  setIsFirstLogin(isFirstLogin) {
    this.setState({ isFirstLogin: isFirstLogin });
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
      cookies.remove("jobhax_access_token_expiration", { path: "/" });
      cookies.remove("remember_me", { path: "/" });
    }
  }

  async checkNotifications() {
    await this.handleTokenExpiration();
    axiosCaptcha(notificationsRequest.url, notificationsRequest.config).then(
      response => {
        if (response.statusText === "OK") {
          this.notificationsList = response.data.data;
          this.setState({
            notificationsList: this.notificationsList
          });
          IS_CONSOLE_LOG_OPEN && console.log(this.state.notificationsList);
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
    this.cookie("remove_all");
    this.setState({
      isUserLoggedIn: false,
      isUserAuthenticated: false
    });
    event && event.preventDefault();
    IS_CONSOLE_LOG_OPEN &&
      console.log("handle signout config body", logOutUserRequest.config.body);
    logOutUserRequest.config.body.token = this.state.token.replace(
      "Bearer ",
      ""
    );
    axiosCaptcha(logOutUserRequest.url, logOutUserRequest.config, false).then(
      response => {
        if (response.statusText === "OK") {
          console.log(response.data);
          if (response.data.success === true) {
            window.gapi.auth2.getAuthInstance().signOut();
            this.setState({
              token: "",
              isFirstLogin: false,
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
            <Redirect to="/home" />;
          } else {
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
                alert={this.showAlert}
                notificationsList={this.state.notificationsList}
                notificationCheck={this.checkNotifications}
                isNotificationsShowing={this.state.isNotificationsShowing}
                toggleNotifications={this.toggleNotificationsDisplay}
                profilePhotoUrl={this.state.profilePhotoUrl}
                cookie={this.cookie}
                handleTokenExpiration={this.handleTokenExpiration}
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
                  active={this.state.active}
                  setIsFirstLogin={this.setIsFirstLogin}
                  alert={this.showAlert}
                  handleTokenExpiration={this.handleTokenExpiration}
                  cookie={this.cookie}
                />
              )}
            />
            <Route
              exact
              path="/blogs"
              render={() => (
                <Blog
                  active={this.state.active}
                  alert={this.showAlert}
                  handleTokenExpiration={this.handleTokenExpiration}
                  cookie={this.cookie}
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
                  alert={this.showAlert}
                  handleTokenExpiration={this.handleTokenExpiration}
                  cookie={this.cookie}
                />
              )}
            />
            <Route
              exact
              path="/metrics"
              render={() => (
                <Metrics
                  active={this.state.active}
                  alert={this.showAlert}
                  handleTokenExpiration={this.handleTokenExpiration}
                  cookie={this.cookie}
                />
              )}
            />
            <Route
              exact
              path="/metricsGlobal"
              render={() => (
                <MetricsGlobal
                  active={this.state.active}
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
                  active={this.state.active}
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
                this.state.isFirstLogin === false ? (
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
