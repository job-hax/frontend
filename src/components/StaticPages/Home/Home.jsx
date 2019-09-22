import React, { Component } from "react";
import Footer from "../../Partials/Footer/Footer.jsx";
import { Link, Redirect } from "react-router-dom";

import "./style.scss";
import { apiRoot } from "../../../utils/constants/endpoints.js";
import { axiosCaptcha } from "../../../utils/api/fetch_api.js";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";
import { jobHaxClientId, jobHaxClientSecret } from "../../../config/config.js";
import { Button } from "antd";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null
    };

    this.handleDemo = this.handleDemo.bind(this);
    this.generateSignupButton = this.generateSignupButton.bind(this);
  }

  handleDemo() {
    IS_CONSOLE_LOG_OPEN && console.log("handle demo first");
    let rememberMe = false;
    let config = { method: "POST" };
    config.body = {
      client_id: jobHaxClientId,
      client_secret: jobHaxClientSecret
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
          this.props.setIsUserLoggedIn(true);
          this.props.setIsAuthenticationChecking(false);
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

  generateSignupButton() {
    return (
      <Button
        type="primary"
        size="large"
        onClick={() => this.setState({ redirect: "/signup" })}
      >
        Sign up for free
      </Button>
    );
  }

  generateFeatureInfo(imageLink, header, body) {
    return (
      <div className="feature">
        <img src={imageLink} alt="" />
        <h4>{header}</h4>
        <p className="small-text">{body}</p>
      </div>
    );
  }

  generateFeatureArea() {
    return (
      <section className="feature_area" id="feature">
        <div className="title">
          <h2>Unique Features</h2>
          <p className="small-text">
            No more messy spreadsheets or digging through emails to see the
            status of your job applications!
          </p>
        </div>
        <div className="features">
          {this.generateFeatureInfo(
            "src/assets/icons/featureEmail.png",
            "Email Tracking",
            "Too many job app emails to dig through? We can identify & automatically track those jobs on our dashboard!"
          )}
          {this.generateFeatureInfo(
            "src/assets/icons/featureMetrics.png",
            "Metrics",
            "'We can only improve what we measure', that's why we analyze your data & give you insightful metrics to analyze."
          )}
          {this.generateFeatureInfo(
            "src/assets/icons/featureSharing.png",
            "Upcoming: Sharing",
            "This upcoming feature will allow you to share your job search progress & seek advice with someone like your career advisor."
          )}
          {this.generateFeatureInfo(
            "src/assets/icons/featurePredictions.png",
            "Upcoming: Predictions & Notifications",
            "We can do things like remind you of upcoming interviews & suggest jobs!"
          )}
        </div>
      </section>
    );
  }

  generateInteriorItem(imageLink, header, body) {
    return (
      <section className="interior_area">
        <div className="row">
          <img src={imageLink} alt="" />
          <div className="text-group">
            <h4>{header}</h4>
            <p className="small-text">{body}</p>
            {this.generateSignupButton()}
          </div>
        </div>
      </section>
    );
  }

  generateInteriorItemFlipLR(imageLink, header, body) {
    return (
      <section className="interior_area">
        <div className="row flipLR">
          <div className="text-group">
            <h4>{header}</h4>
            <p className="small-text">{body}</p>
            {this.generateSignupButton()}
          </div>
          <img src={imageLink} alt="" />
        </div>
      </section>
    );
  }

  generateHomePageFirstItem() {
    return (
      <div className="homepage-first-item">
        <div className="content-big-container">
          <div className="content-container">
            <h4>Simplify your job hunt!</h4>
            <p className="small-text">
              Track your application progress in a seamless and intuitive way.
            </p>
            <div className="buttons-container">
              <Button onClick={this.handleDemo} size="large">
                {" "}
                Try it out!{" "}
              </Button>
              {this.generateSignupButton()}
            </div>
          </div>
        </div>
        <div className="image-big-container">
          <div className="image-container">
            <img
              className="envelopes"
              src={"src/assets/images/gmail_envelopes.png"}
            ></img>
            <img
              className="dashboard-main"
              src={"src/assets/images/dashboard_main.png"}
            ></img>
          </div>
        </div>
      </div>
    );
  }

  generateHowItWorksArea() {
    return (
      <div className="how_it_works_area" id="howitworks">
        {this.generateInteriorItem(
          "src/assets/images/mail_parse.png",
          "Create a card for each application",
          "Apply anywhere - get it tracked in one place. Automatically."
        )}
        {this.generateInteriorItemFlipLR(
          "src/assets/images/move.png",
          "Organize your job hunting progress",
          "Application process is visualized like no spreadsheet can do."
        )}
        {this.generateInteriorItem(
          "src/assets/images/metrics.png",
          "Leverage data to step up your job search game",
          "Hiring trends, skill analysis, interview success rate to help you hunt like a pro."
        )}
      </div>
    );
  }

  render() {
    if (this.state.redirect != null) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div className="home-container">
        {this.generateHomePageFirstItem()}
        {this.generateHowItWorksArea()}
        <Footer />
      </div>
    );
  }
}

export default Home;
