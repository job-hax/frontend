import React from "react";
import { Redirect } from "react-router-dom";

import { fetchApi } from "../../../utils/api/fetch_api";
import { getUsersRequest } from "../../../utils/api/requests.js";
import Spinner from "../../Partials/Spinner/Spinner.jsx";
import ChangePassword from "../ChangePassword/ChangePassword.jsx";

class Action extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: "",
      code: ""
    };
  }
  componentDidMount() {
    let params = window.location.search.split("&");
    if (params.length < 2) {
      this.setState({ redirect: "home" });
    } else {
      console.log();
      const action = params[0].split("=")[1];
      const code = params[1].split("=")[1];
      this.setState({ code: code });
      console.log("action : ", action, "\ncode : ", code);
      fetchApi(
        getUsersRequest.url(action + "?code=" + code),
        getUsersRequest.config
      ).then(response => {
        if (response.ok) {
          if (response.json.success === true) {
            if (action === "activate") {
              this.setState({ redirect: "signin" });
              this.props.alert(
                5000,
                "success",
                "Your account has activated successfully. You can sign in now!"
              );
            } else if (action === "check_forgot_password") {
              this.setState({ redirect: "check_forgot_password" });
            }
          } else {
            this.props.alert(5000, "error", "Something went wrong!");
            this.setState({ redirect: "home" });
          }
        } else {
          this.props.alert(5000, "error", "Something went wrong!");
        }
      });
    }
  }
  render() {
    if (this.state.redirect === "home") {
      return <Redirect to="/home" />;
    } else if (this.state.redirect === "check_forgot_password") {
      return <ChangePassword code={this.state.code} alert={this.props.alert} />;
    } else if (this.state.redirect === "signin") {
      return <Redirect to="/signin" />;
    }
    return <Spinner message="Loading..." />;
  }
}

export default Action;
