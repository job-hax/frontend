import React from "react";
import { Redirect } from "react-router-dom";

import { axiosCaptcha } from "../../../utils/api/fetch_api";
import Spinner from "../../Partials/Spinner/Spinner.jsx";
import {
  IS_CONSOLE_LOG_OPEN,
  USER_TYPES
} from "../../../utils/constants/constants";
import { apiRoot } from "../../../utils/constants/endpoints";
import { jobHaxClientId, jobHaxClientSecret } from "../../../config/config";

class HandleDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: "",
      code: ""
    };
  }
  componentDidMount() {
    const setStateAsync = state => {
      return new Promise(resolve => {
        this.setState(state, resolve);
      });
    };
    const type = window.location.search.split("=")[1] || "alumni";
    const type_id = USER_TYPES[type];

    IS_CONSOLE_LOG_OPEN && console.log("handle demo first");
    let rememberMe = false;
    let config = { method: "POST" };
    config.body = {
      client_id: jobHaxClientId,
      client_secret: jobHaxClientSecret,
      user_type_id: type_id
    };
    axiosCaptcha(apiRoot + "/api/demo/", config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success === true) {
          this.token = `${
            response.data.data.token_type
          } ${response.data.data.access_token.trim()}`;
          IS_CONSOLE_LOG_OPEN && console.log(this.token);
          this.refresh_token = response.data.data.refresh_token;
          let date = new Date();
          date.setSeconds(date.getSeconds() + response.data.data.expires_in);
          this.expires_in = date;
          this.props.cookie("set", "remember_me", rememberMe, "/");
          this.props.cookie(
            "set",
            "user_type",
            response.data.data.user_type,
            "/"
          );
          this.props.cookie(
            "set",
            "signup_flow_completed",
            response.data.data.signup_flow_completed,
            "/"
          );
          this.props.cookie(
            "set",
            "jobhax_access_token",
            this.token,
            "/",
            date
          );
          this.props.cookie(
            "set",
            "jobhax_access_token_expiration",
            date.getTime(),
            "/"
          );
          this.props.cookie(
            "set",
            "jobhax_refresh_token",
            this.refresh_token,
            "/"
          );
          this.props.cookie("set", "is_demo_user", true, "/");
          this.props.passStatesToApp("isUserLoggedIn", true);
          this.props.passStatesToApp("isAuthenticationChecking", false);
          setStateAsync({ redirect: "/" });
        } else {
          this.props.alert(
            5000,
            "error",
            "Error: " + response.data.error_message
          );
        }
      } else {
        this.props.alert(5000, "error", "Something went wrong!");
      }
    });
  }
  render() {
    if (this.state.redirect === "") {
      return <Spinner message="Loading..." />;
    } else {
      return <Redirect to={this.state.redirect} />;
    }
  }
}

export default HandleDemo;
