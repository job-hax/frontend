import React, { Component } from "react";
import Footer from "../../Partials/Footer/Footer.jsx";
import { Link } from "react-router-dom";

import "./style.scss";
import { apiRoot } from "../../../utils/constants/endpoints.js";
import { axiosCaptcha } from "../../../utils/api/fetch_api.js";
import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants.js";
import { jobHaxClientId, jobHaxClientSecret } from "../../../config/config.js";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleDemo = this.handleDemo.bind(this);
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

  generateTopButtons() {
    const { isUserLoggedIn } = this.props;

    return isUserLoggedIn ? (
      <div className="top_buttons">
        <Link to="/dashboard">
          <button>Dashboard</button>
        </Link>
        <Link to="/aboutus">
          <button>About us</button>
        </Link>
      </div>
    ) : (
      <div className="top_buttons">
        <Link to="/aboutus">
          <button>About us</button>
        </Link>
        <Link to="/signup">
          <button>Sign up</button>
        </Link>
        <Link to="/signin">
          <button>Sign in</button>
        </Link>
      </div>
    );
  }

  generateHeaderArea() {
    return (
      <section className="header_area" id="home">
        <div className="top_buttons_and_logo">
          <div>
            <a href="#home">
              <img
                className="logo"
                src="src/assets/icons/JobHax-logo-white.svg"
                alt="JobHax-logo"
              />
              <div style={{ marginLeft: 30, fontSize: "60%", color: "white" }}>
                Alpha
              </div>
            </a>
          </div>
          {this.generateTopButtons()}
        </div>
        <div className="intro">
          <h2>Simplify your job hunt!</h2>
          <p>
            Improve your job search experience in a seamless & intuitive way
          </p>
          <a className="how_it_works_btn" onClick={() => this.handleDemo()}>
            Live Demo
          </a>
        </div>
      </section>
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
            {/* <a className="main_btn" href="#">See Details</a> */}
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
            {/* <a className="main_btn" href="#">See Details</a> */}
          </div>
          <img src={imageLink} alt="" />
        </div>
      </section>
    );
  }

  generateHowItWorksArea() {
    return (
      <div className="how_it_works_area" id="howitworks">
        {this.generateInteriorItem(
          "src/assets/images/hiw-apply.jpg",
          "Apply to jobs & have them all automatically tracked",
          "Anytime you apply for a job, we track it automatically! When we see job application emails in your inbox, we add it to your jobs dashboard. Of course, you can also manually add jobs you are interested in to have it tracked."
        )}
        {this.generateInteriorItemFlipLR(
          "src/assets/images/hiw-organize.jpg",
          "See your progression & organize your job search",
          "Once you have applied to jobs you are interested in, we want you to easily visualize and organize your job search. You can quickly see the status of all your job applications, add new information, keep all your contacts & relevant details like dates, tasks, salaries, etc. linked to your job card."
        )}
        {this.generateInteriorItem(
          "src/assets/images/hiw-predictions.jpg",
          "Get metrics & analytics on your job search",
          "As you progress through your job search, we make it easy to identify problem areas so that you can constantly make improvements. For example, we can provide you with metrics on common attributes (skills, position, experience, etc.) among jobs which you are being rejected for so you can make changes to your resume."
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="home-container">
        {this.generateHeaderArea()}
        {this.generateFeatureArea()}
        {this.generateHowItWorksArea()}
        <Footer />
      </div>
    );
  }
}

export default Home;
